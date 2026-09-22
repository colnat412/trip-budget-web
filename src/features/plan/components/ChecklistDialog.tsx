'use client';

import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import { useTranslations } from 'next-intl';

import { AppDialog, AppLinearProgress } from '@/base/components/ui';
import type { CreateChecklistPayload, PlanChecklist } from '../types';
import AddChecklistForm from './AddChecklistForm';
import ChecklistRow from './ChecklistRow';

export interface ChecklistDialogProps {
  open: boolean;
  onClose: () => void;
  checklists: PlanChecklist[];
  onAdd: (payload: CreateChecklistPayload) => void;
  onToggle: (item: PlanChecklist) => void;
  onDelete: (item: PlanChecklist) => void;
  isLoading?: boolean;
}

const ChecklistDialog = ({
  open,
  onClose,
  checklists,
  onAdd,
  onToggle,
  onDelete,
  isLoading = false,
}: ChecklistDialogProps) => {
  const t = useTranslations('plan');

  const total = checklists.length;
  const completed = checklists.filter((c) => c.isCompleted).length;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={t('checklist.title')}
      icon={<ChecklistRoundedIcon color="primary" />}
      maxWidth="md"
    >
      <Stack spacing={2.5}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'text.secondary',
              }}
            >
              {t('checklist.subtitle')}
            </Typography>
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color:
                  completed === total && total > 0
                    ? 'success.main'
                    : 'primary.main',
              }}
            >
              {t('checklist.completedCount', { completed, total })} (
              {progressPercent}%)
            </Typography>
          </Box>
          <AppLinearProgress value={progressPercent} />
        </Box>

        <AddChecklistForm onSubmit={onAdd} isLoading={isLoading} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 380,
            overflowY: 'auto',
            pr: 0.5,
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'action.hover',
              borderRadius: '999px',
            },
          }}
        >
          {checklists.length === 0 ? (
            <Box
              sx={{
                py: 4,
                textAlign: 'center',
                color: 'text.secondary',
                fontSize: '13px',
              }}
            >
              {t('checklist.emptyChecklist')}
            </Box>
          ) : (
            <Stack spacing={1}>
              {checklists.map((item) => (
                <ChecklistRow
                  key={item.id}
                  item={item}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  disabled={isLoading}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </AppDialog>
  );
};

export default ChecklistDialog;
