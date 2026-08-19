import { Box, Stack, Typography } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import { AppLinearProgress } from '@/base/components/ui';

interface SpendingCategory {
  messageKey:
    | 'flight'
    | 'stay'
    | 'food'
    | 'sightseeing'
    | 'shopping'
    | 'transport';
  amount: string;
  percentage: number;
  color: string;
  background: string;
  icon: ReactNode;
}

interface RecentExpense {
  messageKey: 'returnFlight' | 'hotel' | 'baNaHills' | 'dinner' | 'motorbike';
  meta: string;
  amount: string;
  color: string;
  background: string;
  icon: ReactNode;
}

const categories: SpendingCategory[] = [
  {
    messageKey: 'flight',
    amount: '4.200.000 đ',
    percentage: 35,
    color: '#6366F1',
    background: '#EEF2FF',
    icon: '✈️',
  },
  {
    messageKey: 'stay',
    amount: '2.850.000 đ',
    percentage: 24,
    color: '#0EA5E9',
    background: '#E0F2FE',
    icon: '🏨',
  },
  {
    messageKey: 'food',
    amount: '2.095.000 đ',
    percentage: 17,
    color: '#F97316',
    background: '#FFF7ED',
    icon: '🍜',
  },
  {
    messageKey: 'sightseeing',
    amount: '1.740.000 đ',
    percentage: 15,
    color: '#10B981',
    background: '#ECFDF5',
    icon: '🎡',
  },
  {
    messageKey: 'shopping',
    amount: '620.000 đ',
    percentage: 5,
    color: '#EC4899',
    background: '#FDF2F8',
    icon: '🛍️',
  },
  {
    messageKey: 'transport',
    amount: '480.000 đ',
    percentage: 4,
    color: '#F59E0B',
    background: '#FFFBEB',
    icon: '🛵',
  },
];

const recentExpenses: RecentExpense[] = [
  {
    messageKey: 'returnFlight',
    meta: 'Anh · 04 Aug',
    amount: '4.20tr',
    color: '#6366F1',
    background: '#EEF2FF',
    icon: '✈️',
  },
  {
    messageKey: 'hotel',
    meta: 'Nguyên · 05 Aug',
    amount: '2.85tr',
    color: '#0EA5E9',
    background: '#E0F2FE',
    icon: '🏨',
  },
  {
    messageKey: 'baNaHills',
    meta: 'Anh · 05 Aug',
    amount: '0.78tr',
    color: '#10B981',
    background: '#ECFDF5',
    icon: '🎡',
  },
  {
    messageKey: 'dinner',
    meta: 'Phạm · 05 Aug',
    amount: '1.56tr',
    color: '#F97316',
    background: '#FFF7ED',
    icon: '🍜',
  },
  {
    messageKey: 'motorbike',
    meta: 'Hào · 06 Aug',
    amount: '0.48tr',
    color: '#F59E0B',
    background: '#FFFBEB',
    icon: '🛵',
  },
];

const members = [
  { initials: 'MA', color: '#6366F1' },
  { initials: 'TN', color: '#F97316' },
  { initials: 'LP', color: '#10B981' },
  { initials: 'VH', color: '#EC4899' },
] as const;

function TripSummaryMetric({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <Stack spacing={0.5} sx={{ flex: '1 1 180px', minWidth: 0 }}>
      <Typography
        sx={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: danger ? '#FCA5A5' : '#FFFFFF',
          fontFamily: 'var(--font-mono)',
          fontSize: '16px',
          fontWeight: 700,
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

async function CategoryList() {
  const t = await getTranslations('overview');

  return (
    <Stack spacing={2}>
      {categories.map((category) => (
        <Stack
          key={category.messageKey}
          direction="row"
          spacing={1.5}
          sx={{ alignItems: 'center' }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              borderRadius: '10px',
              color: category.color,
              bgcolor: category.background,
              '& svg': { fontSize: '20px' },
            }}
          >
            {category.icon}
          </Box>
          <Stack spacing={0.75} sx={{ minWidth: 0, flexGrow: 1 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Typography
                sx={{
                  color: 'text.primary',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                {t(`categories.${category.messageKey}`)}
              </Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                }}
              >
                {category.amount}
              </Typography>
            </Stack>
            <AppLinearProgress
              value={category.percentage}
              height={6}
              trackColor="action.hover"
              barColor={category.color}
            />
          </Stack>
          <Typography
            sx={{
              width: 34,
              flexShrink: 0,
              color: 'text.secondary',
              fontSize: '11px',
              textAlign: 'right',
            }}
          >
            {category.percentage}%
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

async function RecentExpenseList() {
  const t = await getTranslations('overview');

  return (
    <Stack>
      {recentExpenses.map((expense, index) => (
        <Stack
          key={expense.messageKey}
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: 'center',
            py: 1.5,
            borderBottom: index < recentExpenses.length - 1 ? 1 : 0,
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              borderRadius: '10px',
              color: expense.color,
              bgcolor: expense.background,
              '& svg': { fontSize: '20px' },
            }}
          >
            {expense.icon}
          </Box>
          <Stack spacing={0.25} sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography
              noWrap
              sx={{ color: 'text.primary', fontSize: '14px', fontWeight: 700 }}
            >
              {t(`recent.${expense.messageKey}`)}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '11px' }}>
              {expense.meta}
            </Typography>
          </Stack>
          <Typography
            sx={{
              flexShrink: 0,
              color: 'text.primary',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            {expense.amount}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export default async function Overview() {
  const t = await getTranslations('overview');

  return (
    <Stack
      spacing={3}
      sx={{ p: { xs: 2, md: 3 }, bgcolor: 'action.hover', minHeight: '100%' }}
    >
      <Box
        component="section"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          overflow: 'hidden',
          borderRadius: '20px',
          px: { xs: 2.5, md: 4 },
          py: 3.5,
          color: '#FFFFFF',
          background:
            'linear-gradient(120deg, #1E3A8A 0%, #167A91 55%, #287E68 100%)',
          boxShadow: '0 18px 45px rgba(15, 23, 42, 0.16)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack spacing={1.25} sx={{ minWidth: 0 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', flexWrap: 'wrap' }}
            >
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.72)',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                {t('activeTrip')}
              </Typography>
              <Box
                component="span"
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: '999px',
                  bgcolor: 'rgba(74,222,128,0.2)',
                  color: '#86EFAC',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                ● {t('live')}
              </Box>
            </Stack>
            <Typography
              component="h2"
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: { xs: '32px', md: '40px' },
                lineHeight: 1.1,
              }}
            >
              Đà Nẵng · Hội An
            </Typography>
            <Typography
              sx={{ color: 'rgba(255,255,255,0.72)', fontSize: '13px' }}
            >
              {t('tripMeta')}
            </Typography>
            <Stack direction="row" spacing={0.5}>
              {members.map((member) => (
                <Box
                  key={member.initials}
                  sx={{
                    width: 34,
                    height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    borderRadius: '50%',
                    bgcolor: member.color,
                    border: '2px solid rgba(255,255,255,0.75)',
                    fontSize: '11px',
                    fontWeight: 800,
                  }}
                >
                  {member.initials}
                </Box>
              ))}
            </Stack>
          </Stack>

          <Box
            sx={{
              width: 132,
              height: 132,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              borderRadius: '50%',
              border: '12px solid #F97316',
              bgcolor: 'rgba(7,18,37,0.18)',
            }}
          >
            <Stack spacing={0.25} sx={{ alignItems: 'center' }}>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                {t('spent')}
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '21px',
                  fontWeight: 800,
                }}
              >
                12.0tr
              </Typography>
              <Typography
                sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '10px' }}
              >
                / 10tr
              </Typography>
            </Stack>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            px: 2,
            py: 1.5,
            borderRadius: '14px',
            bgcolor: 'rgba(255,255,255,0.1)',
          }}
        >
          <TripSummaryMetric
            label={t('remaining')}
            value="-1.985.000 đ"
            danger
          />
          <TripSummaryMetric label={t('averagePerDay')} value="2.397.000 đ" />
          <TripSummaryMetric label={t('expenseCount')} value="9" />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 3,
          alignItems: 'stretch',
        }}
      >
        <Stack
          component="section"
          spacing={2.5}
          sx={{
            flex: '1 1 52%',
            minWidth: 0,
            p: { xs: 2, md: 2.5 },
            border: 1,
            borderColor: 'divider',
            borderRadius: '20px',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            component="h2"
            sx={{ color: 'text.primary', fontSize: '17px', fontWeight: 800 }}
          >
            {t('spendingByCategory')}
          </Typography>
          <CategoryList />
        </Stack>

        <Stack
          component="section"
          spacing={1}
          sx={{
            flex: '1 1 48%',
            minWidth: 0,
            p: { xs: 2, md: 2.5 },
            border: 1,
            borderColor: 'divider',
            borderRadius: '20px',
            bgcolor: 'background.paper',
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Typography
              component="h2"
              sx={{ color: 'text.primary', fontSize: '17px', fontWeight: 800 }}
            >
              {t('recentTitle')}
            </Typography>
            <Typography
              component="a"
              href="#"
              sx={{ color: 'primary.main', fontSize: '12px', fontWeight: 700 }}
            >
              {t('viewAll')} →
            </Typography>
          </Stack>
          <RecentExpenseList />
        </Stack>
      </Box>
    </Stack>
  );
}
