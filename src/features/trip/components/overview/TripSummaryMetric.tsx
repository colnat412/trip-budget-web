'use client';

import { Stack, Typography } from '@mui/material';

interface TripSummaryMetricProps {
  label: string;
  value: string;
  danger?: boolean;
}

export default function TripSummaryMetric({
  label,
  value,
  danger = false,
}: TripSummaryMetricProps) {
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
