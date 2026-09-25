'use client';

import React from 'react';
import {
  Avatar,
  Box,
  Card,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import { useTranslations } from 'next-intl';

import { AppButton, AppDialog } from '@/base/components/ui';
import usePlanActivityLogs from '../hooks/usePlanActivityLogs';
import type { ActivityLogAction, PlanActivityLog } from '../types';

export interface ActivityLogDialogProps {
  open: boolean;
  onClose: () => void;
  tripId: string | number | null;
}

const getActionConfig = (action: ActivityLogAction) => {
  switch (action) {
    case 'CREATED':
      return {
        label: 'Tạo mới',
        color: 'success' as const,
        icon: <AddCircleRoundedIcon sx={{ fontSize: '14px' }} />,
      };
    case 'UPDATED':
      return {
        label: 'Chỉnh sửa',
        color: 'info' as const,
        icon: <EditRoundedIcon sx={{ fontSize: '14px' }} />,
      };
    case 'STATUS_CHANGED':
      return {
        label: 'Trạng thái',
        color: 'warning' as const,
        icon: <CheckCircleRoundedIcon sx={{ fontSize: '14px' }} />,
      };
    case 'DELETED':
      return {
        label: 'Đã xóa',
        color: 'error' as const,
        icon: <DeleteOutlineRoundedIcon sx={{ fontSize: '14px' }} />,
      };
    case 'REORDERED':
      return {
        label: 'Sắp xếp',
        color: 'secondary' as const,
        icon: <SwapVertRoundedIcon sx={{ fontSize: '14px' }} />,
      };
    default:
      return {
        label: 'Thay đổi',
        color: 'default' as const,
        icon: <HistoryRoundedIcon sx={{ fontSize: '14px' }} />,
      };
  }
};

const formatLogTime = (isoString: string) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
};

const ActivityLogDialog = ({
  open,
  onClose,
  tripId,
}: ActivityLogDialogProps) => {
  const theme = useTheme();
  const t = useTranslations('plan');
  const { logs, isLoading } = usePlanActivityLogs({ tripId, enabled: open });

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={t('activityLog.title')}
      icon={<HistoryRoundedIcon />}
      maxWidth="md"
      actions={
        <AppButton intent="secondary" onClick={onClose}>
          {t('activityLog.close')}
        </AppButton>
      }
    >
      <Stack spacing={2}>
        <Typography sx={{ color: 'text.secondary', fontSize: '13px' }}>
          {t('activityLog.subtitle')}
        </Typography>

        <Divider />

        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 6,
            }}
          >
            <CircularProgress size={32} />
          </Box>
        ) : logs.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              color: 'text.secondary',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <HistoryRoundedIcon sx={{ fontSize: '48px', opacity: 0.3 }} />
            <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>
              {t('activityLog.emptyTitle')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {t('activityLog.emptyDesc')}
            </Typography>
          </Box>
        ) : (
          <Stack
            spacing={1.5}
            sx={{ maxHeight: '60vh', overflowY: 'auto', pr: 0.5 }}
          >
            {logs.map((log: PlanActivityLog) => {
              const actionCfg = getActionConfig(log.action);
              return (
                <Card
                  key={log.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: '14px',
                    bgcolor: alpha(theme.palette.background.paper, 0.6),
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      borderColor: 'primary.light',
                    },
                  }}
                >
                  <Stack spacing={1}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 1,
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1.25}
                        sx={{ alignItems: 'center' }}
                      >
                        <Avatar
                          src={log.userAvatar ?? undefined}
                          sx={{
                            width: 28,
                            height: 28,
                            fontSize: '12px',
                            fontWeight: 700,
                            bgcolor: 'primary.main',
                          }}
                        >
                          {log.userName
                            ? log.userName.charAt(0).toUpperCase()
                            : 'U'}
                        </Avatar>
                        <Box>
                          <Typography
                            sx={{ fontSize: '13px', fontWeight: 700 }}
                          >
                            {log.userName}
                          </Typography>
                          {log.userEmail && (
                            <Typography
                              variant="caption"
                              sx={{ color: 'text.secondary', fontSize: '11px' }}
                            >
                              {log.userEmail}
                            </Typography>
                          )}
                        </Box>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: 'center' }}
                      >
                        <Chip
                          size="small"
                          icon={actionCfg.icon}
                          label={actionCfg.label}
                          color={actionCfg.color}
                          sx={{ height: 22, fontSize: '11px', fontWeight: 700 }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '11px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatLogTime(log.createdAt)}
                        </Typography>
                      </Stack>
                    </Box>

                    <Box sx={{ pl: { sm: 4.75 } }}>
                      <Typography
                        sx={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: 'text.primary',
                        }}
                      >
                        {log.activityTitle}
                      </Typography>
                      {log.description && (
                        <Typography
                          sx={{
                            fontSize: '12px',
                            color: 'text.secondary',
                            mt: 0.25,
                          }}
                        >
                          {log.description}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        )}
      </Stack>
    </AppDialog>
  );
};

export default ActivityLogDialog;
