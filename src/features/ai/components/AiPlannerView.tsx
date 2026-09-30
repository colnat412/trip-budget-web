'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Stack,
  Typography,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import AltRouteOutlinedIcon from '@mui/icons-material/AltRouteOutlined';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import { useTranslations } from 'next-intl';

import {
  AppPageContainer,
  AppCard,
  AppButton,
  AppTextField,
  AppNumberInput,
  AppToast,
  type AppToastSeverity,
} from '@/base/components/ui';
import { useTripContext } from '@/features/trip/context/TripContext';
import { useGenerateAiPlan } from '@/features/plan/hooks/usePlanMutation';
import DestinationAutocomplete from '@/features/trip/components/DestinationAutocomplete';

// const PREFERENCE_CHIPS = [
//   '🍜 Ẩm thực & đặc sản bản địa',
//   '☕ Cafe view đẹp & check-in',
//   '🌿 Nghỉ dưỡng & thư giãn nhẹ nhàng',
//   '💰 Tối ưu ngân sách sinh viên',
//   '🏛️ Lịch sử & danh lam thắng cảnh',
//   '🌊 Trải nghiệm ngoài trời & trekking',
//   '🛍️ Mua sắm chợ đêm & quà lưu niệm',
//   '🌙 Trải nghiệm ẩm thực đêm',
// ];

const AiPlannerView = () => {
  const router = useRouter();
  const t = useTranslations('aiPlanner');
  const { trips, activeTrip, selectTrip, openCreateTrip } = useTripContext();

  const currentTrip = activeTrip || trips[0] || null;
  const tripId = currentTrip?.id;

  const tripDays = (() => {
    if (!currentTrip?.startDate || !currentTrip?.endDate) return 3;
    const start = new Date(currentTrip.startDate).getTime();
    const end = new Date(currentTrip.endDate).getTime();
    const diff = Math.ceil((end - start) / (1000 * 3600 * 24)) + 1;
    return diff > 0 ? diff : 1;
  })();

  const [destinationInput, setDestinationInput] = useState<string | null>(null);
  const [people, setPeople] = useState(2);
  const [budget, setBudget] = useState<number | undefined>(5000000);
  const [preferences, setPreferences] = useState('');
  const [generatedSuccess, setGeneratedSuccess] = useState(false);

  const destination = destinationInput ?? (currentTrip?.destination || '');
  const days = tripDays;

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: AppToastSeverity;
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = (
    message: string,
    severity: AppToastSeverity = 'success',
  ) => {
    setToast({ open: true, message, severity });
  };

  const { generateAiPlanAsync, isPending } = useGenerateAiPlan({
    tripId: tripId || '',
  });

  // const handleAddChip = (chipText: string) => {
  //   const text = chipText.replace(/^[^\s]+\s/, '');
  //   setPreferences((prev) => {
  //     if (!prev) return text;
  //     if (prev.includes(text)) return prev;
  //     return `${prev}, ${text}`;
  //   });
  // };

  const handleGenerate = async () => {
    if (!tripId) {
      showToast('Vui lòng chọn hoặc tạo một chuyến đi trước.', 'error');
      return;
    }
    if (!destination.trim()) {
      showToast(t('destinationPlaceholder'), 'error');
      return;
    }
    if (days < 1 || days > 30) {
      showToast('Số ngày chuyến đi phải từ 1 đến 30 ngày.', 'error');
      return;
    }

    try {
      await generateAiPlanAsync({
        destination: destination.trim(),
        days: Number(days),
        budget: Number(budget || 0),
        people: Number(people || 1),
        preferences: preferences.trim(),
      });

      setGeneratedSuccess(true);
      showToast(t('successAlert'));
      setTimeout(() => {
        router.push('/plan');
      }, 1200);
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error
          ? err.message
          : 'Không thể kết nối đến máy chủ AI.';
      showToast(errMsg, 'error');
    }
  };

  const capabilities = [
    {
      icon: (
        <AccessTimeOutlinedIcon sx={{ color: 'primary.main', fontSize: 28 }} />
      ),
      title: t('cap1Title'),
      desc: t('cap1Desc'),
    },
    {
      icon: (
        <SavingsOutlinedIcon sx={{ color: 'success.main', fontSize: 28 }} />
      ),
      title: t('cap2Title'),
      desc: t('cap2Desc'),
    },
    {
      icon: (
        <AltRouteOutlinedIcon sx={{ color: 'warning.main', fontSize: 28 }} />
      ),
      title: t('cap3Title'),
      desc: t('cap3Desc'),
    },
  ];

  return (
    <AppPageContainer>
      <Box
        sx={{
          width: '100%',
          p: { xs: 3, md: 4 },
          borderRadius: '24px',
          background:
            'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.08) 50%, rgba(245, 158, 11, 0.08) 100%)',
          border: '1px solid',
          borderColor: 'primary.light',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2.5,
        }}
      >
        <Box sx={{ maxWidth: 640 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', mb: 1 }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.8,
                px: 1.5,
                py: 0.5,
                borderRadius: '20px',
                bgcolor: 'primary.main',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.3px',
              }}
            >
              <AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />
              {t('badge')}
            </Box>
            {/* <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontWeight: 600 }}
            >
              {t('provider')}
            </Typography> */}
          </Stack>

          <Typography
            component="h1"
            sx={{
              fontSize: { xs: '24px', sm: '30px' },
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: 'text.primary',
              letterSpacing: '-0.5px',
              mb: 1,
            }}
          >
            {t('title')}
          </Typography>

          <Typography
            sx={{ color: 'text.secondary', fontSize: '14px', lineHeight: 1.6 }}
          >
            {t('subtitle')}
          </Typography>
        </Box>

        {currentTrip && (
          <AppCard
            sx={{
              minWidth: { xs: '100%', sm: 260 },
              p: 2,
              borderRadius: '16px',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontWeight: 600 }}
            >
              {t('activeTripLabel')}
            </Typography>
            <Typography
              variant="subtitle1"
              noWrap
              sx={{ fontWeight: 700, color: 'primary.main', mt: 0.3 }}
            >
              {currentTrip.name}
            </Typography>
            {currentTrip.destination && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                📍 {currentTrip.destination}
              </Typography>
            )}
            <AppButton
              intent="secondary"
              size="small"
              onClick={() => router.push('/plan')}
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{ mt: 1.5, width: '100%' }}
            >
              {t('viewPlanBtn')}
            </AppButton>
          </AppCard>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 3,
          mt: 0.5,
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ flex: { xs: '1 1 auto', lg: 2 }, width: '100%' }}>
          <AppCard
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: '20px',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}
            >
              {t('formTitle')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              {t('formSubtitle')}
            </Typography>

            <Stack spacing={3}>
              {trips.length > 1 && (
                <FormControl fullWidth size="medium">
                  <InputLabel id="select-trip-label">
                    {t('selectTripLabel')}
                  </InputLabel>
                  <Select
                    labelId="select-trip-label"
                    value={String(currentTrip?.id || '')}
                    label={t('selectTripLabel')}
                    onChange={(e) => {
                      selectTrip(e.target.value);
                      setDestinationInput(null);
                    }}
                  >
                    {trips.map((tr) => (
                      <MenuItem key={tr.id} value={String(tr.id)}>
                        {tr.name} {tr.destination ? `(${tr.destination})` : ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <DestinationAutocomplete
                value={destination}
                onChange={(val) => setDestinationInput(val)}
                disabled={isPending}
                required
                label={t('destinationLabel')}
                placeholder={t('destinationPlaceholder')}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                <AppTextField
                  label={t('daysLabel')}
                  type="number"
                  value={days}
                  disabled
                  helperText={t('daysDisabledHelper')}
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthOutlinedIcon
                            fontSize="small"
                            sx={{ color: 'primary.main' }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <AppTextField
                  label={t('peopleLabel')}
                  type="number"
                  value={people}
                  onChange={(e) =>
                    setPeople(Math.max(1, parseInt(e.target.value, 10) || 1))
                  }
                  disabled={isPending}
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PeopleAltOutlinedIcon
                            fontSize="small"
                            sx={{ color: 'primary.main' }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Stack>

              <AppNumberInput
                label={t('budgetLabel')}
                value={budget}
                onValueChange={(val) => setBudget(val)}
                currencySuffix={currentTrip?.baseCurrency || 'VND'}
                disabled={isPending}
                fullWidth
              />
              {/* <Box>
                <Typography
                  variant="body2"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontWeight: 700,
                    color: 'text.secondary',
                    mb: 1.2,
                  }}
                >
                  <LightbulbOutlinedIcon
                    sx={{ fontSize: 18, color: 'warning.main' }}
                  />
                  {t('preferencesTitle')}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {PREFERENCE_CHIPS.map((chip) => (
                    <Chip
                      key={chip}
                      label={chip}
                      size="medium"
                      onClick={() => handleAddChip(chip)}
                      disabled={isPending}
                      sx={{
                        cursor: 'pointer',
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: '13px',
                        bgcolor: 'action.hover',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'primary.50',
                          color: 'primary.main',
                          borderColor: 'primary.main',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box> */}

              <AppTextField
                label={t('preferencesLabel')}
                placeholder={t('preferencesPlaceholder')}
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                multiline
                rows={3}
                disabled={isPending}
                fullWidth
              />

              {isPending && (
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: '16px',
                    bgcolor: 'primary.50',
                    border: '1.5px dashed',
                    borderColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <CircularProgress size={32} thickness={4} />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: 'primary.main' }}
                    >
                      {t('generatingTitle')}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary' }}
                    >
                      {t('generatingSubtitle')}
                    </Typography>
                  </Box>
                </Box>
              )}

              {generatedSuccess && (
                <Alert
                  severity="success"
                  icon={<CheckCircleOutlineRoundedIcon fontSize="inherit" />}
                  sx={{ borderRadius: '14px' }}
                >
                  {t('successAlert')}
                </Alert>
              )}

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ pt: 1, justifyContent: 'flex-end' }}
              >
                {!currentTrip && (
                  <AppButton
                    intent="secondary"
                    onClick={openCreateTrip}
                    startIcon={<FlightTakeoffRoundedIcon />}
                  >
                    {t('createTripFirst')}
                  </AppButton>
                )}

                <AppButton
                  intent="primary"
                  size="large"
                  onClick={handleGenerate}
                  disabled={isPending || !destination.trim() || !currentTrip}
                  startIcon={
                    isPending ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <AutoAwesomeRoundedIcon />
                    )
                  }
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '15px',
                    fontWeight: 700,
                    borderRadius: '14px',
                  }}
                >
                  {isPending ? t('generatingCta') : t('generateCta')}
                </AppButton>
              </Stack>
            </Stack>
          </AppCard>
        </Box>

        <Box sx={{ flex: { xs: '1 1 auto', lg: 1 }, width: '100%' }}>
          <Stack spacing={3}>
            <AppCard
              sx={{
                p: 3,
                borderRadius: '20px',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 800, color: 'text.primary', mb: 2.5 }}
              >
                {t('capabilitiesTitle')}
              </Typography>

              <Stack spacing={2.5}>
                {capabilities.map((cap, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.2,
                        borderRadius: '12px',
                        bgcolor: 'action.hover',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {cap.icon}
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, color: 'text.primary', mb: 0.3 }}
                      >
                        {cap.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary', lineHeight: 1.5 }}
                      >
                        {cap.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </AppCard>

            <AppCard
              sx={{
                p: 3,
                borderRadius: '20px',
                border: '1px solid',
                borderColor: 'primary.light',
                bgcolor: 'background.paper',
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', mb: 1 }}
              >
                <LightbulbOutlinedIcon sx={{ color: 'warning.main' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  {t('tipsTitle')}
                </Typography>
              </Stack>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  display: 'block',
                  lineHeight: 1.6,
                }}
              >
                • {t('tip1')}
                <br />• {t('tip2')}
              </Typography>

              <AppButton
                intent="secondary"
                size="small"
                onClick={() => router.push('/plan')}
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{ mt: 2, width: '100%' }}
              >
                {t('viewPlanBtn')}
              </AppButton>
            </AppCard>
          </Stack>
        </Box>
      </Box>

      <AppToast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </AppPageContainer>
  );
};

export default AiPlannerView;
