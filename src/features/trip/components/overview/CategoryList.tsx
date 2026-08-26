'use client';

import { Box, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
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

const DEFAULT_CATEGORIES: SpendingCategory[] = [
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

export default function CategoryList() {
  const t = useTranslations('overview');

  return (
    <Stack spacing={2}>
      {DEFAULT_CATEGORIES.map((category) => (
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
