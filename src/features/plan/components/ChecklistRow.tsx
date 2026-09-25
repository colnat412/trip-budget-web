'use client';

import React from 'react';
import { Box, Checkbox, Chip, IconButton, Typography } from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import { useTranslations } from 'next-intl';

import type { PlanChecklist } from '../types';

export interface ChecklistRowProps {
  item: PlanChecklist;
  onToggle: (item: PlanChecklist) => void;
  onDelete: (item: PlanChecklist) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

const ChecklistRow = ({
  item,
  onToggle,
  onDelete,
  disabled = false,
  readOnly = false,
}: ChecklistRowProps) => {
  const tCat = useTranslations('plan.checklistCategories');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1,
        px: 1.5,
        borderRadius: '12px',
        bgcolor: item.isCompleted ? 'action.hover' : 'background.paper',
        border: 1,
        borderColor: item.isCompleted ? 'transparent' : 'divider',
        transition: 'all 0.15s ease',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          flex: 1,
          minWidth: 0,
        }}
      >
        <Checkbox
          checked={item.isCompleted}
          onChange={() => onToggle(item)}
          disabled={disabled || readOnly}
          icon={<RadioButtonUncheckedRoundedIcon fontSize="small" />}
          checkedIcon={
            <CheckCircleRoundedIcon fontSize="small" color="success" />
          }
          sx={{ p: 0.5 }}
        />

        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 500,
            color: item.isCompleted ? 'text.secondary' : 'text.primary',
            textDecoration: item.isCompleted ? 'line-through' : 'none',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.title}
        </Typography>

        <Chip
          label={tCat(item.category)}
          size="small"
          sx={{
            height: 20,
            fontSize: '10px',
            fontWeight: 600,
            borderRadius: '6px',
            bgcolor: 'action.selected',
            color: 'text.secondary',
            flexShrink: 0,
          }}
        />

        {item.assigneeName && (
          <Typography
            sx={{
              fontSize: '11px',
              color: 'text.secondary',
              bgcolor: 'action.hover',
              px: 1,
              py: 0.25,
              borderRadius: '6px',
              flexShrink: 0,
            }}
          >
            {item.assigneeName}
          </Typography>
        )}
      </Box>

      {!readOnly && (
        <IconButton
          size="small"
          onClick={() => onDelete(item)}
          disabled={disabled}
          sx={{
            color: 'text.disabled',
            p: 0.5,
            '&:hover': { color: 'error.main' },
          }}
        >
          <DeleteOutlineRoundedIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default ChecklistRow;
