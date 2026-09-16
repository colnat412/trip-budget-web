'use client';

import { useState, type MouseEvent } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useTranslations } from 'next-intl';

import { AppButton, AppLinearProgress } from '../../ui';
import {
  formatCurrency,
  formatCompactCurrency,
  formatDateRange,
} from '@/base/utils';
import { useTripContext } from '@/features/trip/context/TripContext';
import useTripBudgetSummary from '@/features/expense/hooks/useTripBudgetSummary';
import type { Trip } from '@/features/trip/types';

const SidebarTripCard = () => {
  const t = useTranslations('sidebar');
  const tTrip = useTranslations('trip');
  const { trips, activeTrip, selectTrip, openCreateTrip, isLoading } =
    useTripContext();

  const currentTrip = activeTrip || trips?.[0];
  const { summary } = useTripBudgetSummary({ tripId: currentTrip?.id });

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleSelectTrip = (trip: Trip) => {
    selectTrip(trip.id);
    handleCloseMenu();
  };

  const handleCreateNew = () => {
    handleCloseMenu();
    openCreateTrip();
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          borderRadius: '14px',
          bgcolor: 'action.hover',
          p: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="rounded" width="100%" height={40} />
        <Skeleton variant="rounded" width="100%" height={30} />
      </Box>
    );
  }

  if (!trips || trips.length === 0) {
    return (
      <Box
        sx={{
          borderRadius: '14px',
          bgcolor: 'action.hover',
          p: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'text.primary',
          }}
        >
          {tTrip('noTrips')}
        </Typography>
        <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
          {tTrip('createDescription')}
        </Typography>
        <AppButton
          size="small"
          intent="primary"
          startIcon={<AddRoundedIcon fontSize="small" />}
          onClick={openCreateTrip}
          sx={{ fontSize: '12px', minHeight: 36 }}
        >
          {tTrip('createTrip')}
        </AppButton>
      </Box>
    );
  }

  if (!currentTrip) return null;

  const dateRange = formatDateRange(currentTrip.startDate, currentTrip.endDate);
  const isLive = currentTrip.status === 'IN_PROGRESS';

  return (
    <Box
      sx={{
        overflow: 'hidden',
        borderRadius: '14px',
        bgcolor: 'action.hover',
      }}
    >
      <Box
        sx={{
          p: '12px',
          overflow: 'hidden',
          color: 'common.white',
          background: (theme) => {
            const palette = theme.vars?.palette ?? theme.palette;
            return `linear-gradient(135deg, ${palette.primary.main}, ${palette.primary.light})`;
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography
                variant="caption"
                sx={{ opacity: 0.85, fontSize: '11px' }}
              >
                {t('currentTrip')}
              </Typography>
              {isLive && (
                <Box
                  component="span"
                  sx={{
                    px: 0.75,
                    py: 0.1,
                    borderRadius: '999px',
                    bgcolor: 'rgba(74,222,128,0.25)',
                    color: '#86EFAC',
                    fontSize: '10px',
                    fontWeight: 700,
                  }}
                >
                  ● {tTrip('inProgress')}
                </Box>
              )}
            </Stack>

            <IconButton
              size="small"
              onClick={handleOpenMenu}
              aria-label="Select trip"
              sx={{
                color: 'common.white',
                p: 0.5,
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' },
              }}
            >
              <UnfoldMoreRoundedIcon sx={{ fontSize: '16px' }} />
            </IconButton>
          </Stack>

          <Typography
            sx={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: 1.2,
              color: 'common.white',
            }}
          >
            {currentTrip.name}
          </Typography>

          <Typography
            variant="caption"
            sx={{ opacity: 0.85, fontSize: '11px' }}
          >
            {currentTrip.destination}
            {dateRange ? ` · ${dateRange}` : ''}
          </Typography>
        </Box>
      </Box>

      <Menu
        anchorEl={menuAnchorEl}
        open={isMenuOpen}
        onClose={handleCloseMenu}
        slotProps={{
          paper: {
            sx: {
              minWidth: 220,
              maxHeight: 320,
              borderRadius: '12px',
              p: 0.5,
            },
          },
        }}
      >
        <Typography
          sx={{
            px: 1.5,
            py: 0.75,
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: 'text.secondary',
            letterSpacing: '0.5px',
          }}
        >
          {tTrip('allTrips')} ({trips.length})
        </Typography>

        {trips.map((item) => {
          const isSelected = String(item.id) === String(currentTrip?.id);
          return (
            <MenuItem
              key={item.id}
              onClick={() => handleSelectTrip(item)}
              selected={isSelected}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: '8px',
                py: 1,
                gap: 1,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  noWrap
                  sx={{
                    fontSize: '13px',
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? 'primary.main' : 'text.primary',
                  }}
                >
                  {item.name}
                </Typography>
                <Typography
                  noWrap
                  variant="caption"
                  sx={{ fontSize: '11px', color: 'text.secondary' }}
                >
                  {item.destination}
                </Typography>
              </Box>

              {isSelected && (
                <CheckRoundedIcon
                  fontSize="small"
                  sx={{ color: 'primary.main', flexShrink: 0 }}
                />
              )}
            </MenuItem>
          );
        })}

        <Box
          sx={{
            pt: 1,
            mt: 0.5,
            borderTop: 1,
            borderColor: 'divider',
            px: 0.5,
          }}
        >
          <AppButton
            fullWidth
            size="small"
            intent="secondary"
            startIcon={<AddRoundedIcon fontSize="small" />}
            onClick={handleCreateNew}
            sx={{ fontSize: '12px', minHeight: 34 }}
          >
            {tTrip('createTrip')}
          </AppButton>
        </Box>
      </Menu>

      <Box sx={{ p: '12px', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {(() => {
          const totalSpent = summary?.actualSpent ?? 0;
          const totalBudget = summary?.totalBudget ?? 0;
          const percentage = summary ? Math.round(summary.percentageUsed) : 0;
          const isOverBudget = totalBudget > 0 && totalSpent > totalBudget;
          const isWarning = !isOverBudget && percentage > 85;

          const fullSpent = formatCurrency(
            totalSpent,
            currentTrip.baseCurrency,
          );
          const fullBudget = formatCurrency(
            totalBudget,
            currentTrip.baseCurrency,
          );
          const compactSpent = formatCompactCurrency(
            totalSpent,
            currentTrip.baseCurrency,
          );
          const compactBudget = formatCompactCurrency(
            totalBudget,
            currentTrip.baseCurrency,
          );

          return (
            <>
              <Stack
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                  }}
                >
                  {t('budget')}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: isOverBudget
                      ? 'error.main'
                      : isWarning
                        ? 'warning.main'
                        : 'text.primary',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                  }}
                >
                  {summary ? `${percentage}%` : '0%'}
                </Typography>
              </Stack>

              <AppLinearProgress
                value={Math.min(100, Math.max(0, percentage))}
                barColor={
                  isOverBudget
                    ? '#EF4444'
                    : isWarning
                      ? '#F59E0B'
                      : 'primary.main'
                }
                height={6}
              />

              <Stack
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  pt: 0.25,
                }}
                title={`Đã chi: ${fullSpent} / Ngân sách: ${fullBudget}`}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: isOverBudget ? 'error.main' : 'text.primary',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {compactSpent}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  / {compactBudget}
                </Typography>
              </Stack>
            </>
          );
        })()}
      </Box>
    </Box>
  );
};

export default SidebarTripCard;
