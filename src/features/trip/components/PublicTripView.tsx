'use client';

import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Card,
  Chip,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import {
  AppButton,
  AppToast,
  type AppToastSeverity,
} from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';
import PlanDayTabs from '@/features/plan/components/PlanDayTabs';
import DayTimelineList from '@/features/plan/components/DayTimelineList';
import type { PublicTripSnapshot } from '../types';
import type { TripMemberStatus } from '../types/member.types';

const PublicPageSurface = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      flex: 1,
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.paper',
    }}
  >
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'action.hover',
      }}
    >
      {children}
    </Box>
  </Box>
);

export interface PublicTripViewProps {
  token: string;
  snapshot: PublicTripSnapshot | null;
  errorStatus: number | null;
}

const PublicTripView = ({
  token,
  snapshot,
  errorStatus,
}: PublicTripViewProps) => {
  const theme = useTheme();
  const router = useRouter();
  const t = useTranslations('trip.share');

  const trip = snapshot?.trip ?? null;
  const plan = snapshot?.plan ?? null;
  const [selectedDayId, setSelectedDayId] = useState<string>(
    plan?.days?.[0]?.id ? String(plan.days[0].id) : '',
  );
  const [viewerStatus, setViewerStatus] = useState<TripMemberStatus | null>(
    null,
  );
  const [isJoining, setIsJoining] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: AppToastSeverity;
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (!trip) return;
    let isMounted = true;

    axios
      .get(`/api/public/trips/${token}/me`)
      .then((res) => {
        if (isMounted)
          setViewerStatus(res.data?.data?.currentUserStatus ?? null);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [token, trip]);

  const handleJoinTrip = async () => {
    try {
      setIsJoining(true);
      await axios.post(`/api/public/trips/${token}/join`);
      setIsJoining(false);
      setViewerStatus('INVITED');
      setToast({
        open: true,
        message: t('joinRequestedSuccess'),
        severity: 'success',
      });
    } catch (err: unknown) {
      setIsJoining(false);
      const axiosErr = err as { response?: { status?: number } };
      if (axiosErr.response?.status === 401) {
        router.push(`/login?redirect=/share/trip/${token}`);
      } else {
        setToast({
          open: true,
          message: t('joinError'),
          severity: 'error',
        });
      }
    }
  };

  // Handle Private or Not Found Error
  if (errorStatus === 403 || errorStatus === 404 || !trip) {
    const isPrivate = errorStatus === 403;
    return (
      <PublicPageSurface>
        <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
          <Card
            variant="outlined"
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: '24px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '20px',
                bgcolor: alpha(theme.palette.warning.main, 0.12),
                color: 'warning.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LockRoundedIcon sx={{ fontSize: '32px' }} />
            </Box>

            <Typography
              variant="h5"
              sx={{ fontWeight: 800, fontFamily: 'var(--font-display)' }}
            >
              {isPrivate ? t('privateErrorTitle') : t('notFoundErrorTitle')}
            </Typography>

            <Typography
              sx={{ color: 'text.secondary', fontSize: '14px', maxWidth: 400 }}
            >
              {isPrivate ? t('privateErrorDesc') : t('notFoundErrorDesc')}
            </Typography>

            <Stack
              direction="row"
              spacing={1.5}
              sx={{ mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <Link
                href={`/login?redirect=/share/trip/${token}`}
                passHref
                style={{ textDecoration: 'none' }}
              >
                <AppButton intent="primary" startIcon={<LoginRoundedIcon />}>
                  {t('loginBtn')}
                </AppButton>
              </Link>
              <Link href="/" passHref style={{ textDecoration: 'none' }}>
                <AppButton intent="secondary">{t('homeBtn')}</AppButton>
              </Link>
            </Stack>
          </Card>
        </Container>
      </PublicPageSurface>
    );
  }

  const days = plan?.days ?? [];
  const selectedDay =
    days.find((d) => String(d.id) === String(selectedDayId)) ?? days[0] ?? null;

  return (
    <PublicPageSurface>
      <Box
        sx={{
          pb: 8,
          pt: { xs: 2.5, md: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            {viewerStatus === 'INVITED' && (
              <Alert
                severity="info"
                icon={<HourglassEmptyRoundedIcon />}
                sx={{ borderRadius: '16px' }}
              >
                {t('joinPendingNotice')}
              </Alert>
            )}

            <Card
              variant="outlined"
              sx={{
                p: { xs: 2.5, md: 3.5 },
                borderRadius: '20px',
                bgcolor: 'background.paper',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              }}
            >
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2.5}
                sx={{
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', md: 'center' },
                }}
              >
                <Stack spacing={1} sx={{ minWidth: 0, flex: 1 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center', flexWrap: 'wrap' }}
                  >
                    <Chip
                      size="small"
                      icon={<PublicRoundedIcon sx={{ fontSize: '16px' }} />}
                      label={t('publicTitle')}
                      sx={{
                        height: 24,
                        fontSize: '11px',
                        fontWeight: 700,
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: 'primary.main',
                      }}
                    />
                    <Chip
                      size="small"
                      icon={
                        trip.publicRole === 'EDITOR' ? (
                          <EditRoundedIcon sx={{ fontSize: '14px' }} />
                        ) : (
                          <VisibilityRoundedIcon sx={{ fontSize: '14px' }} />
                        )
                      }
                      label={
                        trip.publicRole === 'EDITOR'
                          ? t('roleEditor')
                          : t('roleViewer')
                      }
                      color={
                        trip.publicRole === 'EDITOR' ? 'success' : 'default'
                      }
                      sx={{ height: 24, fontSize: '11px', fontWeight: 700 }}
                    />
                  </Stack>

                  <Typography
                    component="h1"
                    sx={{
                      fontFamily: 'var(--font-display)',
                      fontSize: { xs: '24px', sm: '30px' },
                      fontWeight: 800,
                      color: 'text.primary',
                      lineHeight: 1.25,
                    }}
                  >
                    {trip.name}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      color: 'text.secondary',
                      fontSize: '13px',
                    }}
                  >
                    {trip.destination && (
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <PlaceRoundedIcon
                          sx={{ fontSize: '16px', color: 'primary.main' }}
                        />
                        <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                          {trip.destination}
                        </Typography>
                      </Box>
                    )}

                    {trip.startDate && trip.endDate && (
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <CalendarMonthRoundedIcon sx={{ fontSize: '16px' }} />
                        <Typography sx={{ fontSize: '13px' }}>
                          {trip.startDate} – {trip.endDate}
                        </Typography>
                      </Box>
                    )}

                    {plan && plan.totalEstimatedCost > 0 && (
                      <Typography
                        sx={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: 'success.main',
                        }}
                      >
                        · {t('estimatedBudget')}:{' '}
                        {formatCurrency(
                          plan.totalEstimatedCost,
                          trip.baseCurrency,
                        )}
                      </Typography>
                    )}
                  </Stack>

                  {trip.description && (
                    <Typography
                      sx={{
                        fontSize: '13px',
                        color: 'text.secondary',
                        mt: 0.5,
                      }}
                    >
                      {trip.description}
                    </Typography>
                  )}
                </Stack>

                <Box
                  sx={{
                    flexShrink: 0,
                    alignSelf: { xs: 'stretch', md: 'center' },
                  }}
                >
                  {viewerStatus === 'ACTIVE' ? (
                    <AppButton
                      intent="primary"
                      size="medium"
                      startIcon={<CheckCircleRoundedIcon />}
                      onClick={() => router.push('/plan')}
                      sx={{ width: { xs: '100%', sm: 'auto' }, px: 3 }}
                    >
                      {t('enterTripBtn')}
                    </AppButton>
                  ) : viewerStatus === 'INVITED' ? (
                    <AppButton
                      intent="secondary"
                      size="medium"
                      startIcon={<HourglassEmptyRoundedIcon />}
                      disabled
                      sx={{ width: { xs: '100%', sm: 'auto' }, px: 3 }}
                    >
                      {t('joinPendingBtn')}
                    </AppButton>
                  ) : (
                    <AppButton
                      intent="primary"
                      size="medium"
                      startIcon={<GroupAddRoundedIcon />}
                      onClick={handleJoinTrip}
                      loading={isJoining}
                      sx={{ width: { xs: '100%', sm: 'auto' }, px: 3 }}
                    >
                      {t('joinTripBtn')}
                    </AppButton>
                  )}
                </Box>
              </Stack>
            </Card>

            {days.length > 0 ? (
              <>
                <PlanDayTabs
                  days={days}
                  selectedDayId={String(selectedDay?.id ?? '')}
                  currency={trip.baseCurrency}
                  onSelectDay={(dayId) => setSelectedDayId(dayId)}
                />

                <DayTimelineList
                  activities={selectedDay?.activities ?? []}
                  currency={trip.baseCurrency}
                  destinationContext={trip.destination}
                  onAddActivity={() => {}}
                  onEditActivity={() => {}}
                  onDeleteActivity={() => {}}
                  onToggleStatus={() => {}}
                  readOnly={true}
                />
              </>
            ) : (
              <Card sx={{ p: 4, textAlign: 'center', borderRadius: '16px' }}>
                <Typography sx={{ color: 'text.secondary' }}>
                  {t('noActivitiesNotice')}
                </Typography>
              </Card>
            )}
          </Stack>
        </Container>

        <AppToast
          open={toast.open}
          message={toast.message}
          severity={toast.severity}
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        />
      </Box>
    </PublicPageSurface>
  );
};

export default PublicTripView;
