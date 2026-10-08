'use client';

import React from 'react';
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { useTranslations } from 'next-intl';

import {
  AppDialog,
  AppButton,
  AppInfiniteScrollTrigger,
} from '@/base/components/ui';
import usePlanActivityLogs from '../hooks/usePlanActivityLogs';
import type { ActivityLogAction, PlanActivityLog } from '../types';

export interface ActivityLogDialogProps {
  open: boolean;
  onClose: () => void;
  tripId: string | number | null;
}

const ACTION_CONFIGS = {
  CREATED: {
    label: 'Tạo mới',
    bg: 'rgba(22, 163, 74, 0.08)',
    color: '#16A34A',
    borderColor: 'rgba(22, 163, 74, 0.25)',
    icon: <AddCircleRoundedIcon sx={{ fontSize: '13px' }} />,
  },
  UPDATED: {
    label: 'Chỉnh sửa',
    bg: 'rgba(14, 165, 233, 0.1)',
    color: '#0284C7',
    borderColor: 'rgba(14, 165, 233, 0.25)',
    icon: <EditRoundedIcon sx={{ fontSize: '13px' }} />,
  },
  STATUS_CHANGED: {
    label: 'Trạng thái',
    bg: 'rgba(245, 158, 11, 0.1)',
    color: '#D97706',
    borderColor: 'rgba(245, 158, 11, 0.25)',
    icon: <CheckCircleRoundedIcon sx={{ fontSize: '13px' }} />,
  },
  DELETED: {
    label: 'Đã xóa',
    bg: 'rgba(220, 38, 38, 0.08)',
    color: '#DC2626',
    borderColor: 'rgba(220, 38, 38, 0.22)',
    icon: <DeleteOutlineRoundedIcon sx={{ fontSize: '13px' }} />,
  },
  REORDERED: {
    label: 'Sắp xếp',
    bg: 'rgba(30, 58, 138, 0.08)',
    color: '#1E3A8A',
    borderColor: 'rgba(30, 58, 138, 0.2)',
    icon: <SwapVertRoundedIcon sx={{ fontSize: '13px' }} />,
  },
  DEFAULT: {
    label: 'Thay đổi',
    bg: 'rgba(71, 85, 105, 0.08)',
    color: '#475569',
    borderColor: 'rgba(71, 85, 105, 0.2)',
    icon: <HistoryRoundedIcon sx={{ fontSize: '13px' }} />,
  },
} as const;

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
  const t = useTranslations('plan');
  const {
    logs,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = usePlanActivityLogs({ tripId, enabled: open });

  const getActionConfig = (action: ActivityLogAction) => {
    return ACTION_CONFIGS[action] ?? ACTION_CONFIGS.DEFAULT;
  };

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={t('activityLog.title')}
      description={t('activityLog.subtitle')}
      icon={<HistoryRoundedIcon />}
      maxWidth="md"
      actions={
        <AppButton intent="secondary" onClick={onClose}>
          {t('activityLog.close')}
        </AppButton>
      }
    >
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1.5,
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
            px: 2,
            color: 'text.secondary',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
            }}
          >
            <HistoryRoundedIcon sx={{ fontSize: '28px', opacity: 0.7 }} />
          </Box>
          <Typography
            sx={{ fontWeight: 700, fontSize: '15px', color: 'text.primary' }}
          >
            {t('activityLog.emptyTitle')}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', maxWidth: 360, lineHeight: 1.5 }}
          >
            {t('activityLog.emptyDesc')}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            maxHeight: '60vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            pr: 0.5,
            bgcolor: 'transparent',
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'divider',
              borderRadius: '3px',
              '&:hover': { bgcolor: 'text.disabled' },
            },
          }}
        >
          {logs.map((log: PlanActivityLog) => {
            const actionCfg = getActionConfig(log.action);
            return (
              <Box
                key={log.id}
                sx={{
                  flexShrink: 0,
                  width: '100%',
                  boxSizing: 'border-box',
                  p: 2,
                  borderRadius: '16px',
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: 'primary.light',
                    bgcolor: 'action.hover',
                    boxShadow: 'none',
                  },
                }}
              >
                <Stack spacing={1.25}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      justifyContent: 'space-between',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 1,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.25}
                      sx={{ alignItems: 'center', minWidth: 0 }}
                    >
                      <Avatar
                        src={log.userAvatar ?? undefined}
                        sx={{
                          width: 34,
                          height: 34,
                          fontSize: '13px',
                          fontWeight: 700,
                          bgcolor: 'rgba(30, 58, 138, 0.08)',
                          color: 'primary.main',
                          border: '1px solid',
                          borderColor: 'rgba(30, 58, 138, 0.18)',
                          flexShrink: 0,
                        }}
                      >
                        {log.userName
                          ? log.userName.charAt(0).toUpperCase()
                          : 'U'}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontSize: '13.5px',
                            fontWeight: 700,
                            color: 'text.primary',
                            lineHeight: 1.3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {log.userName}
                        </Typography>
                        {log.userEmail && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontSize: '11.5px',
                              display: 'block',
                              lineHeight: 1.2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {log.userEmail}
                          </Typography>
                        )}
                      </Box>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        alignItems: 'center',
                        flexShrink: 0,
                        alignSelf: { xs: 'flex-start', sm: 'center' },
                      }}
                    >
                      <Chip
                        size="small"
                        icon={actionCfg.icon}
                        label={actionCfg.label}
                        sx={{
                          height: 24,
                          fontSize: '11px',
                          fontWeight: 700,
                          borderRadius: '8px',
                          bgcolor: actionCfg.bg,
                          color: actionCfg.color,
                          border: `1px solid ${actionCfg.borderColor}`,
                          '& .MuiChip-icon': {
                            color: 'inherit',
                            fontSize: '13px',
                          },
                        }}
                      />
                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ alignItems: 'center' }}
                      >
                        <AccessTimeRoundedIcon
                          sx={{ fontSize: '13px', color: 'text.disabled' }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '11.5px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatLogTime(log.createdAt)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      pl: { xs: 0, sm: 5.5 },
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '13.5px',
                        fontWeight: 600,
                        color: 'text.primary',
                        lineHeight: 1.4,
                      }}
                    >
                      {log.activityTitle}
                    </Typography>
                    {log.description && (
                      <Typography
                        sx={{
                          fontSize: '12.5px',
                          color: 'text.secondary',
                          lineHeight: 1.45,
                        }}
                      >
                        {log.description}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Box>
            );
          })}

          <AppInfiniteScrollTrigger
            hasMore={hasNextPage && !error}
            loading={isFetchingNextPage}
            onLoadMore={() => void fetchNextPage()}
          />
        </Box>
      )}
    </AppDialog>
  );
};

export default ActivityLogDialog;
