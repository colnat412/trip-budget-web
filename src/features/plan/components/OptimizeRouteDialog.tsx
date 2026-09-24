'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import DirectionsCarFilledRoundedIcon from '@mui/icons-material/DirectionsCarFilledRounded';
import { useLocale, useTranslations } from 'next-intl';

import { AppCategoryChip } from '@/base/components/ui';
import type { OptimizationResult, PlanActivity } from '../types';
import { solveOptimalRoute } from '../services/googleMapsService';

export interface OptimizeRouteDialogProps {
  open: boolean;
  onClose: () => void;
  dayNumber: number;
  activities: PlanActivity[];
  onApplyRoute: (optimizedActivities: PlanActivity[]) => Promise<void>;
}

const OptimizeRouteDialog = ({
  open,
  onClose,
  dayNumber,
  activities,
  onApplyRoute,
}: OptimizeRouteDialogProps) => {
  const theme = useTheme();
  const locale = useLocale();
  const t = useTranslations('plan.optimize');

  const locActivities = activities.filter(
    (a) => a.location && a.location.trim().length > 0,
  );

  const [startIndex, setStartIndex] = useState<number>(0);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApplying, startApplying] = useTransition();

  const handleClose = () => {
    setResult(null);
    onClose();
  };

  useEffect(() => {
    if (!open || locActivities.length < 2) {
      return;
    }

    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) setIsLoading(true);
    }, 0);

    solveOptimalRoute(activities, {
      startIndex,
      lang: locale === 'en' ? 'en' : 'vi',
    })
      .then((res) => {
        if (isMounted) {
          setResult(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to optimize route:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [open, activities, startIndex, locale, locActivities.length]);

  const handleApply = () => {
    if (!result) return;
    startApplying(async () => {
      await onApplyRoute(result.optimizedActivities);
      handleClose();
    });
  };

  return (
    <Dialog
      open={open}
      onClose={isApplying ? undefined : handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '24px',
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            overflow: 'hidden',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2.5,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RouteRoundedIcon sx={{ fontSize: '24px' }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '16px', sm: '18px' },
                lineHeight: 1.3,
              }}
            >
              {t('title', { day: dayNumber })}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', fontSize: '13px' }}
            >
              {t('subtitle')}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={isApplying}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        {locActivities.length < 2 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary' }}>
              {t('notEnoughLocations')}
            </Typography>
          </Box>
        ) : isLoading ? (
          <Box
            sx={{
              py: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <CircularProgress size={36} />
            <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
              {t('calculating')}
            </Typography>
          </Box>
        ) : result ? (
          <Stack spacing={3}>
            <Box
              sx={{
                display: 'flex',
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                p: 2,
                borderRadius: '16px',
                bgcolor: 'action.hover',
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  {t('startPointLabel')}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  {t('startPointDesc')}
                </Typography>
              </Box>

              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="start-point-select-label">
                  {t('startPoint')}
                </InputLabel>
                <Select
                  labelId="start-point-select-label"
                  value={startIndex}
                  label={t('startPoint')}
                  onChange={(e) => setStartIndex(Number(e.target.value))}
                  sx={{ borderRadius: '10px' }}
                >
                  {locActivities.map((act, idx) => (
                    <MenuItem key={act.id} value={idx}>
                      #{idx + 1} - {act.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Card
              sx={{
                p: 2.5,
                borderRadius: '18px',
                border: 1,
                borderColor: result.isImprovement
                  ? alpha(theme.palette.success.main, 0.4)
                  : 'divider',
                bgcolor: result.isImprovement
                  ? alpha(theme.palette.success.main, 0.05)
                  : 'background.paper',
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      color: 'text.secondary',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    {t('currentRoute')}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: 'text.primary',
                    }}
                  >
                    {result.formattedOriginalDistance}
                  </Typography>
                  <Typography
                    sx={{ fontSize: '12px', color: 'text.secondary' }}
                  >
                    {result.formattedOriginalDuration}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    color: 'text.disabled',
                  }}
                >
                  ➔
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      color: result.isImprovement
                        ? 'success.main'
                        : 'text.secondary',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    {t('optimizedRoute')}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '20px',
                      fontWeight: 800,
                      color: result.isImprovement
                        ? 'success.main'
                        : 'text.primary',
                    }}
                  >
                    {result.formattedOptimizedDistance}
                  </Typography>
                  <Typography
                    sx={{ fontSize: '12px', color: 'text.secondary' }}
                  >
                    {result.formattedOptimizedDuration}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: '12px',
                    bgcolor: result.isImprovement
                      ? alpha(theme.palette.success.main, 0.15)
                      : alpha(theme.palette.info.main, 0.1),
                    color: result.isImprovement ? 'success.dark' : 'info.main',
                    border: 1,
                    borderColor: result.isImprovement
                      ? alpha(theme.palette.success.main, 0.3)
                      : alpha(theme.palette.info.main, 0.3),
                  }}
                >
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}
                  >
                    {result.isImprovement ? (
                      <AutoAwesomeRoundedIcon sx={{ fontSize: '18px' }} />
                    ) : (
                      <CheckCircleRoundedIcon sx={{ fontSize: '18px' }} />
                    )}
                    <Typography
                      sx={{
                        fontSize: '13px',
                        fontWeight: 700,
                      }}
                    >
                      {result.isImprovement
                        ? t('savingsText', {
                            dist: result.formattedSavedDistance,
                            pct: result.savedPercentage,
                          })
                        : t('alreadyOptimal')}
                    </Typography>
                  </Box>
                  {result.isImprovement && (
                    <Typography
                      sx={{
                        fontSize: '11px',
                        fontWeight: 500,
                        opacity: 0.9,
                        mt: 0.25,
                      }}
                    >
                      {t('timeSavingsText', {
                        time: result.formattedSavedDuration,
                      })}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Card>

            <Box>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 1.5,
                }}
              >
                {t('optimizedSequenceTitle')}
              </Typography>

              <Stack spacing={1.5}>
                {result.optimizedActivities.map((activity, idx) => {
                  const segment = result.segments[idx];
                  const hasLocation = Boolean(
                    activity.location && activity.location.trim().length > 0,
                  );

                  return (
                    <React.Fragment key={activity.id}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          p: 1.5,
                          borderRadius: '14px',
                          border: 1,
                          borderColor: 'divider',
                          bgcolor: 'background.paper',
                        }}
                      >
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {idx + 1}
                        </Box>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              flexWrap: 'wrap',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '14px',
                                fontWeight: 600,
                                color: 'text.primary',
                              }}
                            >
                              {activity.title}
                            </Typography>
                            <AppCategoryChip category={activity.category} />
                          </Box>

                          {hasLocation && (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                mt: 0.5,
                              }}
                            >
                              <PlaceRoundedIcon
                                sx={{
                                  fontSize: '14px',
                                  color: 'text.secondary',
                                }}
                              />
                              <Typography
                                sx={{
                                  fontSize: '12px',
                                  color: 'text.secondary',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {activity.location}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>

                      {segment && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            py: 0.5,
                          }}
                        >
                          <ArrowDownwardRoundedIcon
                            sx={{
                              fontSize: '16px',
                              color: 'text.disabled',
                            }}
                          />
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.75,
                              px: 1.25,
                              py: 0.25,
                              borderRadius: '20px',
                              bgcolor: 'action.hover',
                              border: 1,
                              borderColor: 'divider',
                            }}
                          >
                            <DirectionsCarFilledRoundedIcon
                              sx={{
                                fontSize: '13px',
                                color: 'primary.main',
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: '11px',
                                fontWeight: 600,
                                color: 'text.primary',
                              }}
                            >
                              {segment.distance.text}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '11px',
                                color: 'text.secondary',
                              }}
                            >
                              • {segment.duration.text}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </React.Fragment>
                  );
                })}
              </Stack>
            </Box>

            <Divider />

            <Typography
              sx={{
                fontSize: '12px',
                color: 'text.secondary',
                fontStyle: 'italic',
              }}
            >
              {t('footerNote')}
            </Typography>
          </Stack>
        ) : null}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: 1,
          borderColor: 'divider',
          justifyContent: 'space-between',
        }}
      >
        <Button
          onClick={handleClose}
          disabled={isApplying}
          sx={{
            color: 'text.secondary',
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          {t('cancel')}
        </Button>

        <Button
          variant="contained"
          onClick={handleApply}
          disabled={!result || !result.isImprovement || isApplying}
          startIcon={
            isApplying ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <AutoAwesomeRoundedIcon />
            )
          }
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '12px',
            px: 2.5,
          }}
        >
          {isApplying ? t('applying') : t('applyBtn')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OptimizeRouteDialog;
