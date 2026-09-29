'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { useTranslations } from 'next-intl';

import { AppButton, AppDialog } from '@/base/components/ui';
import {
  useTripShareSettings,
  useUpdateShareSettings,
  useRegenerateShareToken,
} from '../hooks/useTripShare';
import type { TripPublicRole, TripVisibility } from '../types';
import { Share } from '@mui/icons-material';

export interface ShareTripDialogProps {
  open: boolean;
  onClose: () => void;
  tripId: string | number;
  tripName: string;
}

const ShareTripDialog = ({
  open,
  onClose,
  tripId,
  tripName,
}: ShareTripDialogProps) => {
  const theme = useTheme();
  const t = useTranslations('trip.share');

  const { shareSettings, isLoading } = useTripShareSettings({
    tripId,
    enabled: open,
  });

  const [userVisibility, setUserVisibility] = useState<TripVisibility | null>(
    null,
  );
  const [userRole, setUserRole] = useState<TripPublicRole | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const visibility = userVisibility ?? shareSettings?.visibility ?? 'PRIVATE';
  const publicRole = userRole ?? shareSettings?.publicRole ?? 'VIEWER';

  const handleClose = () => {
    setUserVisibility(null);
    setUserRole(null);
    setCopied(false);
    onClose();
  };

  const { updateShareSettings, isPending: isUpdating } = useUpdateShareSettings(
    {
      tripId,
      options: {
        onSuccess: () => {
          handleClose();
        },
      },
    },
  );

  const { regenerateShareToken, isPending: isRegenerating } =
    useRegenerateShareToken({
      tripId,
      options: {
        onSuccess: () => {
          setCopied(false);
        },
      },
    });

  const shareToken = shareSettings?.shareToken ?? '';
  const shareUrl =
    typeof window !== 'undefined' && shareToken
      ? `${window.location.origin}/share/trip/${shareToken}`
      : '';

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleSave = () => {
    updateShareSettings({
      visibility,
      publicRole,
    });
  };

  const handleRegenerate = () => {
    if (window.confirm(t('confirmRegenerate'))) {
      regenerateShareToken({});
    }
  };

  return (
    <AppDialog
      open={open}
      onClose={handleClose}
      title={t('dialogTitle')}
      description={t('dialogSubtitle', { name: tripName })}
      icon={<Share />}
      maxWidth="sm"
      actions={
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ justifyContent: 'flex-end', width: '100%' }}
        >
          <AppButton intent="secondary" onClick={handleClose}>
            {t('cancel')}
          </AppButton>
          <AppButton intent="primary" onClick={handleSave} loading={isUpdating}>
            {t('saveChanges')}
          </AppButton>
        </Stack>
      }
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <Stack spacing={2.5}>
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              sx={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'text.primary',
                mb: 1,
              }}
            >
              {t('accessLevelLabel')}
            </FormLabel>
            <RadioGroup
              value={visibility}
              onChange={(e) =>
                setUserVisibility(e.target.value as TripVisibility)
              }
            >
              <Card
                variant="outlined"
                sx={{
                  mb: 1.5,
                  p: 1.5,
                  borderRadius: '12px',
                  borderColor:
                    visibility === 'PRIVATE'
                      ? 'primary.main'
                      : alpha(theme.palette.divider, 0.8),
                  bgcolor:
                    visibility === 'PRIVATE'
                      ? alpha(theme.palette.primary.main, 0.04)
                      : 'background.paper',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => setUserVisibility('PRIVATE')}
              >
                <FormControlLabel
                  value="PRIVATE"
                  control={<Radio size="small" />}
                  label={
                    <Box sx={{ ml: 0.5 }}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <LockRoundedIcon
                          sx={{
                            fontSize: '18px',
                            color:
                              visibility === 'PRIVATE'
                                ? 'primary.main'
                                : 'text.secondary',
                          }}
                        />
                        <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>
                          {t('privateTitle')}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '12px',
                          mt: 0.25,
                        }}
                      >
                        {t('privateDesc')}
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0, width: '100%', alignItems: 'flex-start' }}
                />
              </Card>

              <Card
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  borderColor:
                    visibility === 'PUBLIC'
                      ? 'primary.main'
                      : alpha(theme.palette.divider, 0.8),
                  bgcolor:
                    visibility === 'PUBLIC'
                      ? alpha(theme.palette.primary.main, 0.04)
                      : 'background.paper',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => setUserVisibility('PUBLIC')}
              >
                <FormControlLabel
                  value="PUBLIC"
                  control={<Radio size="small" />}
                  label={
                    <Box sx={{ ml: 0.5 }}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <PublicRoundedIcon
                          sx={{
                            fontSize: '18px',
                            color:
                              visibility === 'PUBLIC'
                                ? 'primary.main'
                                : 'text.secondary',
                          }}
                        />
                        <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>
                          {t('publicTitle')}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '12px',
                          mt: 0.25,
                        }}
                      >
                        {t('publicDesc')}
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0, width: '100%', alignItems: 'flex-start' }}
                />

                {visibility === 'PUBLIC' && (
                  <Box
                    sx={{
                      mt: 1.5,
                      pt: 1.5,
                      borderTop: 1,
                      borderColor: alpha(theme.palette.divider, 0.6),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 1.5,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Box>
                      <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                        {t('publicRoleLabel')}
                      </Typography>
                      <Typography
                        sx={{ fontSize: '11px', color: 'text.secondary' }}
                      >
                        {publicRole === 'VIEWER'
                          ? t('viewerDesc')
                          : t('editorDesc')}
                      </Typography>
                    </Box>

                    <Select
                      size="small"
                      value={publicRole}
                      onChange={(e) =>
                        setUserRole(e.target.value as TripPublicRole)
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          {selected === 'EDITOR' ? (
                            <EditRoundedIcon
                              sx={{ fontSize: '16px', color: 'primary.main' }}
                            />
                          ) : (
                            <VisibilityRoundedIcon
                              sx={{ fontSize: '16px', color: 'text.secondary' }}
                            />
                          )}
                          <Typography
                            component="span"
                            sx={{ fontSize: '13px', fontWeight: 600 }}
                          >
                            {selected === 'EDITOR'
                              ? t('roleEditor')
                              : t('roleViewer')}
                          </Typography>
                        </Box>
                      )}
                      sx={{
                        minWidth: 145,
                        minHeight: 38,
                        height: 38,
                        fontSize: '13px',
                        fontWeight: 600,
                        borderRadius: '10px',
                        bgcolor: 'background.paper',
                        '& .MuiSelect-select': {
                          py: '6px',
                          px: '12px',
                          display: 'flex',
                          alignItems: 'center',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(theme.palette.divider, 0.8),
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <MenuItem
                        value="VIEWER"
                        sx={{
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          py: 1,
                        }}
                      >
                        <VisibilityRoundedIcon
                          sx={{ fontSize: '16px', color: 'text.secondary' }}
                        />
                        <span>{t('roleViewer')}</span>
                      </MenuItem>
                      <MenuItem
                        value="EDITOR"
                        sx={{
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          py: 1,
                        }}
                      >
                        <EditRoundedIcon
                          sx={{ fontSize: '16px', color: 'primary.main' }}
                        />
                        <span>{t('roleEditor')}</span>
                      </MenuItem>
                    </Select>
                  </Box>
                )}
              </Card>
            </RadioGroup>
          </FormControl>

          <Divider />

          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'text.primary',
                }}
              >
                {t('shareLinkTitle')}
              </Typography>
              <Tooltip title={t('regenerateTooltip')} arrow placement="top">
                <Box
                  component="button"
                  type="button"
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.6,
                    border: 'none',
                    bgcolor: 'transparent',
                    color: 'text.secondary',
                    cursor: isRegenerating ? 'not-allowed' : 'pointer',
                    fontSize: '11px',
                    fontWeight: 600,
                    py: 0.5,
                    px: 1,
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      color: 'primary.main',
                    },
                  }}
                >
                  <RefreshRoundedIcon
                    sx={{
                      fontSize: '15px',
                      animation: isRegenerating
                        ? 'spin 1s linear infinite'
                        : 'none',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                  <span>{t('regenerateBtn')}</span>
                </Box>
              </Tooltip>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : '#F8FAFC',
                border: 1,
                borderColor: (theme) => alpha(theme.palette.divider, 0.8),
                borderRadius: '12px',
                p: 0.6,
                pl: 1.5,
                gap: 1.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
            >
              <Box
                component="input"
                readOnly
                value={shareUrl}
                onClick={(e: React.MouseEvent<HTMLInputElement>) =>
                  e.currentTarget.select()
                }
                sx={{
                  flex: 1,
                  minWidth: 0,
                  border: 'none',
                  outline: 'none',
                  bgcolor: 'transparent',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12.5px',
                  color: 'text.primary',
                  cursor: 'text',
                  userSelect: 'all',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              />

              <AppButton
                size="small"
                intent={copied ? 'primary' : 'secondary'}
                startIcon={
                  copied ? (
                    <CheckRoundedIcon sx={{ fontSize: '15px' }} />
                  ) : (
                    <ContentCopyRoundedIcon sx={{ fontSize: '15px' }} />
                  )
                }
                onClick={handleCopyLink}
                sx={{
                  flexShrink: 0,
                  minHeight: '34px',
                  height: '34px',
                  px: 1.5,
                  fontSize: '12px',
                  fontWeight: 700,
                  borderRadius: '8px',
                }}
              >
                {copied ? t('copiedBtn') : t('copyBtn')}
              </AppButton>
            </Box>

            <Typography
              sx={{ fontSize: '11px', color: 'text.secondary', mt: 0.75 }}
            >
              {visibility === 'PUBLIC'
                ? t('publicLinkNotice')
                : t('privateLinkNotice')}
            </Typography>
          </Box>
        </Stack>
      )}
    </AppDialog>
  );
};

export default ShareTripDialog;
