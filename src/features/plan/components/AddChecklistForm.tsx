'use client';

import React, { useMemo, useState } from 'react';
import { Box } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useTranslations } from 'next-intl';

import {
  AppButton,
  AppSelect,
  AppTextField,
  type AppSelectOption,
} from '@/base/components/ui';
import type { ChecklistCategory, CreateChecklistPayload } from '../types';

export interface AddChecklistFormProps {
  onSubmit: (payload: CreateChecklistPayload) => void;
  isLoading?: boolean;
}

const AddChecklistForm = ({
  onSubmit,
  isLoading = false,
}: AddChecklistFormProps) => {
  const t = useTranslations('plan');
  const tCat = useTranslations('plan.checklistCategories');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ChecklistCategory>('DOCUMENTS');

  const categoryOptions: AppSelectOption[] = useMemo(
    () => [
      { value: 'DOCUMENTS', label: tCat('DOCUMENTS') },
      { value: 'CLOTHING', label: tCat('CLOTHING') },
      { value: 'ELECTRONICS', label: tCat('ELECTRONICS') },
      { value: 'MEDICAL', label: tCat('MEDICAL') },
      { value: 'TASKS', label: tCat('TASKS') },
      { value: 'OTHER', label: tCat('OTHER') },
    ],
    [tCat],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      category,
    });
    setTitle('');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 1.5,
        width: '100%',
      }}
    >
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 auto' }, minWidth: 0 }}>
        <AppTextField
          placeholder={t('checklist.inputPlaceholder')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          size="small"
          fullWidth
        />
      </Box>

      <Box sx={{ width: { xs: '100%', sm: 160 }, flexShrink: 0 }}>
        <AppSelect
          label={t('checklist.categorySelect')}
          value={category}
          onChange={(e) => setCategory(e.target.value as ChecklistCategory)}
          options={categoryOptions}
          disabled={isLoading}
          size="small"
          fullWidth
        />
      </Box>

      <AppButton
        type="submit"
        intent="primary"
        size="small"
        startIcon={<AddRoundedIcon />}
        disabled={isLoading || !title.trim()}
        sx={{ flexShrink: 0, height: 40 }}
      >
        {t('checklist.addBtn')}
      </AppButton>
    </Box>
  );
};

export default AddChecklistForm;
