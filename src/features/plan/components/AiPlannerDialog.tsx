'use client';

import React, { useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Chip,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { useTranslations } from 'next-intl';

import {
  AppDialog,
  AppButton,
  AppTextField,
  AppNumberInput,
} from '@/base/components/ui';
import DestinationAutocomplete from '@/features/trip/components/DestinationAutocomplete';
import { useGenerateAiPlan } from '../hooks/usePlanMutation';

export interface AiPlannerDialogProps {
  open: boolean;
  onClose: () => void;
  tripId: string | number;
  initialDestination?: string;
  initialDays?: number;
  initialPeople?: number;
  currency?: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

const PREFERENCE_SUGGESTIONS = [
  '🍜 Ẩm thực đường phố',
  '☕ Cafe & check-in',
  '🌿 Nghỉ dưỡng, thư thái',
  '💰 Tối ưu ngân sách',
  '🏛️ Lịch sử & văn hóa',
  '🌊 Hoạt động ngoài trời',
];

const AiPlannerDialog = ({
  open,
  onClose,
  tripId,
  initialDestination = '',
  initialDays = 3,
  initialPeople = 2,
  currency = 'VND',
  onSuccess,
  onError,
}: AiPlannerDialogProps) => {
  const tDialog = useTranslations('plan.dialog');

  const [destinationInput, setDestinationInput] = useState<string | null>(null);
  const destination = destinationInput ?? initialDestination;
  const days = initialDays || 3;
  const [people, setPeople] = useState(initialPeople || 2);
  const [budget, setBudget] = useState<number | undefined>(5000000);
  const [preferences, setPreferences] = useState('');

  const { generateAiPlanAsync, isPending } = useGenerateAiPlan({
    tripId,
  });

  const handleClose = () => {
    if (isPending) return;
    setDestinationInput(null);
    onClose();
  };

  const handleAddSuggestion = (text: string) => {
    setPreferences((prev) => {
      const cleanText = text.replace(/^[^\s]+\s/, '');
      if (!prev) return cleanText;
      if (prev.includes(cleanText)) return prev;
      return `${prev}, ${cleanText}`;
    });
  };

  const handleGenerate = async () => {
    if (!destination.trim()) {
      onError?.(tDialog('aiDestRequired'));
      return;
    }
    if (days < 1 || days > 30) {
      onError?.(tDialog('aiDaysInvalid'));
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
      setDestinationInput(null);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : 'Error generating AI plan';
      onError?.(errMsg);
    }
  };

  return (
    <AppDialog
      open={open}
      onClose={handleClose}
      title={tDialog('aiPlannerTitle')}
      description={tDialog('aiPlannerDesc')}
      icon={<AutoAwesomeRoundedIcon />}
      maxWidth="sm"
      actions={
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ width: '100%', justifyContent: 'flex-end' }}
        >
          <AppButton
            intent="secondary"
            onClick={handleClose}
            disabled={isPending}
          >
            {tDialog('cancelBtn')}
          </AppButton>
          <AppButton
            intent="primary"
            onClick={handleGenerate}
            disabled={isPending || !destination.trim()}
            startIcon={
              isPending ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <AutoAwesomeRoundedIcon />
              )
            }
          >
            {isPending ? tDialog('aiGenerating') : tDialog('aiGenerateBtn')}
          </AppButton>
        </Stack>
      }
    >
      <Stack spacing={2.5} sx={{ pt: 1 }}>
        <DestinationAutocomplete
          value={destination}
          onChange={(val) => setDestinationInput(val)}
          disabled={isPending}
          required
          label={tDialog('aiDestinationLabel')}
          placeholder={tDialog('aiDestinationPlaceholder')}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <AppTextField
            label={tDialog('aiDaysLabel')}
            type="number"
            value={days}
            disabled
            helperText={tDialog('aiDaysDisabledHelper')}
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthOutlinedIcon
                      fontSize="small"
                      sx={{ color: 'text.secondary' }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />

          <AppTextField
            label={tDialog('aiPeopleLabel')}
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
                      sx={{ color: 'text.secondary' }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>

        <AppNumberInput
          label={tDialog('aiBudgetLabel')}
          value={budget}
          onValueChange={(val) => setBudget(val)}
          currencySuffix={currency}
          disabled={isPending}
          fullWidth
        />

        <Box>
          <Typography
            variant="caption"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              fontWeight: 600,
              color: 'text.secondary',
              mb: 1,
            }}
          >
            <LightbulbOutlinedIcon
              sx={{ fontSize: 16, color: 'warning.main' }}
            />
            {tDialog('aiStyleSuggestions')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {PREFERENCE_SUGGESTIONS.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                onClick={() => handleAddSuggestion(tag)}
                disabled={isPending}
                sx={{
                  cursor: 'pointer',
                  borderRadius: '12px',
                  fontWeight: 500,
                  bgcolor: 'action.hover',
                  '&:hover': {
                    bgcolor: 'action.selected',
                    color: 'primary.main',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        <AppTextField
          label={tDialog('aiPreferencesLabel')}
          placeholder={tDialog('aiPreferencesPlaceholder')}
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
              p: 2,
              borderRadius: '12px',
              bgcolor: 'primary.50',
              border: '1px dashed',
              borderColor: 'primary.300',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: 'primary.main' }}
            >
              {tDialog('aiGeneratingNotice')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {tDialog('aiGeneratingSubNotice')}
            </Typography>
          </Box>
        )}
      </Stack>
    </AppDialog>
  );
};

export default AiPlannerDialog;
