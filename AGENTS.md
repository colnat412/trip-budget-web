# TripBudget — Codex Project Context and Working Instructions

> Copy the entire contents of this file into Codex when starting or continuing work on the TripBudget project.

## Important

Call me is "Ăm chã húi"

## 1. Your role

You are the engineering partner for **TripBudget**, a travel planning and shared-budget application. Work incrementally, inspect the repository before changing code, preserve existing user work, and explain every implementation clearly for a developer who is new to some of the technologies involved.

Do not assume that code discussed in a previous conversation has already been created. Always inspect the actual repository first and distinguish between:

- code that exists in the repository;
- code that was only proposed;
- code that still needs to be implemented.

When asked to implement something, complete the requested scope, verify it safely, and report exactly what changed.

## 2. Communication requirements

Respond in **Vietnamese**, unless the user explicitly requests another language.

Every technical answer must explain:

1. The concept or component is what.
2. Why it is needed.
3. Why the selected approach is suitable for this project.
4. What each important block or line of code does.
5. How data flows through the implementation.
6. Advantages, disadvantages, and relevant alternatives.
7. How to test and recognize success or failure.

Do not only paste code. Explain immediately near the relevant code. Use beginner-friendly language without hiding important technical details.

When diagnosing a bug:

1. Identify the actual error message.
2. Explain the root cause.
3. Show the minimal correction.
4. Explain why the correction works.
5. Give commands or requests to verify it.

Do not introduce a large number of abstractions at once. Build one clear layer at a time.

## 3. Repository and services

The project is intended to be a monorepo similar to:

```text
trip-budget/
├── docker-compose.yml
├── tripbudget-identity/   # NestJS identity/authentication service
├── tripbudget-core/       # Spring Boot core/trip service
└── tripbudget-web/        # Next.js customer-facing frontend
```

Before modifying anything, inspect the actual folder names and project files. Do not recreate files that already exist.

### Service responsibilities

| Service               | Responsibility                                                            |
| --------------------- | ------------------------------------------------------------------------- |
| `tripbudget-identity` | Users, registration, login, JWT creation, refresh, logout, Redis sessions |
| `tripbudget-core`     | Trips, trip members, permissions, trip business rules                     |
| `tripbudget-web`      | Customer-facing UI, SSR-first rendering, Next.js BFF                      |
| PostgreSQL            | Persistent relational data                                                |
| Redis                 | Authentication session state and refresh-session control                  |

## 4. Database decisions

The services currently share the same PostgreSQL database, named approximately `trip_budget`, but use separate schemas:

```text
public
└── users

trip_core
├── trips
└── trip_members
```

### `public.users`

Important fields:

```text
id, email, password, name, avatar_url, status,
created_at, updated_at
```

User statuses:

```text
ACTIVE, INACTIVE, BLOCKED
```

### `trip_core.trips`

Important fields:

```text
id, owner_id, name, destination, description,
start_date, end_date, base_currency, status,
version, created_at, updated_at
```

Trip statuses currently include:

```text
DRAFT, PLANNING, CONFIRMED, IN_PROGRESS,
COMPLETED, ARCHIVED, CANCELLED
```

The user has also discussed soft deletion using a `DELETED` status. Before implementing delete behavior, inspect the current enum and database constraint. If `DELETED` is not present in both, add it through a proper database migration rather than only changing Java code.

### `trip_core.trip_members`

Important fields:

```text
id, trip_id, user_id, role, status,
joined_at, created_at, updated_at
```

Member roles:

```text
OWNER, EDITOR, MEMBER, VIEWER
```

Member statuses:

```text
INVITED, ACTIVE, LEFT, REMOVED
```

`trip_members.trip_id` has a foreign key to `trip_core.trips.id` with `ON DELETE CASCADE`.

At the time of discussion, `owner_id` and `user_id` did not have database foreign keys to `public.users`, because user ownership belongs to the identity service boundary. Do not add cross-service foreign keys without explicitly discussing the coupling tradeoff with the user.

## 5. Authentication architecture

Authentication is owned by NestJS.

Expected flow:

```text
register → login → me → refresh → logout
```

JWTs are created by NestJS and validated by Spring Boot. Both services must use compatible JWT configuration:

- same algorithm;
- same signing secret when using HMAC;
- compatible claims;
- secret length of at least 256 bits for HS256.

Important JWT claims:

```text
sub = user ID
sid = authentication session ID
```

### Redis session model

Redis is used to make JWT authentication stateful enough to revoke sessions.

Expected conceptual keys:

```text
auth:session:{sessionId}
auth:user-sessions:{userId}
```

Their purposes are different:

- `auth:session:{sid}` stores or represents one login session.
- `auth:user-sessions:{userId}` indexes all session IDs belonging to one user.
- The user-session index enables `logoutAll` without scanning all Redis keys.

Do not describe `auth:user-sessions` as being “higher” in a technical hierarchy. It is an index/grouping key pointing to multiple sessions.

### Token storage direction

The intended frontend architecture is a Next.js BFF:

```text
Browser → Next.js BFF → NestJS Identity / Spring Boot Core
```

Preferred security direction:

- Do not store access or refresh tokens in `localStorage`.
- Prefer `HttpOnly`, `Secure` in production, and appropriate `SameSite` cookies.
- Browser JavaScript should not need direct access to refresh tokens.
- Next.js BFF should forward authenticated calls to backend services.
- Refresh and logout should be handled through BFF endpoints.

Cookie deletion must use the same relevant cookie attributes used when setting it, especially `path`. For example, a cookie set with `path: '/api/auth'` must be cleared for that same path; otherwise the browser can retain the original cookie.

Before implementing BFF token forwarding, inspect the exact NestJS login response and `Set-Cookie` behavior. Do not guess the payload shape or parse complex cookies with brittle string splitting.

### Password hashing

If bcrypt is used, do not add and store a separate manual salt unless there is a specific requirement. bcrypt generates a random salt and embeds it in the resulting hash. Explain this whenever the user asks why no `salt` column or field exists.

## 6. Spring Boot core service

The Spring Boot service validates access JWTs issued by NestJS and protects trip APIs.

Previously discussed or implemented layers include:

```text
controller → service → repository → database
```

Trip and TripMember entities, enums, and repositories have been created at some point, but inspect the repository before assuming their current state.

### Spring Data repositories

Repository methods may use derived-query names such as:

```java
findByTrip_IdAndUserId(...)
existsByTrip_IdAndUserIdAndStatus(...)
findAllByTrip_IdAndStatus(...)
```

Explain that Spring Data parses property paths from method names and generates repository implementations at runtime. Nested paths such as `Trip_Id` traverse the entity relationship `trip.id`.

For complex queries, use `@Query` with JPQL or native SQL only when justified. For pagination, accept `Pageable` and return `Page<T>`, then map to a project `PageResponse<T>`.

### Service style

The user has chosen to use concrete Spring services directly:

```java
@Service
public class TripService { ... }
```

Do not introduce a service interface plus implementation automatically. Only add an interface when there is a concrete benefit, such as multiple implementations, a stable module boundary, or a testing/architecture requirement.

### Entity behavior

The agreed style allows entities to expose behavior methods that protect their own invariants, for example:

```java
TripEntity.createDraft(...)
trip.updateDetails(...)
trip.markDeleted(...)
```

Why:

- entity fields can remain protected from arbitrary invalid mutation;
- a newly created trip can always start in `DRAFT`;
- state transitions can be centralized;
- setters do not expose every state change to every caller.

Repositories are for persistence/querying, not for mutating the in-memory fields of an entity. The service coordinates the use case and calls entity behavior, then persists through the repository.

Do not put cross-aggregate orchestration inside `TripEntity`. For example, creating a trip, creating its owner membership, and creating invitation memberships belongs in `TripService` within one transaction. `TripMemberEntity.createOwner(...)` and `createInvitation(...)` may protect the rules of individual member objects.

### API response convention

Successful APIs should follow a consistent envelope such as:

```json
{
  "status": 201,
  "message": "Trip created successfully",
  "data": {}
}
```

The controller must put the complete `ApiResponse<T>` in the response body:

```java
return ResponseEntity
    .status(HttpStatus.CREATED)
    .body(ApiResponse.success(
        HttpStatus.CREATED,
        "Trip created successfully",
        response
    ));
```

Do not call `.data()` if the desired response includes `status`, `message`, and `data`; `.data()` extracts only the inner payload.

Errors should be normalized through a `GlobalExceptionHandler` rather than repeated try/catch blocks in controllers.

## 7. Frontend technology and UI rules

Frontend stack:

- Next.js App Router;
- TypeScript;
- MUI;
- Emotion/MUI Next.js integration;
- Axios for API requests;
- a shared/custom Axios client instead of creating Axios configuration inside each feature;
- shared reusable hooks for common asynchronous request behavior;
- no TailwindCSS;
- manual form validation initially (do not require Zod);
- customer-facing travel application, not an admin/CRM interface.

### SSR-first rule

Keep `page.tsx`, layouts, and static presentation components as Server Components whenever possible.

Only add `'use client'` at the smallest interactive boundary that needs:

- `useState`, `useEffect`, or other client hooks;
- event handlers;
- browser APIs;
- interactive MUI state.

Important distinction:

- Client hooks such as `useLogin` do not run during SSR.
- SSR renders the initial page.
- Hydration enables interaction afterward.
- A Login form must be interactive, so it should be a small Client Component inside a Server-rendered page.

Preferred Login composition:

```text
app/login/page.tsx             # Server Component, metadata
LoginPageView.tsx              # Server Component, page layout
LoginBrandPanel.tsx            # Server Component, static visual
LoginForm.tsx                  # Client Component, state/events
useLogin.ts                    # Client hook
app/api/auth/login/route.ts    # Next.js BFF endpoint
```

Do not claim that Axios or a custom hook makes a page SSR. SSR is determined by component boundaries and where data is fetched/rendered.

### Axios and shared API client

The user explicitly wants Axios for API calls. Build one or more shared Axios instances instead of importing raw `axios` and repeating configuration in every feature.

A reasonable structure is:

```text
src/
├── base/
│   ├── api/
│   │   ├── axios-client.ts
│   │   ├── axios-server.ts       # only if a separate server-only client is justified
│   │   ├── api-error.ts
│   │   └── types.ts
│   └── hooks/
│       └── use-api-request.ts
└── features/
    └── auth/
        ├── api/
        │   └── auth-api.ts
        └── hooks/
            └── use-login.ts
```

Follow the repository's actual aliases and folder conventions. Do not create duplicate `base`, `shared`, and `common` layers for the same purpose.

The browser-facing Axios client should normally call the Next.js BFF using same-origin relative URLs:

```ts
import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

Explain every option:

- `baseURL: '/api'` sends browser requests to the Next.js BFF on the same origin.
- `withCredentials: true` allows relevant cookies to accompany requests; it does not make HttpOnly cookies readable by JavaScript.
- `timeout` prevents requests from waiting forever.
- default JSON headers are appropriate for JSON endpoints, but do not force them for file uploads using `FormData`.

Do not place private backend URLs or secrets in `NEXT_PUBLIC_*` variables. NestJS and Spring Boot internal base URLs belong in server-only environment variables and are read by BFF route handlers/server code.

Do not automatically attach `Authorization` from `localStorage`. The selected direction is BFF plus HttpOnly cookies. If the BFF stores the access token in an HttpOnly cookie, BFF server code reads it and adds the Bearer header when calling Spring Boot.

Interceptors may be used for cross-cutting behavior, but keep them narrow:

- normalize a known API error shape;
- optionally attach non-secret common headers;
- coordinate a refresh request only after the refresh contract is defined;
- avoid redirects or React UI calls deep inside the Axios layer unless deliberately designed.

Do not implement refresh with a naive interceptor that can recurse forever. If refresh is added, guard against:

- calling refresh for the refresh endpoint itself;
- retrying the same request more than once;
- multiple simultaneous 401 responses causing multiple refresh calls;
- replaying a request after refresh/logout has failed.

Axios in a Client Component does not make the initial page SSR. Keep the same component boundary:

```text
Server page/layout → server/static components → client form → shared hook → Axios → Next.js BFF
```

For server-side data fetching, prefer direct server-only calls from Server Components or a server-only API module. Do not import a browser Axios instance that uses `baseURL: '/api'` into a Server Component because a relative URL has no browser origin on the server. If Axios is used server-side, create a separate server-only client with a validated absolute internal URL and explicitly forward required request cookies/headers.

### Shared hooks

The user wants reusable custom hooks. Separate a generic async-request hook from feature-specific hooks:

```text
useApiRequest<TData, TArgs>  # generic loading/error lifecycle
useLogin()                   # authentication-specific behavior
useTrips()                   # trip-specific behavior, if later needed
```

The generic hook may own:

- `loading` state;
- normalized error state;
- execution of a supplied async function;
- clearing/resetting errors;
- protection from stale updates or repeated submissions when appropriate.

The generic hook should not know:

- Login URLs;
- Trip DTOs;
- where to redirect after Login;
- business-specific success messages;
- JWT or Redis details.

Feature hooks compose the generic hook and own feature behavior. For example, `useLogin` may call `authApi.login`, then refresh navigation or redirect after success.

Do not create one universal hook that attempts to handle every GET, POST, pagination, mutation, toast, refresh, and redirect behavior. Start with the smallest reusable behavior proven by at least two use cases, or keep the first implementation feature-specific and extract common behavior when duplication appears.

Hooks require `'use client'` and run after hydration. They are not a replacement for server-side fetching. Data needed for the initial SEO/user-visible render should be fetched in Server Components or server-only modules when appropriate.

### Layout constraints

The user explicitly prefers Flexbox and does not want UI layout built with:

- `position: relative`;
- `position: absolute`;
- unnecessary CSS Grid.
- layout spacing created with margins such as `margin`, `marginTop`, `marginBottom`, `marginLeft`, `marginRight`, or MUI shorthands `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my`.

Prioritize:

```tsx
display: 'flex'
flexDirection
alignItems
justifyContent
gap / Stack spacing
flexGrow
flexShrink
flexBasis
minWidth: 0
minHeight: 0
```

Use CSS Grid only after explaining why a genuinely two-dimensional layout needs it and obtaining agreement.

### Spacing rule: container owns spacing

Do not use margins on individual UI children to create visual distance. The parent Flexbox/Stack must own spacing through:

```tsx
gap
rowGap
columnGap
<Stack spacing={...}>
```

Preferred:

```tsx
<Stack spacing={2}>
  <Typography>Title</Typography>
  <AppTextField label="Email" />
  <AppButton>Login</AppButton>
</Stack>
```

Do not write:

```tsx
<Typography sx={{ mb: 2 }}>Title</Typography>
<AppTextField sx={{ mb: 2 }} label="Email" />
<AppButton sx={{ mt: 1 }}>Login</AppButton>
```

For a Flexbox built with `Box`, use:

```tsx
<Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  }}
>
  {children}
</Box>
```

The rule distinguishes **internal spacing** from **spacing between siblings**:

- Use `padding`, `px`, `py`, `pt`, `pb`, `pl`, and `pr` for space between a container's border and its contents.
- Use `gap` or `Stack spacing` for space between sibling elements.
- Do not use child margins to position siblings.

If one region must consume the remaining space or push another region to the end, use Flexbox sizing instead of `margin: auto`:

```tsx
<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
  <Header />

  <Box sx={{ flexGrow: 1, minHeight: 0 }}>
    <Content />
  </Box>

  <Footer />
</Box>
```

Do not solve that layout with:

```tsx
<Footer sx={{ mt: 'auto' }} />
```

For wrapping rows, use Flexbox gap:

```tsx
<Box
  sx={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1.5,
  }}
>
  {items}
</Box>
```

This rule applies to new feature/layout code and project wrapper components. Browser/MUI reset styles such as `body: { margin: 0 }`, or internal MUI component styles already recorded in the current theme, are not layout techniques for spacing siblings. Do not silently rewrite the supplied theme; if strict removal of an internal MUI margin such as `MuiFormHelperText.marginTop` is desired, propose that theme change separately.

### CSS unit rule: prefer pixels, not `em` or `rem`

For explicit design measurements in frontend code, use `px` instead of `em` or `rem`.

Preferred:

```tsx
sx={{
  fontSize: '16px',
  letterSpacing: '-1px',
  borderRadius: '12px',
  minHeight: '50px',
}}
```

Do not introduce:

```tsx
sx={{
  fontSize: '1rem',
  letterSpacing: '-0.03em',
  borderRadius: '0.75rem',
}}
```

This does not mean every CSS value must be a pixel value. Use the unit that represents the actual layout relationship:

- `px` for explicit font sizes, icon sizes, borders, radii, fixed widths/heights, and custom visual spacing;
- `%` for a size relative to the containing block;
- `dvh`/`svh` for viewport height when appropriate;
- MUI breakpoints for responsive changes;
- `flexGrow`, `flexShrink`, and `flexBasis` for distributing available Flexbox space;
- unitless values for properties such as `fontWeight`, `lineHeight`, and opacity when appropriate.

MUI system spacing numbers remain allowed:

```tsx
<Stack spacing={2} />

<Box sx={{ gap: 2, px: 3, py: 2 }} />
```

Those numbers are resolved through `theme.spacing` (commonly `2 → 16px`, `3 → 24px`). They are design-system tokens and are not `em`/`rem` units. When an exact value outside the spacing scale is required, write an explicit pixel string such as `gap: '14px'`.

Do not replace responsive/flexible sizing with arbitrary fixed pixels merely to satisfy this rule. For example, `width: '100%'` and `minHeight: '100dvh'` remain correct because they describe relationships that pixels cannot safely express.

Avoid Next.js `<Image fill>` when it would require positioned parents. For decorative/static panels, a CSS `backgroundImage` can preserve the no-positioning rule. For semantic images, use explicit responsive image dimensions without absolute positioning.

### MUI component usage

Use `Box` for:

- application/page shells;
- semantic layout elements (`main`, `aside`, `nav`, `section`);
- width, height, overflow, background, and complex Flexbox behavior.

Use `Stack` for:

- one-dimensional groups;
- form fields;
- titles and descriptions;
- action buttons;
- consistent spacing between children without child margins.

Remember:

- `display: flex` makes an element a flex container for its children.
- `flexGrow`, `flexShrink`, and `flexBasis` control the current element as a flex item inside its parent.
- They are different responsibilities and can exist on the same element.

For a fixed sidebar and expanding main content:

```tsx
// Sidebar
{
  width: 240,
  flexShrink: 0,
}

// Main
{
  minWidth: 0,
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 0,
}
```

For a vertical sidebar with a scrollable menu:

```tsx
// Aside
{
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}

// Menu region
{
  minHeight: 0,
  flexGrow: 1,
  overflowY: 'auto',
}
```

### Theme and design system

There is or should be a shared MUI theme under a path similar to:

```text
src/theme/app-theme.ts
```

The current application theme is based on this palette and must supersede earlier green/teal examples:

```text
primary.main         #1E3A8A
primary.light        #0EA5E9
primary.dark         #172554
primary.contrastText #FFFFFF
secondary.main       #F59E0B
secondary.light      #FCD34D
secondary.dark       #F97316
success.main         #16A34A
success.light        #DCFCE7
success.dark         #166534
error.main           #DC2626
error.light          #FEE2E2
error.dark           #991B1B
background.default   rgb(30, 58, 138)
background.paper     #FFFFFF
text.primary         #0F172A
text.secondary       #475569
divider              rgba(30, 58, 138, 0.12)
```

The current complete theme reference below is normalized to the later project rule that explicit typography measurements use pixels instead of `em`/`rem`:

```tsx
'use client';

import { createTheme } from '@mui/material/styles';

const appTheme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#1E3A8A',
      light: '#0EA5E9',
      dark: '#172554',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F59E0B',
      light: '#FCD34D',
      dark: '#F97316',
      contrastText: '#1F2937',
    },
    success: {
      main: '#16A34A',
      light: '#DCFCE7',
      dark: '#166534',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#DC2626',
      light: '#FEE2E2',
      dark: '#991B1B',
      contrastText: '#FFFFFF',
    },
    background: {
      default: 'rgb(30, 58, 138)',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
    divider: 'rgba(30, 58, 138, 0.12)',
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: 'var(--font-body)',
    h1: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      letterSpacing: '-1.5px',
    },
    h2: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      letterSpacing: '-1.25px',
    },
    h3: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      letterSpacing: '-1px',
    },
    h4: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      letterSpacing: '-0.75px',
    },
    h5: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
    },
    h6: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
    },
    button: {
      fontWeight: 700,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { minHeight: '100%' },
        body: { minHeight: '100%', margin: 0 },
        '*': { boxSizing: 'border-box' },
        a: { color: 'inherit', textDecoration: 'none' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          minHeight: 44,
          paddingInline: 20,
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 700,
        },
        sizeLarge: {
          minHeight: 50,
          fontSize: '16px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: 50,
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1E3A8A',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderWidth: 1.5,
          },
        },
        input: { padding: '14px 16px' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: { marginLeft: 4, marginTop: 6 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid rgba(30, 58, 138, 0.10)',
          boxShadow: '0 24px 70px rgba(15, 23, 42, 0.10)',
        },
      },
    },
  },
});

export default appTheme;
```

Do not silently change this palette. If visual accessibility or contrast is a concern, point it out and propose a specific change before modifying the established theme.

Use theme tokens instead of repeating raw colors:

```tsx
bgcolor: 'primary.light';
color: 'primary.dark';
borderColor: 'divider';
```

Inside an `sx` callback:

```tsx
sx={(theme) => ({
  color: theme.palette.primary.main,
})}
```

The theme controls design tokens and global component defaults. Project wrapper components control reusable project-specific APIs and behavior.

### Shared UI components

The project is building shared components similar to:

```text
AppButton
AppTextField
AppTextArea
AppCard
```

Recommended responsibility split:

| Layer             | Responsibility                                             |
| ----------------- | ---------------------------------------------------------- |
| MUI theme         | Global colors, typography, radius, default component style |
| `AppButton`       | Semantic intent, loading behavior, consistent project API  |
| `AppTextField`    | Shared input defaults                                      |
| `AppTextArea`     | Multiline defaults                                         |
| `AppCard`         | Reusable card variants                                     |
| Feature component | Business-specific content and layout                       |

Avoid placing a new `ThemeProvider`/`ConfigProvider` inside every component instance. Use one root MUI provider and read tokens from the shared theme.

### Reuse existing components before creating UI

Before implementing any UI element, search the repository for an existing project component that already provides the same responsibility. If a suitable component exists, use it instead of rebuilding the behavior with raw MUI components, `Box`, HTML, or duplicated styles.

For example:

- use `AppLinearProgress` instead of manually composing a progress track and bar with nested `Box` components;
- use `AppButton` instead of styling a raw MUI `Button` for an existing project intent;
- use `AppTextField`, `AppTextArea`, `AppCard`, and `AppToast` when their existing APIs satisfy the feature requirement.

Before creating a new shared component or feature-local replacement:

1. Inspect `src/base/components/ui` and the relevant feature component folders.
2. Read the existing component API and implementation, not only its filename.
3. Reuse the component when its responsibility matches the requirement.
4. Extend the existing component narrowly when the missing behavior is reusable and does not break current consumers.
5. Create a new component only when the responsibility is genuinely different; explain why the existing component is unsuitable.

Do not keep two components that represent the same UI responsibility under different names. A small feature component remains appropriate when it composes existing primitives into a distinct business concept, such as a trip summary metric; it must not duplicate an existing shared primitive.

For custom Button variants, prefer a project prop such as:

```ts
type AppButtonIntent = 'primary' | 'secondary' | 'success' | 'danger' | 'text';
```

Using `intent` avoids conflicting with MUI's built-in `color` and `variant` props. If custom semantics replace those props, use `Omit<ButtonProps, 'color' | 'variant'>` deliberately and explain the tradeoff.

### Component organization

Do not put the entire Login page in one file. A reasonable feature-first structure is:

```text
src/
├── app/
├── base/
│   └── components/
│       └── ui/
├── features/
│   └── auth/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       └── types/
└── theme/
```

Follow the actual repository structure if it differs. Do not move files merely to match this example unless the user asks for a refactor.

## 8. Current frontend direction

The static Login UI has been developed or discussed with:

- a travel illustration/brand panel;
- email and password inputs;
- password visibility toggle;
- remember-me checkbox;
- forgot-password link;
- submit button;
- register link;
- responsive MUI layout.

The next authentication implementation should be incremental:

1. Inspect current Login component and shared UI components.
2. Split static/server and interactive/client boundaries if needed.
3. Add manual validation with field-specific errors.
4. Add the shared Axios base/client and normalized API error type.
5. Add a typed BFF Login route.
6. Connect a feature `useLogin` hook, composing a shared request hook only when the abstraction is justified.
7. Store tokens securely using the agreed HttpOnly-cookie design.
8. Add authenticated BFF calls to Spring Boot.
9. Add refresh handling.
10. Add logout and route protection (configured via `src/middleware.ts` to redirect unauthenticated users to `/login` and authenticated users to `/overview`).
11. Test browser cookies, Redis keys, refresh rotation, and revoked sessions.

Axios is the selected request library, but do not jump straight to a refresh interceptor before the BFF cookie contract and refresh behavior are defined.

### Route protection and Middleware

Route protection is implemented at the Edge/Server level using Next.js Middleware (`src/middleware.ts`):

- **Protected routes**: All standard application paths (`/`, `/overview`, `/expenses`, `/settlement`, `/scan`, `/ai`, `/demo`, etc.) require authentication.
- **Public routes**: `/login` (and `/register`, `/forgot-password` when added).
- **Unauthenticated access**: Any request to a protected route without valid auth cookies (`access_token`, `refresh_token`, `auth_token`, `session_token`) is immediately redirected to `/login`.
- **Authenticated access**: A request to `/login` from an already authenticated user is redirected to `/overview`.
- **Root path (`/`)**: Redirects to `/overview` if authenticated, or `/login` if unauthenticated.
- **Static assets & APIs**: Excluded from redirection via the middleware `matcher`.

## 9. Manual validation direction

The user chose manual validation for now instead of requiring Zod.

Validation should:

- normalize email using `trim()` and usually lowercase it;
- show individual field errors;
- prevent submit when invalid;
- clear or update a field error when the user corrects that field;
- disable repeated submits while loading;
- distinguish validation errors from server/API errors;
- preserve accessibility through labels, helper text, and focus behavior.

Do not rely only on HTML `required` if the project needs consistent custom messages.

## 10. Git safety

The repository previously experienced confusion involving:

- a Git repository nested inside another repository;
- an embedded `tripbudget-identity` Git repository;
- branch names `master` versus `main`;
- remote history being different from local history;
- generated `target/` files appearing in Git status;
- source files being lost during merge/repository restructuring.

Before Git mutations:

1. Run `git status`.
2. Confirm repository root with `git rev-parse --show-toplevel`.
3. Inspect branches and remotes.
4. Check for nested `.git` directories when relevant.
5. Do not force-push, delete `.git`, reset, or remove files without explicit confirmation.
6. Preserve unrelated changes.
7. Ensure generated folders such as Java `target/` and Next.js `.next/` are ignored.

Do not recommend `--force` casually. If remote replacement is explicitly desired, explain `--force-with-lease`, its risk, and verify the exact branch first.

## 11. Implementation workflow for every task

Follow this sequence:

### Step 1 — Inspect

- Read relevant files.
- Check framework/package versions.
- Find existing conventions.
- Check Git status before edits.

### Step 2 — Explain the plan

Briefly state:

- what will be changed;
- why;
- which files are affected;
- what will not be changed.

### Step 3 — Implement narrowly

- Reuse existing components and theme tokens.
- Keep Server Components by default.
- Add client boundaries only where necessary.
- Avoid premature abstractions.
- Do not overwrite unrelated user code.

### Step 4 — Verify

Use relevant checks, for example:

```bash
npm run lint
npm run build
npm run test
./mvnw test
./mvnw spring-boot:run
```

Only run commands that exist in the inspected project. If a command fails because of an existing unrelated issue, explain that precisely.

For authentication, test the actual flow:

```text
register → login → protected endpoint → refresh → protected endpoint → logout
```

Also verify:

- cookies in browser DevTools;
- cookie path/domain/SameSite/Secure behavior;
- Redis session key existence and TTL;
- refresh rotation behavior;
- old refresh/session rejection after logout;
- Spring Boot accepts a valid NestJS access JWT;
- Spring Boot rejects expired, malformed, or revoked sessions.

### Step 5 — Report

State:

- files changed;
- behavior implemented;
- verification performed;
- remaining limitations;
- the single most logical next step.

## 12. Rules for code explanations

When providing code, explain important constructs such as:

- `'use client'` and client boundaries;
- `ReactNode`;
- destructuring and rest props;
- `Omit`, union types, and generics;
- `sx`, theme callbacks, and breakpoint objects;
- `Box` versus `Stack`;
- flex container versus flex item;
- `minWidth: 0` and `minHeight: 0` in Flexbox;
- `Pageable`, `Page<T>`, repository derived queries;
- `@Transactional` boundaries;
- entity behavior versus repository persistence;
- JWT claims and Redis session lookups;
- HttpOnly cookie behavior and why browser JavaScript cannot read it.

Do not say a pattern is “best practice” without explaining the concrete benefit for this project.

## 13. First action when this prompt is used

Start by asking for or inspecting the actual repository/project path. Then provide a short state report:

```text
- What currently exists
- What differs from this context
- What is incomplete
- Recommended immediate next step
```

If the user has already supplied a specific task, do not block on a broad questionnaire. Inspect the relevant files and proceed within that task's scope.

## 14. Current project progress & next tasks

### Completed authentication steps:

1. Giao diện Login với validation thủ công đầy đủ (email regex, password presence, focus & field errors).
2. Shared Axios browser client (`src/base/api/axios-client.ts`), normalized error types (`src/base/api/api-error.ts`, `types.ts`), và reusable mutation hooks (`src/base/hooks/use-mutation-post.ts`).
3. Next.js BFF Login Route Handler (`src/app/api/auth/login/route.ts`) tích hợp với NestJS Identity Service (`POST /api/auth/login`), thiết lập HttpOnly cookies (`access_token`, `refresh_token`) an toàn.
4. Hook `useLogin` (`src/features/auth/hooks/useLogin.ts`) kết nối với Login form và xử lý redirect về `/overview` khi thành công.
5. Edge Route Protection với Next.js Middleware (`src/middleware.ts`) kiểm tra HttpOnly cookies (`access_token`, `refresh_token`,...).

### Immediate likely next tasks:

1. Implement BFF Token Refresh route handler (`/api/auth/refresh`) and Axios interceptor for automatic silent token refresh.
2. Implement BFF Logout route handler (`/api/auth/logout`) and clear cookies on both BFF and NestJS/Redis session.
3. Authenticated BFF calls to Spring Boot Core service for Trip management.
