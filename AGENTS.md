# TripBudget — Codex Project Context and Working Instructions

> Copy the entire contents of this file into Codex when starting or continuing work on the TripBudget project.

## Important

Call me is "Ăm chã húi",
Skip smoke test

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

### User Authentication & Current User Injection Convention (@CurrentUser)

The core Spring Boot service validates JWT access tokens issued by the Identity service. To obtain the authenticated user inside controllers in a clean, type-safe, and secure manner, the application uses a custom meta-annotation:

- **Annotation**: `com.tripbudget.tripbudget_core.common.annotations.CurrentUser`
- **DTO**: `com.tripbudget.tripbudget_core.common.dtos.CurrentUserDto` (Java Record: `Long id, String sessionId`)

#### Implementation details:

`@CurrentUser` is defined using Spring Security's `@AuthenticationPrincipal` with a SpEL constructor expression:

```java
@Target({ElementType.PARAMETER, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@AuthenticationPrincipal(
    expression = "new com.tripbudget.tripbudget_core.common.dtos.CurrentUserDto(#this)"
)
public @interface CurrentUser {}
```

SpEL `#this` refers to the authenticated `Jwt` object validated by Spring Security. The constructor `CurrentUserDto(Jwt jwt)` automatically parses `jwt.getSubject()` into `Long id` and extracts `jwt.getClaimAsString("sid")` into `String sessionId`.

#### Mandatory Controller Conventions:

1. **Standard Parameter Injection**: Always declare `@CurrentUser CurrentUserDto user` as a method parameter in controller endpoints requiring authentication.
2. **Explicit Extraction**: Explicitly declare `Long currentUserId = user.id();` at the beginning of the controller method. This improves debugging clarity and maintains consistency across all controllers.
3. **Strict Security Prohibitions**:
   - **NEVER** accept `userId` from the request body, URL query parameters, or route path variables to identify the caller. Doing so causes critical Insecure Direct Object Reference (IDOR) security vulnerabilities.
   - **NEVER** manually parse `Jwt` claims or call `jwt.getSubject()` inside controller logic.
4. **Context Passing**: Pass `currentUserId` as the first argument or contextual identifier to the service layer (e.g. `tripService.createTrip(currentUserId, ...)` or `expenseService.createExpense(currentUserId, tripId, ...)`).
5. **Reference Standard**: Reference `TripController.java` (`com.tripbudget.tripbudget_core.trip.controllers.TripController`) and `ExpenseController.java` (`com.tripbudget.tripbudget_core.expense.controllers.ExpenseController`) as the canonical standard for all controllers.

#### Mandatory Service Layer Authorization Conventions:

1. The service layer must always receive `Long currentUserId`.
2. The service layer is strictly responsible for verifying that `currentUserId` has valid permissions on the requested resource before performing any read or write operations:
   - For trip-scoped actions, verify active membership:
     ```java
     boolean isMember = tripMemberRepository.existsByTrip_IdAndUserIdAndStatus(
         tripId, currentUserId, TripMemberStatus.ACTIVE
     );
     if (!isMember) {
         throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have access to this trip");
     }
     ```
   - Alternatively, use a reusable private helper like `getActiveMemberTrip(tripId, currentUserId)` or `validateMembership(tripId, currentUserId)` which validates both trip existence (throwing `404 NOT_FOUND` if deleted or absent) and active membership (throwing `403 FORBIDDEN` if unauthorized).

### Trip Member Management & Permissions Convention

The `tripbudget-core` service manages trip participants using `TripMemberEntity`:

- **Member Roles (`TripMemberRole`)**:
  - `OWNER`: Creator or principal manager of the trip. Has full control over settings, invites, role assignments, and member removals.
  - `EDITOR`: Can invite other members (as `MEMBER`/`VIEWER`), add/update/delete expenses and configure budgets.
  - `MEMBER`: Regular participant who can view expenses and participate in expense splitting (`splits`). Can leave the trip.
  - `VIEWER`: Read-only participant.

- **Member Statuses (`TripMemberStatus`)**:
  - `ACTIVE`: Active participant who has access to the trip and appears in `/my-trips`.
  - `INVITED`: Invited participant awaiting acceptance.
  - `LEFT`: Member who voluntarily departed the trip (soft-deleted).
  - `REMOVED`: Member removed by the trip owner (soft-deleted).

#### Cross-Service User Lookup Without Foreign Keys:

To respect the database decision (Section 4, lines 140-142) preserving service isolation, `tripbudget-core` defines a read-only entity:

```java
@Entity
@Table(schema = "public", name = "users")
@Immutable
public class UserEntity { ... }
```

- No database Foreign Key DDL is created between `trip_core.trip_members` and `public.users`.
- `UserRepository` enables finding users by email for invitations (`findByEmail`) and batch-loading user profiles (`findAllByIdIn`) to populate member names, emails, and avatars in `TripMemberResponse`.

#### Trip Member Controller & BFF Endpoints:

- `GET /api/trip/{id}/members`: List all active members of the trip.
- `POST /api/trip/{id}/members`: Invite/add a member by email (`InviteMemberRequest`).
- `PUT /api/trip/{id}/members/{memberId}`: Update member role (`UpdateMemberRoleRequest`, Owner only).
- `DELETE /api/trip/{id}/members/{memberId}`: Remove a member (Owner only; Owner cannot be removed).
- `POST /api/trip/{id}/members/leave`: Non-owner member voluntarily departs the trip.

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

Do not put the entire Login page or complex feature views in one file. A reasonable feature-first structure is:

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

### Quy tắc 1 Component / 1 File (Single Responsibility per File)

Tuyệt đối **không định nghĩa nhiều components trong cùng 1 file** (ví dụ: không khai báo các helper components, sub-views, modal hosts, metric cards, hoặc danh sách phụ bên trong file component chính như `AppShell.tsx`, `Overview.tsx`, `Login.tsx`).

- Mỗi component phải nằm trong một file riêng biệt có tên tương ứng với component đó (`PascalCase.tsx`).
- Cấu trúc thư mục phải phân cấp rõ ràng: component cha import các component con từ các file độc lập hoặc thư mục con tương ứng (ví dụ: `src/features/trip/components/overview/ActiveTripBanner.tsx`, `CategoryList.tsx`, `RecentExpenseList.tsx`, `TripSummaryMetric.tsx`, `EmptyTripState.tsx`).
- Tách riêng các Host/Wrapper component (ví dụ: `CreateTripHost.tsx` tách khỏi `AppShell.tsx`).
- Giúp code rõ ràng, giảm độ phức tạp của từng file, dễ bảo trì, dễ viết unit test và tái sử dụng độc lập.

### Quy tắc Khai Báo Component Dạng Const Arrow Function & Export Default (Arrow Function Component Convention)

Toàn bộ React component (bao gồm cả Pages, Layouts, Features, và Base Components) **bắt buộc phải được khai báo dưới dạng `const` arrow function** và đặt câu lệnh `export default ComponentName;` ở dòng cuối cùng của file.

- **Nghiêm cấm**: Tuyệt đối không sử dụng cú pháp `export default function ComponentName() { ... }` hoặc anonymous export default `export default () => { ... }`.
- **Cú pháp chuẩn bắt buộc**:

  ```tsx
  interface MyComponentProps {
    title: string;
  }

  const MyComponent = ({ title }: MyComponentProps) => {
    return (
      <Box>
        <Typography>{title}</Typography>
      </Box>
    );
  };

  export default MyComponent;
  ```

- **Lý do**:
  1. Đồng nhất 100% phong cách viết component xuyên suốt dự án.
  2. Tách biệt rõ ràng phần định nghĩa component và phần export, giúp code nhất quán và tránh hoisting không mong muốn.
  3. Dễ dàng gán kiểu (như `React.FC`) hoặc định nghĩa generic types khi cần mở rộng.
  4. Hỗ trợ hiển thị tên Component rõ ràng trong React DevTools và stack traces khi debug.

### Quy tắc Sử dụng Palette Theme Cho Màu Sắc & Trạng Thái (Theme-First Palette Tokenization)

Nghiêm cấm **hardcode mã màu hex tĩnh** (`#15803D`, `#3B82F6`, `#F97316`...) trực tiếp vào component, badges, status chips, hoặc styles.

- **Luôn bám theo Theme Palette**: Mọi màu sắc cho trạng thái (status chip, indicator, border, background mờ) phải được lấy từ Theme Palette thông qua hàm theme callback trong `sx`:
  ```tsx
  bgcolor: (theme) => {
    const palette = theme.vars?.palette ?? theme.palette;
    return palette.success.main;
  };
  ```
- **Phân loại Variant chuẩn**: Sử dụng hệ thống variant ngữ nghĩa chuẩn (`success`, `primary`, `secondary`, `error`, `neutral`/`action`, `warning`, `info`) ánh xạ tương ứng vào theme tokens để đảm bảo giao diện luôn hiển thị đồng bộ và tương thích 100% với cả Light Mode lẫn Dark Mode.

### Quy tắc Tập Trung Helpers & Utilities Chung (`src/base/utils/`)

Mọi hàm xử lý logic chung, định dạng dữ liệu (date, currency, number, string) phải được đặt tập trung trong thư mục `src/base/utils/` và export qua `src/base/utils/index.ts`.

- **Không viết hàm format cục bộ**: Tuyệt đối không tự viết các hàm format riêng lẻ (như `formatDateRange`, `formatCurrency`...) bên trong các file component.
- **Có tham số mặc định rõ ràng**: Các hàm tiện ích phải thiết kế linh hoạt với giá trị mặc định chuẩn dự án (ví dụ: `formatDate(date, format = 'DD-MM-YYYY')`, `formatDateRange(start, end, format = 'DD-MM-YYYY', separator = ' – ')`).
- Giúp dễ bảo trì, tái sử dụng trên toàn bộ codebase và dễ dàng viết unit test độc lập.

### Quy tắc Thiết Kế Base-First & Tối Đa Hóa Tái Sử Dụng (Base-First & Reusability Rule)

Trước khi tạo bất kỳ UI component, dialog, menu thao tác, hay logic xử lý nào ở tầng Feature, luôn xem xét: _"Cái này có thể trừu tượng hóa thành Base để dùng lại được không?"_.

- **Đưa vào `src/base/`**: Bất kỳ pattern nào có tính chất lặp lại hoặc có thể tái sử dụng trong tương lai (như `AppConfirmDialog`, `AppDialog`, `AppActionMenu`, popup scaffolds, helper format, custom hooks chung...) **bắt buộc phải đưa vào `src/base/`** (`src/base/components/ui/`, `src/base/hooks/`, `src/base/utils/`) và export tập trung qua `index.ts`.
- **Tuyệt đối không viết rời rạc**: Nghiêm cấm viết lặp lại cùng một cấu trúc (scaffold) ở nhiều feature khác nhau (ví dụ: không tự dựng lại modal với `DialogTitle`, `DialogContent`, `DialogActions`, icon cảnh báo và nút Hủy/Xác nhận ở nhiều nơi; thay vào đó tạo `AppConfirmDialog` ở base và các feature chỉ việc truyền props).
- **Tầng Feature chỉ làm nghiệp vụ**: Các file trong `src/features/` chỉ tập trung kết nối API và truyền dữ liệu/callback vào Base Components.

### Quy tắc Duy Trì & Cập Nhật Tài Liệu Markdown Liên Tục (Continuous Markdown Synchronization)

Mỗi khi có bất kỳ thay đổi cần thiết nào về:

1. Kiến trúc hệ thống hoặc luồng dữ liệu (BFF, Gateway, Backend APIs, Cookies, Token).
2. Quy tắc lập trình mới, quy ước đặt tên hoặc cấu trúc thư mục được thống nhất với người dùng.
3. Tiến độ dự án (các bước đã hoàn thành và các task tiếp theo).

**Bắt buộc phải cập nhật ngay vào tài liệu markdown (`AGENTS.md`, `walkthrough.md`)**:

- Giúp lưu giữ ngữ cảnh đầy đủ, không bị quên hoặc vi phạm quy tắc khi chuyển giao qua các phiên làm việc tiếp theo.
- Luôn đọc lại file markdown trước khi bắt tay vào triển khai bất kỳ module mới nào.

### Quy tắc Chuẩn Hóa Đa Ngôn Ngữ VNI / ENG (Internationalization & Localization Standard)

Dự án sử dụng thư viện `next-intl` để hỗ trợ đa ngôn ngữ đầy đủ với hai tùy chọn chính: **VNI** (`vi` - Tiếng Việt) và **ENG** (`en` - Tiếng Anh). Nút chuyển đổi ngôn ngữ nằm tại TopBar (`AppPreferences.tsx`) và lưu trữ locale qua cookie `trip-budget-locale`.

**Nghiêm cấm tuyệt đối việc hardcode text hiển thị (UI strings) trực tiếp trong file mã nguồn**:

1. **Không có ngoại lệ**: Toàn bộ chuỗi văn bản người dùng nhìn thấy (tiêu đề trang, nhãn nút, label/placeholder input, options dropdown, cột bảng dữ liệu, text phân trang, thông báo toast, lỗi validation, tên danh mục, chip trạng thái...) **bắt buộc phải lấy từ từ điển thông qua hook `useTranslations`**.
2. **Đồng bộ 1:1 giữa hai từ điển**: Mọi key mới được định nghĩa phải tồn tại đồng thời ở cả hai file:
   - `messages/vi.json` (Bản địa hóa tiếng Việt - VNI)
   - `messages/en.json` (Bản địa hóa tiếng Anh - ENG)
3. **Quy ước đặt namespace và key**:
   - Phân cấp namespace theo domain/tính năng rõ ràng: `preferences`, `topBar`, `sidebar`, `trip`, `myTrips`, `expense`, `profile`, `validation`...
   - Tên key đặt theo kiểu `camelCase` mô tả đúng ngữ nghĩa (ví dụ: `pageTitle`, `addExpense`, `deleteConfirm`, `totalBudgetLabel`).
4. **Cách sử dụng chuẩn trong component**:

   ```tsx
   import { useTranslations } from 'next-intl';

   export default function MyComponent() {
     const t = useTranslations('expense');
     return <Typography>{t('pageTitle')}</Typography>;
   }
   ```

5. **Tham số hóa chuỗi linh hoạt**: Đối với các thông báo chứa dữ liệu động (số tiền, tên đối tượng, phân trang), sử dụng interpolation cú pháp `{variable}`:
   - Trong JSON: `"deleteConfirm": "Bạn có chắc chắn muốn xóa {title} trị giá {amount}?"`
   - Trong component: `t('deleteConfirm', { title: item.title, amount: formatCurrency(...) })`
6. **Định dạng tiền tệ và ngày tháng**: Luôn truyền đơn vị tiền tệ (`currency`) hoặc định dạng chuẩn qua `formatCurrency(amount, currency)` và `formatDate(date, 'DD/MM/YYYY')` từ `src/base/utils/`.

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

### Multi-Repository Workspace & VS Code "Accept All" Handling

The root folder `/home/hanbiro/lou` contains two independent Git repositories:

1. `trip-budget` (Backend Monorepo)
2. `trip-budget-web` (Frontend Next.js App)

**When clicking "Accept All" or "Stage All" in VS Code**:

- VS Code prompts with a QuickPick dropdown: `Choose a repository: [trip-budget] or [trip-budget-web]`.
- **Action**: Pick the first repository (`trip-budget`), and then if prompted or for remaining changes, accept `trip-budget-web`.
- **CAUTION**: Do NOT hit `Escape`, cancel, or click "Refresh" while the prompt is active, as cancelling mid-write truncates `.git/index` to 0 bytes (`fatal: .git/index: index file smaller than expected`).
- **One-click recovery / Stage**:
  - Run `/home/hanbiro/lou/fix-git.sh` or VS Code Task `Git: Fix Corrupted Index`.
  - To stage both simultaneously: Run VS Code Task `Git: Stage All (Both Repos)` or `git -C trip-budget add -A && git -C trip-budget-web add -A`.

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

### Completed steps:

1. Giao diện Login với validation thủ công đầy đủ (email regex, password presence, focus & field errors).
2. Shared Axios browser client (`src/base/api/axios-client.ts`), normalized error types (`src/base/api/api-error.ts`, `types.ts`), và reusable mutation hooks (`src/base/hooks/use-mutation-post.ts`, `use-query-get.ts`).
3. Next.js BFF Login Route Handler (`src/app/api/auth/login/route.ts`) tích hợp với NestJS Identity Service (`POST /api/auth/login`), thiết lập HttpOnly cookies (`access_token`, `refresh_token`) an toàn.
4. Hook `useLogin` (`src/features/auth/hooks/useLogin.ts`) kết nối với Login form và xử lý redirect về `/overview` khi thành công.
5. Edge Route Protection với Next.js Middleware (`src/middleware.ts`) kiểm tra HttpOnly cookies (`access_token`, `refresh_token`,...).
6. Next.js BFF Trip Route Handlers (`src/app/api/trip/my-trips/route.ts`, `src/app/api/trip/create/route.ts`) gắn `access_token` từ cookie gọi sang Spring Boot `TripController` (`GET /api/trip/my-trips`, `POST /api/trip/create`).
7. Tích hợp Trip Context (`TripContext.tsx`), custom hooks (`useMyTrips`, `useCreateTrip`), popup tạo chuyến đi (`CreateTripDialog`), tự động nhận diện và hiển thị chuyến đi đang diễn ra (`IN_PROGRESS`), hỗ trợ dropdown chuyển đổi chuyến đi và nút tạo mới ở Sidebar & TopBar.
8. Trang danh sách toàn bộ chuyến đi "My Trips" (`/trips`) hiển thị dưới dạng bảng dữ liệu có phân trang (`PageResponse<Trip>`), tích hợp menu Sidebar "Chuyến đi", tuân thủ nghiêm ngặt quy tắc "1 Component / 1 File" (`src/features/trip/components/my-trips/`).
9. Next.js BFF Logout Route Handler (`src/app/api/auth/logout/route.ts`) tích hợp với NestJS Identity (`POST /api/auth/logout`), hủy session Redis, xóa sạch HttpOnly cookies (`access_token`, `refresh_token`), và hook `useLogout` tự động điều hướng về `/login`.
10. Menu người dùng tại `SidebarUser` (`SidebarUserMenu.tsx`) tích hợp Popup Profile (`ProfileDialog.tsx`) xem & chỉnh sửa thông tin cá nhân (Họ tên, Email, SĐT, Role, Bio, Avatar) tái sử dụng toàn bộ UI primitives có sẵn (`AppTextField`, `AppTextArea`, `AppButton`, `AppToast`).
11. NestJS Identity Service (`tripbudget-identity`) đã cập nhật trả về đầy đủ thông tin User (`id`, `email`, `name`, `avatarUrl`, loại trừ `password` và `status`) tại endpoint `POST /api/auth/login` và bổ sung endpoint `GET /api/auth/me` để lấy thông tin profile người dùng hiện tại qua token.
12. Tích hợp User Profile toàn cục (`UserContext.tsx`, `useCurrentUser.ts`, helper `getUserInitials`), tự động fetch thông tin người dùng từ BFF `GET /api/auth/me`, hiển thị tên thật, email thật, avatar initials trên `SidebarUser` và form `ProfileDialog`.
13. Xây dựng bộ Base UI Primitives dùng chung (`AppConfirmDialog`, `AppDialog`, `AppActionMenu`, `AppLoadingOverlay`) theo quy tắc **Base-First & Reusability**. Hoàn thiện **Module Quản Lý Chuyến Đi** tích hợp với Spring Boot `TripController`: BFF routes (`GET /api/trip/[id]`, `PUT /api/trip/[id]`, `PUT /api/trip/delete/[id]`), gộp các mutation hooks (`useCreateTrip`, `useUpdateTrip`, `useDeleteTrip`) tập trung trong file [`useTripMutation.ts`](file:///home/hanbiro/lou/trip-budget-web/src/features/trip/hooks/useTripMutation.ts), hook chi tiết `useTripDetail`, popup chỉnh sửa (`EditTripDialog.tsx`, `EditTripForm.tsx`), popup xác nhận xóa (`DeleteTripDialog.tsx`), và menu thao tác dòng (`TripTableRow.tsx`, `TripTable.tsx`, `MyTrips.tsx`).
14. Triển khai hoàn chỉnh **Cơ chế Tự Động Làm Mới Token (Silent Token Refresh)**:
    - Đồng bộ thời hạn: `accessToken` (15 phút), cookie `access_token` (15 phút), `refreshToken` và Redis Session (30 ngày), cookie `refresh_token` (30 ngày).
    - Cập nhật NestJS Identity: `signOptions: { expiresIn: '15m' }`, `refreshTtlSeconds: 30 ngày`, Token Rotation tự động cấp secret mới và cập nhật hash trong Redis.
    - Next.js BFF: Route Handler `POST /api/auth/refresh/route.ts` nhận refresh cookie, kết nối NestJS và set lại cặp cookies mới trên trình duyệt.
    - Axios Client (`src/base/api/axios-client.ts`): Bổ sung 401 Response Interceptor với cơ chế hàng đợi bất đồng bộ (`failedQueue`) xử lý request đồng thời, tự động refresh ngầm và retry request cũ liền mạch, xóa cookie điều hướng về `/login` nếu phiên hết hạn.

15. Triển khai hoàn chỉnh **Module Quản lý Chi tiêu & Ngân sách (Expenses & Budgeting - `/expenses`)** xuyên suốt toàn bộ hệ thống:
    - **Spring Boot BaseEntity & Flyway Migration (`tripbudget-core`)**:
      - Tạo `BaseEntity.java` (`@MappedSuperclass` với `id`, `isDel`, `createdAt`, `updatedAt`, `@PrePersist`, `@PreUpdate`, `markDeleted()`, `restore()`), refactor `TripEntity` và `TripMemberEntity` dùng chung.
      - Tạo `V2__create_expenses_and_budgets.sql` (bổ sung `is_del` cho trips & trip_members; tạo `budgets`, `category_budgets`, `expenses`, `expense_splits`).
    - **Backend Spring Boot 3 (`com.tripbudget.tripbudget_core.expense`)**:
      - Entities kế thừa `BaseEntity`: `BudgetEntity`, `CategoryBudgetEntity`, `ExpenseEntity`, `ExpenseSplitEntity`.
      - Enums: `ExpenseCategory`, `SplitType`, `ExpenseStatus`.
      - Repositories: `ExpenseRepository`, `ExpenseSplitRepository`, `BudgetRepository`.
      - Services: `ExpenseService` (thuật toán chia tiền EQUAL/EXACT/PERCENTAGE/SHARE, tự động bù số dư lẻ vào Payer, kiểm tra thành viên), `BudgetService` (tính toán hạn mức, chi tiêu thực tế, % tiêu hao, breakdown theo danh mục).
      - Controller: `ExpenseController` (`/trip/{tripId}/expenses`, `/trip/{tripId}/expenses/summary`, `/trip/{tripId}/expenses/{expenseId}`, `/trip/{tripId}/budget`).
      - Build thành công (`mvn compile -o` -> BUILD SUCCESS).
    - **Next.js BFF Handlers (`src/app/api/trip/[id]/`)**:
      - `expenses/route.ts` (GET phân trang & POST tạo khoản chi).
      - `expenses/summary/route.ts` (GET báo cáo ngân sách).
      - `expenses/[expenseId]/route.ts` (GET, PUT, DELETE khoản chi).
      - `budget/route.ts` (POST thiết lập ngân sách tổng & danh mục).
    - **Base UI Primitives & Utilities (`src/base/`)**:
      - `currency.ts`: `formatCurrency`, `formatNumber`, `formatNumberInput` (định dạng số tiền tự động chèn dấu phẩy hàng nghìn kiểu `1,000,000`), `parseNumberInput` (phân tích chuỗi số có dấu phẩy thành raw number).
      - `AppNumberInput.tsx`: Component input nhập số chuẩn hóa, tự động format hiển thị kiểu `1,000,000` theo thời gian thực (realtime typing), bảo toàn vị trí con trỏ (cursor tracking), hỗ trợ phím Backspace thông minh, tích hợp `currencySuffix` (`VND`, `USD`) tại endAdornment, trả về `rawString` và `numericValue` cho form cha để ngăn chặn lỗi `NaN`.
      - `AppSelect.tsx`: Dropdown chọn chuẩn hoá hỗ trợ icons.
      - `AppCategoryChip.tsx`: Chip danh mục với màu sắc và icon trực quan.
      - `AppCard.tsx`: Bổ sung prop `layout?: 'default' | 'row'` (mặc định `'default'`), dùng `display: 'block'` thay vì ép cứng lưới 5 cột, loại bỏ tình trạng vỡ layout khi chứa nhiều phần tử con.
    - **Feature Expense Frontend (`src/features/expense/`)**:
      - Custom Hooks: `useTripExpenses`, `useTripBudgetSummary`, `useExpenseMutation` (`useCreateExpense`, `useUpdateExpense`, `useDeleteExpense`, `useSetBudget`).
      - Components tuân thủ nghiêm ngặt **1 Component / 1 File** và quy tắc layout (`AGENTS.md`):
        - Container owns spacing: Loại bỏ toàn bộ `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my` trên các phần tử con; mọi khoảng cách do `<Stack spacing={...}>` hoặc `gap` cha quản lý.
        - Flexbox over CSS Grid: Chuyển toàn bộ CSS Grid sang Flexbox (`display: 'flex'`, `flexWrap: 'wrap'`, `flex: 1`, `minWidth: 0`), không dùng `position: relative/absolute`.
        - Explicit pixel units: Chuẩn hoá `px` (font chữ `14px`, `12px`, `24px`, bo góc `16px`, `12px`, `20px`), đồng bộ toàn bộ icon sang `*RoundedIcon`.
        - Đồng bộ thiết kế với `MyTrips.tsx` & `TripTable.tsx`: Nền trang `action.hover`, khung bảng bo viền `borderRadius: '16px'`, `border: 1`, `borderColor: 'divider'`, `TableHead` nền xám nhẹ `action.hover` chữ in hoa bold 12px, cell padding `py: 2`, và Skeleton loading rows.
        - Chi tiết các components:
          - `BudgetMetricsCards.tsx` (3 thẻ metric: Tổng ngân sách, Đã chi, Số dư còn lại; bố cục top/bottom cân đối với `contentSx`, chống gãy chữ nút bấm, Flexbox 3 cột responsive).
          - `BudgetProgressBar.tsx` (Thanh tiến độ cảnh báo ngân sách).
          - `CategorySpendingList.tsx` (Phân bổ chi tiêu theo từng danh mục dạng Flexbox wrap).
          - `ExpenseTable.tsx` & `ExpenseTableRow.tsx` (Bảng chi tiêu chi tiết tràn viền bo 16px, Skeleton rows khi loading, trạng thái rỗng căn giữa).
          - `AddExpenseDialog.tsx` & `AddExpenseForm.tsx` (Form thêm khoản chi dạng Flexbox 50/50, icons Rounded, không margin con).
          - `EditExpenseDialog.tsx` & `EditExpenseForm.tsx` (Form chỉnh sửa khoản chi Flexbox 50/50, icons Rounded).
          - `DeleteExpenseDialog.tsx` (Xác nhận xóa với Stack spacing).
          - `SetBudgetDialog.tsx` & `SetBudgetForm.tsx` (Form thiết lập hạn mức tổng và hạng mục dạng Flexbox wrap).
          - `ExpenseOverview.tsx` (Layout tổng quan chuẩn hoá Stack spacing, đồng bộ header với `MyTripsHeader`).
      - Trang `/expenses` render `ExpenseOverview`.
      - Kiểm thử hoàn toàn: `npx tsc --noEmit` -> 0 errors, `npm run lint` -> 0 errors, 0 warnings.
16. **Chuẩn hóa Đa Ngôn Ngữ VNI / ENG Toàn Diện Cho Module Expense (`/expenses`)**:
    - Bổ sung quy chuẩn bắt buộc i18n vào `AGENTS.md`: Cấm 100% hardcode text hiển thị, đồng bộ 1:1 giữa `messages/vi.json` và `messages/en.json`, dùng `useTranslations`.
    - Thêm trọn bộ namespace `"expense"` vào `messages/vi.json` và `messages/en.json` (tiêu đề trang, metrics KPI, tiến độ ngân sách, danh sách danh mục, bảng chi tiêu, menu hành động, phân trang, form thêm/sửa, dialog xóa/ngân sách, toast thông báo).
    - Cập nhật `AppCategoryChip.tsx`: Hỗ trợ dịch tên danh mục qua `useTranslations('expense.categories')`, đổi toàn bộ icon sang `*RoundedIcon`, chuẩn hoá `fontSize: '12px'`.
    - Chuyển đổi toàn bộ 10 components trong `src/features/expense/components/` sang `useTranslations('expense')`, hỗ trợ gạt tức thì giữa `VNI` và `ENG` trên TopBar.
17. **Chuẩn Hóa Quy Ước Lấy Người Dùng Đăng Nhập (`@CurrentUser` / `currentUserId`) Xuyên Suốt Backend Core**:
    - Chuẩn hóa kiến trúc tiêm người dùng: Sử dụng custom annotation `@CurrentUser CurrentUserDto user` (dựa trên `@AuthenticationPrincipal` với SpEL khởi tạo `CurrentUserDto` từ `Jwt` subject và `sid`).
    - Quy chuẩn hóa Controller: Tuyệt đối cấm nhận `userId` từ body/query/params để định danh; mọi endpoint đều tiêm `@CurrentUser CurrentUserDto user` và khai báo tường minh `Long currentUserId = user.id();` trước khi truyền xuống Service.
    - Đồng bộ `TripController` & `ExpenseController`: Dọn dẹp mã cũ và comment trong `TripController`, đồng bộ hóa toàn bộ 7 endpoints của `ExpenseController` theo mẫu chuẩn.
    - Quy chuẩn hóa Service: Nhận `currentUserId` và kiểm tra quyền hạn thành viên chuyến đi qua `existsByTrip_IdAndUserIdAndStatus` (`ACTIVE`), ném lỗi 403 Forbidden nếu không có quyền và 404 Not Found nếu chuyến đi không tồn tại/đã bị xóa mềm.
    - Ghi nhận đầy đủ vào Mục 6 của `AGENTS.md` làm tiêu chuẩn kỹ thuật bắt buộc cho toàn bộ dự án.
18. **Triển Khai Hoàn Chỉnh Module Quản Lý Thành Viên Chuyến Đi (Trip Members & Invitations)**:
    - **Backend Spring Boot Core (`tripbudget-core`)**:
      - Tạo Entity chỉ đọc `UserEntity` (`@Immutable`) ánh xạ bảng `public.users` (`id`, `email`, `name`, `avatar_url`, `status`) và `UserRepository` để tra cứu người dùng qua email và nạp danh sách profile mà không tạo quan hệ Foreign Key DDL xuyên service.
      - Nâng cấp domain methods cho `TripMemberEntity`: `addDirectMember`, `updateRole`, `updateStatus`, `remove`, `leave`, `reactivate`.
      - Mở rộng `TripMemberRepository` với các query lọc `isDel == false`.
      - DTOs: `InviteMemberRequest`, `UpdateMemberRoleRequest`, `TripMemberResponse`.
      - `TripMemberService`: Xác thực quyền hạn (`OWNER` có quyền đổi vai trò và xóa thành viên; `OWNER` và `EDITOR` có quyền mời; thành viên không phải owner có quyền tự rời nhóm `leaveTrip`).
      - `TripMemberController`: Tuân thủ chuẩn mực `@CurrentUser CurrentUserDto user` và `Long currentUserId = user.id();`.
    - **Next.js BFF Handlers (`src/app/api/trip/[id]/members/`)**:
      - `route.ts` (GET danh sách thành viên, POST mời thành viên mới).
      - `[memberId]/route.ts` (PUT cập nhật vai trò, DELETE xóa thành viên).
      - `leave/route.ts` (POST rời chuyến đi).
    - **Base & Feature Frontend Web (`src/features/trip/`)**:
      - Types: `member.types.ts` (`TripMember`, `TripMemberRole`, `TripMemberStatus`,...).
      - Custom Hooks: `useTripMembers`, `useInviteMember`, `useUpdateMemberRole`, `useRemoveMember`, `useLeaveTrip`.
      - Components (1 Component / 1 File, Flexbox, Không margin con):
        - `RoleBadge.tsx`: Chip vai trò màu sắc đặc trưng và icon Rounded.
        - `TripMemberRow.tsx`: Dòng từng thành viên với Avatar initials (`getUserInitials`), Email, Name, Role badge, và menu hành động `AppActionMenu`.
        - `TripMemberList.tsx`: Danh sách thành viên cuộn độc lập, Skeleton loading và Empty state.
        - `InviteMemberForm.tsx`: Form nhập email và chọn vai trò, validation email regex.
        - `EditMemberRoleDialog.tsx`: Dialog chọn vai trò mới cho thành viên.
        - `TripMembersDialog.tsx`: Hộp thoại quản lý tổng thể với đầy đủ toast và dialog xác nhận xóa/rời nhóm.
        - `TripMembersHost.tsx`: Host component toàn cục đặt trong `AppShell.tsx`.
    - **Tích Hợp Sâu Xuyên Suốt**:
      - `AppTopBar.tsx`: Nút "Mời thành viên" mở trực tiếp `TripMembersDialog` cho chuyến đi đang hoạt động.
      - `ActiveTripBanner.tsx`: Nút "Thành viên" mở popup quản lý thành viên.
      - `AddExpenseForm.tsx` & `AddExpenseDialog.tsx`: Tự động nạp danh sách `activeMembers` cho phép chọn "Người thanh toán" (`payerId`) thực tế trong chuyến đi.
    - **Bản địa hóa 100% VNI / ENG**:
      - Bổ sung trọn bộ từ điển `"members"` vào `messages/vi.json` và `messages/en.json`.
    - **Kiểm thử chất lượng**:
      - `mvn compile -q` -> 0 errors.
      - `npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.
19. **Xây Dựng Base Component Dùng Chung `AppTable` Đa Năng (Server & Client Filtering/Sorting/Pagination) & Đồng Bộ Hoá i18n**:
    - **Kiến Trúc Base Table (`src/base/components/table/`)**:
      - `types.ts`: Định nghĩa `AppTableColumn<T>`, `ColumnFilterType` (`text`, `select`, `dateRange`, `numberRange`), `ColumnFilterOption`, `TableSortState`, `AppTableProps<T>`, hỗ trợ 2 chế độ `mode?: 'client' | 'server'`.
      - `AppColumnFilterPopover.tsx`: Popover lọc từng cột (text search có phím tắt Enter, dropdown đa lựa chọn với nút Chọn/Bỏ chọn tất cả).
      - `AppColumnHeader.tsx`: Header cột hỗ trợ click đổi chiều Sort (`asc` -> `desc` -> hủy sort), icon badge phễu lọc sáng khi có filter.
      - `AppTablePagination.tsx`: Phân trang đồng bộ giao diện toàn hệ thống với select rowsPerPage.
      - `AppTable.tsx`: Component bảng dữ liệu trung tâm, tự động hiển thị Active Filters Bar, Empty State, Skeleton rows khi loading. Khi `mode="server"` hoặc khi được truyền controlled state (`sort`, `filters`), bảng bỏ qua việc lọc/sắp xếp cục bộ và đẩy toàn bộ params lên trang cha.
    - **Đồng Bộ Hoá 100% Đa Ngôn Ngữ VNI / ENG (`messages/vi.json` & `messages/en.json`)**:
      - Thêm namespace `"table"` với 13 keys: `filterBy`, `filterPlaceholder`, `selectAll`, `deselectAll`, `apply`, `clearFilter`, `clearAll`, `filtering`, `noResultsFound`, `noData`, `sortBy`, `rowsPerPage`, `displayedRows`.
      - Thêm bản dịch trạng thái chuyến đi (`archived`, `cancelled`) và placeholders lọc trong `"myTrips"` và `"expense.table"`.
    - **Áp Dụng Cho Feature Chuyến Đi (`/trips`)**:
      - `useMyTrips`: Truyền `search`, `destination`, `currency`, `status`, `sortBy`, `sortDirection`.
      - BFF `GET /api/trip/my-trips`: Chuyển tiếp toàn bộ search params sang Spring Boot Core.
      - `TripTable.tsx` & `MyTrips.tsx`: Sử dụng `mode="server"` và quản lý state controlled sort/filter, tự động đưa trang về `0` khi filter/sort thay đổi.
    - **Áp Dụng Cho Feature Chi Tiêu (`/expenses`)**:
      - `useTripExpenses`: Truyền `search`, `title`, `category`, `payer`, `splitType`, `sortBy`, `sortDirection`.
      - BFF `GET /api/trip/[id]/expenses`: Chuyển tiếp toàn bộ search params sang Spring Boot Core.
      - `ExpenseTable.tsx` & `ExpenseOverview.tsx`: Sử dụng `mode="server"`, quản lý state controlled sort/filter, quốc tế hóa filter options danh mục (`categories.*`) và phương thức chia tiền (`splits.*`), reset trang về `0` khi điều kiện lọc thay đổi.
    - **Tuân Thủ Tuyệt Đối Bộ Quy Tắc Coding (`AGENTS.md`)**:
      - 1 Component / 1 File, explicit pixel units (`px`), không sử dụng child margins (`m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my`), màu sắc bám sát MUI theme palette.
      - Kiểm thử: `npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

20. **Triển Khai Hoàn Chỉnh Server-Side Dynamic Filter, Search & Sort Tại Backend Spring Boot Core (`tripbudget-core`)**:
    - **Kiến trúc Spring Data JPA Specifications**:
      - Bổ sung `JpaSpecificationExecutor<TripEntity>` vào `TripRepository` và `JpaSpecificationExecutor<ExpenseEntity>` vào `ExpenseRepository`.
      - Xây dựng `TripSpecifications` và `ExpenseSpecifications` cung cấp các vị từ Criteria API an toàn (`root.get(...)`, `Subquery`, `cb.like`, `cb.or`, `cb.and`, `root.in(...)`).
    - **Chống SQL Injection & Lỗi Thuộc Tính (Whitelist Sorting)**:
      - Xây dựng `buildSort` kiểm soát nghiêm ngặt các trường cho phép sắp xếp (`name`, `destination`, `startDate`, `endDate`, `baseCurrency`, `status`, `id` cho Trips; `expenseDate`, `title`, `amount`, `category`, `splitType`, `id` cho Expenses), tự động chuyển đổi chiều `ASC`/`DESC` an toàn, ngăn chặn lỗi `PropertyReferenceException`.
    - **Triển khai Module Chuyến đi (`com.tripbudget.tripbudget_core.trip`)**:
      - DTO `TripFilterRequest` nhận: `search`, `name`, `destination`, `currency`, `status`, `sortBy`, `sortDirection`.
      - `TripSpecifications.hasActiveMember(currentUserId)`: Kiểm tra membership của người dùng bằng Criteria Subquery trên `TripMemberEntity` (`status = ACTIVE` và `isDel = false`), kết hợp loại trừ chuyến đi bị xóa mềm (`isDel = false` và `status != DELETED`).
      - `TripController.getMyTrips`: Cập nhật nhận các query params tùy chọn `@RequestParam(required = false)`, tạo `TripFilterRequest` và chuyển giao cho `tripService.getMyTrips`.
    - **Triển khai Module Khoản chi (`com.tripbudget.tripbudget_core.expense` & `user`)**:
      - `UserRepository`: Bổ sung truy vấn `findIdsByKeyword` tìm kiếm User ID theo tên hoặc email (`LOWER(name) LIKE ... OR LOWER(email) LIKE ...`).
      - DTO `ExpenseFilterRequest` nhận: `search`, `title`, `category`, `payer`, `splitType`, `sortBy`, `sortDirection`.
      - `ExpenseService.getTripExpenses`: Tra cứu danh sách User ID khớp với từ khóa `payer` hoặc giải mã HashID; tạo Criteria Predicate `payerId IN (:matchedPayerIds)` hoặc `cb.disjunction()` nếu không tìm thấy user nào khớp từ khóa.
      - `ExpenseController.getTripExpenses`: Cập nhật nhận các query params tùy chọn `@RequestParam(required = false)`, tạo `ExpenseFilterRequest` và chuyển giao cho `expenseService.getTripExpenses`.
    - **Bảo mật & Tính Tương Thích**:
      - Tuyệt đối tuân thủ `@CurrentUser CurrentUserDto user` và `Long currentUserId = user.id();`.
      - Hoàn toàn tương thích ngược: các endpoint vẫn hoạt động bình thường với giá trị mặc định khi không truyền tham số lọc.
    - **Kiểm thử chất lượng**:
      - `./mvnw test-compile -q -o` -> BUILD SUCCESS (0 errors).
      - `npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

21. **Triển Khai Toàn Diện Module Quyết Toán & Trả Nợ (Debt Settlement & Balances - `/settlement`)**:
    - **Cơ sở dữ liệu & Migration**:
      - Tạo `tripbudget-core/src/main/resources/db/migration/V3__create_settlements.sql`: Tạo bảng `trip_core.settlements` lưu vết các khoản chuyển khoản/tiền mặt giữa các thành viên, kèm `is_del`, audit columns, và các indexes cần thiết (`idx_settlements_trip_id`, `idx_settlements_payer`, `idx_settlements_payee`, `idx_settlements_settled_at`).
    - **Backend Spring Boot Core (`tripbudget-core`)**:
      - Package: `com.tripbudget.tripbudget_core.settlement`.
      - Entity & Enum: `SettlementEntity` kế thừa `BaseEntity`, `PaymentMethod` (`CASH`, `BANK_TRANSFER`, `OTHER`).
      - DTOs: `CreateSettlementRequest`, `MemberBalanceResponse`, `SuggestedSettlementResponse`, `SettlementResponse`, `TripSettlementSummaryResponse`.
      - Thuật toán Tối Giản Nợ (Greedy Min-Cash-Flow Debt Simplification Algorithm):
        - Tính Net Balance của từng thành viên: $Net = \sum \text{Paid Expenses} + \sum \text{Settlements Given} - \sum \text{Owed Splits} - \sum \text{Settlements Received}$.
        - Phân loại thành nhóm con nợ (Debtors, $Net < 0$) và chủ nợ (Creditors, $Net > 0$).
        - Sử dụng thuật toán 2 con trỏ tham lam ghép cặp con nợ lớn nhất với chủ nợ lớn nhất để giảm số lần chuyển tiền xuống mức tối thiểu (tối đa $N-1$ giao dịch).
      - Xử lý Batch User Info: Truy vấn một lượt danh sách `public.users` bằng `UserRepository.findAllByIdIn`, ghép nối tên, email, avatar vào phản hồi.
      - Controller & Security: `SettlementController` (`GET /api/trip/{tripId}/settlement`, `POST /api/trip/{tripId}/settlement`, `DELETE /api/trip/{tripId}/settlement/{settlementId}`). Tuyệt đối lấy user từ `@CurrentUser CurrentUserDto user` -> `Long currentUserId = user.id();`.
    - **BFF & Frontend Next.js (`trip-budget-web`)**:
      - BFF Route Handlers: `src/app/api/trip/[id]/settlement/route.ts` và `src/app/api/trip/[id]/settlement/[settlementId]/route.ts`.
      - Feature Module (`src/features/settlement/`):
        - Types: `types/index.ts`.
        - Hooks: `useTripSettlement.ts` (`useTripSettlementSummary`, `useCreateSettlement`, `useDeleteSettlement`).
        - Components: `MyBalanceCard.tsx`, `SuggestedSettlementCard.tsx`, `SuggestedSettlementsList.tsx`, `MemberBalancesTable.tsx`, `SettlementHistoryTable.tsx`, `RecordSettlementForm.tsx`, `RecordSettlementDialog.tsx`, `SettlementOverview.tsx`.
        - Page: `src/app/settlement/page.tsx` render `SettlementOverview`.
      - **Quy tắc i18n 100% VNI / ENG Tuyệt Đối**:
        - `messages/vi.json` và `messages/en.json` đồng bộ 1:1 namespace `"settlement"`.
        - Toàn bộ thông báo lỗi (validation errors: `payerRequired`, `payeeRequired`, `samePerson`, `invalidAmount`), thông báo toast, placeholders, văn bản fallback đều phải lấy qua `useTranslations`, cấm tuyệt đối hardcode bất kỳ chuỗi tiếng Việt/tiếng Anh nào trong code logic hay JSX.
    - **Tuân thủ quy tắc kiến trúc & UI**:
      - 1 Component / 1 File, Flexbox trên CSS Grid, đơn vị pixel rõ ràng (`px`), không sử dụng child margins (`m`, `mt`, `mb`...), sử dụng theme tokens.
      - Kiểm thử:
        - Backend: `./mvnw test-compile -q -o` -> BUILD SUCCESS (0 errors).
        - Frontend: `npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

22. **Chuẩn Hóa Toàn Bộ Khai Báo React Components & Hooks Sang Const Arrow Function & Export Default**:
    - **Quy chuẩn bắt buộc**: Toàn bộ React components (Pages, Layouts, Features, Base UI Primitives, Tables) và custom hooks trong dự án bắt buộc được khai báo theo mẫu `const ComponentName = (props: Props) => { ... }; export default ComponentName;` ở cuối file. Tuyệt đối nghiêm cấm dùng `export default function` hoặc `export default async function`.
    - **Cập nhật tài liệu**: Bổ sung chi tiết quy tắc "Quy tắc Khai Báo Component Dạng Const Arrow Function & Export Default" vào Mục 7 của `AGENTS.md` làm tiêu chuẩn kỹ thuật bắt buộc cho mọi yêu cầu phát triển tiếp theo.
    - **Refactor Toàn Bộ 100% Source Code (92 Files)**:
      - App Router (`src/app/`): `layout.tsx`, `ai/page.tsx`, `demo/page.tsx`, `expenses/page.tsx`, `overview/page.tsx`, `scan/page.tsx`, `settlement/page.tsx`, `trips/page.tsx`.
      - Base Layout & Sidebar (`src/base/components/layout/`): `AppShell`, `AppSidebar`, `AppTopBar`, `CreateTripHost`, `GlobalLoadingHost`, `TripMembersHost`, `SidebarBrand`, `SidebarMenu`, `SidebarTripCard`, `SidebarUser`, `SidebarUserMenu`.
      - Base Table & Primitives (`src/base/components/table/` & `ui/`): `AppTable`, `AppColumnHeader`, `AppColumnFilterPopover`, `AppTablePagination`, `AppButton`, `AppCard`, `AppDialog`, `AppConfirmDialog`, `AppNumberInput`, `AppSelect`, `AppTextField`, `AppTextArea`, `AppToast`, `AppLoadingOverlay`, `AppCategoryChip`, `AppActionMenu`, `AppLinearProgress`.
      - Base Hooks & Providers: `useQueryGet`, `useMutationPost`, `useMutationPut`, `useMutationDelete`, `useMutationRequest`, `AppThemeProvider`.
      - Feature Chuyến Đi (`src/features/trip/`): Toàn bộ components quản lý chuyến đi (`MyTrips`, `TripTable`, `TripTableRow`, `TripStatusChip`, `TripMembersDialog`, `ActiveTripBanner`, `Overview`...), và hooks `useMyTrips`, `useTripDetail`, `useTripMutation`.
      - Feature Chi Tiêu (`src/features/expense/`): Toàn bộ components ngân sách (`BudgetMetricsCards`, `ExpenseTable`, `AddExpenseDialog`, `ExpenseOverview`...), và hooks `useTripExpenses`, `useTripBudgetSummary`, `useExpenseMutation`.
      - Feature Quyết Toán (`src/features/settlement/`): Toàn bộ components quyết toán (`MyBalanceCard`, `SuggestedSettlementCard`, `MemberBalancesTable`, `SettlementHistoryTable`, `RecordSettlementDialog`, `SettlementOverview`...).
      - Feature User & Auth: `ProfileDialog`, `ProfileForm`, `useCurrentUser`, `useLogin`, `useLogout`.
    - **Kiểm thử chất lượng**: `npx tsc --noEmit` -> 0 errors, `npm run lint` -> 0 errors, 0 warnings. Không còn bất kỳ file nào tồn tại cú pháp cũ `export default function`.

23. **Đồng Bộ Dữ Liệu Chuyến Đi Realtime & Tự Động Tính Tổng Ngân Sách Dự Kiến (Realtime Trip Sync & Auto Budget Calculation)**:
    - **Vấn đề 1 — Tạo Trip Tự Động Reset List Không Cần Reload Trình Duyệt**:
      - _Nguyên nhân_: `CreateTripDialog` chỉ gọi `refetchTrips()` trên instance nội bộ của `TripProvider`, trong khi trang danh sách chuyến đi (`MyTrips.tsx`) sở hữu instance `useMyTrips` độc lập nên không nhận được trigger cập nhật, buộc người dùng phải reload trang mới thấy chuyến đi mới.
      - _Giải pháp_: Bổ sung cơ chế Pub/Sub qua `subscribeTrips` và sự kiện đột biến `TripMutationEvent` (`created`, `updated`, `deleted`, `general`) trong `TripContext`. Khi tạo mới trip thành công, sự kiện `'created'` được phát ra; `MyTrips` tự động đưa trang về `page 0`, xóa bộ lọc (`filters = {}`), hủy sort (`sort = null`) và kích hoạt `refetch()` ngay lập tức để chuyến đi mới nhất lập tức xuất hiện ở đầu bảng mà không cần reload.
      - Đồng thời nâng `size: 100` cho `TripProvider` để sidebar và dropdown chuyển đổi chuyến đi luôn có đầy đủ danh sách.
    - **Vấn đề 2 — Tự Động Tính Tổng Ngân Sách Dự Kiến (`expected`) Khi Nhập Từng Danh Mục**:
      - _Hiện trạng & Yêu cầu_: Ô "Tổng ngân sách dự kiến" (`totalBudget`) trước đó bị tách rời với các ô hạn mức danh mục, yêu cầu nhập thủ công hoặc nhấn nút đồng bộ chỉ khi có cảnh báo. Người dùng muốn khi nhập tiền vào từng danh mục, hệ thống sẽ tự động cộng dồn vào ô tổng ngân sách dự kiến nhưng vẫn cho phép sửa tay tự do ô này.
      - _Giải pháp_: Xây dựng handler `handleCategoryChange` trong `SetBudgetForm.tsx`. Khi người dùng gõ hạn mức ở bất kỳ danh mục nào (`categoryLimits`), hàm tự động tính tổng lũy kế các danh mục và set trực tiếp vào `totalBudget`. Đồng thời giữ nguyên ô `AppNumberInput` của `totalBudget` để người dùng có thể tùy ý điều chỉnh thêm bớt (ví dụ thêm khoản dự phòng rủi ro), thanh tiến độ và các trạng thái phân bổ (`exactAllocated`, `remainingUnallocated`, `isOverAllocated`) cập nhật tức thời theo thời gian thực.
    - **Kiểm thử chất lượng**:
      - `npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

24. **Triển Khai Hoàn Chỉnh Backend Module Lập Kế Hoạch & Lịch Trình Chuyến Đi (Trip Itinerary & Planning - Spring Boot Core)**:
    - **Cơ sở dữ liệu & Flyway Migrations (`tripbudget-core`)**:
      - `V3__create_settlements.sql`: Tạo bảng `trip_core.settlements` lưu vết các khoản quyết toán, chuyển tiền giữa các thành viên.
      - `V4__create_trip_plans.sql`:
        - `trip_core.plan_days`: Quản lý các ngày trong chuyến đi (`id`, `trip_id`, `day_number`, `plan_date`, `title`, `note`, `is_del`, timestamps). Ràng buộc duy nhất `uq_plan_days_trip_day (trip_id, day_number)`.
        - `trip_core.plan_activities`: Hoạt động chi tiết trong ngày (`id`, `day_id`, `trip_id`, `title`, `start_time`, `end_time`, `location`, `category`, `estimated_cost`, `status`, `order_index`, `note`, `expense_id`, `is_del`, timestamps).
        - `trip_core.plan_checklists`: Danh mục hành lý & công việc cần chuẩn bị (`id`, `trip_id`, `title`, `category`, `is_completed`, `assignee_id`, `is_del`, timestamps).
    - **Domain Entities & Enums (`com.tripbudget.tripbudget_core.plan`)**:
      - Entities kế thừa `BaseEntity`: `PlanDayEntity`, `PlanActivityEntity`, `PlanChecklistEntity`.
      - Enums: `ActivityCategory` (`FOOD_BEVERAGE`, `TRANSPORTATION`, `SIGHTSEEING`, `ACCOMMODATION`, `SHOPPING`, `ENTERTAINMENT`, `OTHER`), `ActivityStatus` (`PLANNED`, `IN_PROGRESS`, `COMPLETED`, `SKIPPED`), `ChecklistCategory` (`DOCUMENTS`, `CLOTHING`, `ELECTRONICS`, `MEDICAL`, `TASKS`, `OTHER`).
    - **Repositories & DTOs**:
      - Repositories: `PlanDayRepository`, `PlanActivityRepository`, `PlanChecklistRepository`.
      - Requests: `CreatePlanDayRequest`, `UpdatePlanDayRequest`, `CreateActivityRequest`, `UpdateActivityRequest`, `UpdateActivityStatusRequest`, `CreateChecklistRequest`, `UpdateChecklistRequest`.
      - Responses: `PlanDayResponse`, `PlanActivityResponse`, `PlanChecklistResponse`, `TripPlanOverviewResponse`.
    - **Service & Business Logic (`PlanService`)**:
      - Tự động sinh ngày lịch trình (`autoGenerateDays`): Khi người dùng vào xem kế hoạch một chuyến đi lần đầu, hệ thống tự động sinh các `PlanDay` tương ứng từ `startDate` đến `endDate` của chuyến đi (ví dụ 3 ngày: Ngày 1, Ngày 2, Ngày 3).
      - Quản lý hoạt động: Thêm, sửa, đổi trạng thái (`COMPLETED`/`SKIPPED`), đổi thứ tự, liên kết `expenseId` nếu đã chi tiền.
      - Quản lý checklist: Thêm đồ dùng/việc cần làm, toggle trạng thái hoàn thành, gán thành viên phụ trách (batch-lookup user info từ `UserRepository`).
    - **Controller & REST Endpoints (`PlanController`)**:
      - Đường dẫn gốc: `/trip/{tripId}/plan`.
      - Bảo mật: 100% tuân thủ tiêm `@CurrentUser CurrentUserDto user` $\rightarrow$ `Long currentUserId = user.id();` và mã hóa ID qua `HashidsService`.
      - 13 REST Endpoints đầy đủ:
        - `GET /trip/{tripId}/plan`: Lấy tổng quan lịch trình (các ngày, hoạt động và checklists).
        - `POST /trip/{tripId}/plan/days`: Thêm ngày.
        - `PUT /trip/{tripId}/plan/days/{dayId}`: Sửa thông tin ngày.
        - `DELETE /trip/{tripId}/plan/days/{dayId}`: Xóa ngày (kèm xóa các hoạt động).
        - `POST /trip/{tripId}/plan/days/{dayId}/activities`: Thêm hoạt động vào ngày.
        - `PUT /trip/{tripId}/plan/activities/{activityId}`: Sửa hoạt động (hỗ trợ chuyển ngày).
        - `PATCH /trip/{tripId}/plan/activities/{activityId}/status`: Cập nhật trạng thái hoạt động.
        - `DELETE /trip/{tripId}/plan/activities/{activityId}`: Xóa hoạt động.
        - `GET /trip/{tripId}/plan/checklists`: Lấy danh sách việc chuẩn bị.
        - `POST /trip/{tripId}/plan/checklists`: Thêm mục cần chuẩn bị.
        - `PUT /trip/{tripId}/plan/checklists/{checklistId}`: Sửa mục checklist.
        - `PATCH /trip/{tripId}/plan/checklists/{checklistId}/toggle`: Đánh dấu xong/chưa xong.
        - `DELETE /trip/{tripId}/plan/checklists/{checklistId}`: Xóa mục checklist.
    - **Kiểm thử chất lượng**:
      - `mvn compile -q -o` -> BUILD SUCCESS (0 errors).
      - `mvn test-compile -q -o` -> BUILD SUCCESS (0 errors).

25. **Triển Khai Hoàn Chỉnh Frontend Next.js Cho Module Kế Hoạch & Lịch Trình Chuyến Đi (Trip Itinerary & Planning - `/plan`)**:
    - **Next.js BFF Handlers (`src/app/api/trip/[id]/plan/`)**:
      - `route.ts`: GET overview, POST ngày mới.
      - `days/[dayId]/route.ts`: PUT sửa ngày, DELETE xóa ngày.
      - `days/[dayId]/activities/route.ts`: POST thêm hoạt động.
      - `activities/[activityId]/route.ts`: PUT sửa hoạt động, DELETE xóa hoạt động.
      - `activities/[activityId]/status/route.ts`: PATCH & PUT cập nhật trạng thái hoạt động.
      - `checklists/route.ts`: GET, POST checklist.
      - `checklists/[checklistId]/route.ts`: PUT sửa, DELETE checklist.
      - `checklists/[checklistId]/toggle/route.ts`: PATCH & PUT toggle checklist.
    - **Feature Plan Frontend (`src/features/plan/`)**:
      - Types: `types/index.ts` ánh xạ 1:1 với DTOs của Spring Boot Core (`PlanActivity`, `PlanDay`, `PlanChecklist`, `TripPlanOverview`...).
      - Custom Hooks: `useTripPlan.ts` (lấy dữ liệu lịch trình tổng quan), `usePlanMutation.ts` (các mutation hooks cho hoạt động, ngày và checklist).
      - Components (1 Component / 1 File, const arrow function & export default, container owns spacing, explicit px units):
        - `PlanHeader.tsx`: Header trang hiển thị tên chuyến đi, địa điểm, các metrics (ngày, hoạt động, hoàn thành, chi phí dự kiến) và 2 nút "Chuẩn bị hành lý" & "Thêm hoạt động".
        - `PlanDayTabs.tsx`: Tabs chuyển đổi ngày ngang (Ngày 1, Ngày 2...) kèm badge đếm số hoạt động và format ngày `DD/MM/YYYY`.
        - `PlanEmptyState.tsx`: Trạng thái rỗng trực quan khi một ngày chưa có hoạt động nào.
        - `ActivityTimelineCard.tsx`: Thẻ hoạt động timeline hiển thị thời gian, node tròn timeline, chips danh mục & trạng thái, chi phí dự tính, menu thao tác (Đổi trạng thái, Ghi nhận thành chi tiêu, Sửa, Xóa).
        - `DayTimelineList.tsx`: Danh sách hoạt động được sắp xếp tự động theo trình tự thời gian.
        - `AddActivityForm.tsx` & `AddActivityDialog.tsx`: Dialog & form thêm hoạt động với validation và `AppNumberInput` định dạng tiền tệ realtime.
        - `EditActivityForm.tsx` & `EditActivityDialog.tsx`: Dialog & form sửa hoạt động với dữ liệu pre-filled.
        - `DeleteActivityDialog.tsx`: Hộp thoại xác nhận xóa hoạt động dựa trên `AppConfirmDialog`.
        - `ChecklistRow.tsx`, `AddChecklistForm.tsx`, `ChecklistDialog.tsx`: Quản lý danh mục hành lý & đồ dùng cần chuẩn bị trước chuyến đi với thanh tiến độ hoàn thành realtime.
        - `PlanOverview.tsx`: Component tổng quan điều phối toàn bộ state, derived active day (chuẩn React 19 không gây cascading render), dialogs và toast thông báo.
        - Trang App Router: `src/app/plan/page.tsx` render `PlanOverview`.
    - **Quốc tế hóa 100% VNI / ENG & Sidebar Menu**:
      - Đồng bộ 1:1 namespace `"plan"` trong `messages/vi.json` và `messages/en.json`.
      - Bổ sung `'plan'` vào `SidebarMessageKey` (`types.ts`) và cấu hình menu Sidebar `/plan` với icon `CalendarMonthOutlinedIcon`.
    - **Kiểm thử chất lượng**:
      - `npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.
      - `mvn test-compile -q -o` -> BUILD SUCCESS (0 errors).

### Immediate likely next tasks:

1. **Kết nối Dữ liệu Thực tế cho Trang Tổng quan (`/overview`)**: Thay thế dữ liệu mock trong `RecentExpenseList` và `CategoryList` bằng dữ liệu thực tế từ API chi tiêu của chuyến đi đang diễn ra.
2. **Module Quét Hóa Đơn Bằng AI / Camera (`/scan`)**: OCR hóa đơn chi tiêu tự động trích xuất số tiền, ngày, danh mục, gán vào chuyến đi.
