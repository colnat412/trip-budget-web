'use client';

import { useState, type FormEvent } from 'react';
import { Box, Stack, Typography, type SelectChangeEvent } from '@mui/material';
import { useTranslations } from 'next-intl';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';

import AppTextField from '@/base/components/ui/AppTextField';
import AppSelect, {
  type AppSelectOption,
} from '@/base/components/ui/AppSelect';
import AppButton from '@/base/components/ui/AppButton';
import type {
  InviteMemberPayload,
  TripMemberRole,
} from '../../types/member.types';

interface InviteMemberFormProps {
  onSubmit: (payload: InviteMemberPayload) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const InviteMemberForm = ({
  onSubmit,
  onCancel,
  isSubmitting,
}: InviteMemberFormProps) => {
  const t = useTranslations('members');

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TripMemberRole>('MEMBER');
  const [error, setError] = useState('');

  const roleOptions: AppSelectOption[] = [
    {
      value: 'MEMBER',
      label: t('roles.MEMBER'),
      icon: (
        <GroupRoundedIcon sx={{ fontSize: '18px', color: 'success.main' }} />
      ),
    },
    {
      value: 'EDITOR',
      label: t('roles.EDITOR'),
      icon: <EditRoundedIcon sx={{ fontSize: '18px', color: 'info.main' }} />,
    },
    {
      value: 'VIEWER',
      label: t('roles.VIEWER'),
      icon: (
        <VisibilityRoundedIcon
          sx={{ fontSize: '18px', color: 'text.secondary' }}
        />
      ),
    },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError(t('emailRequired'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError(t('emailInvalid'));
      return;
    }

    setError('');
    onSubmit({ email: cleanEmail, role });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 2.5,
        borderRadius: '16px',
        bgcolor: 'action.hover',
        border: 1,
        borderColor: 'primary.light',
      }}
    >
      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography
            sx={{ fontWeight: 800, fontSize: '15px', color: 'text.primary' }}
          >
            {t('inviteTitle')}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
            {t('inviteSubtitle')}
          </Typography>
        </Stack>

        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
          <Box sx={{ flex: 1 }}>
            <AppTextField
              label={t('emailLabel')}
              placeholder={t('emailPlaceholder')}
              type="email"
              value={email}
              error={Boolean(error)}
              helperText={error}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              disabled={isSubmitting}
            />
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '160px' } }}>
            <AppSelect
              label={t('roleLabel')}
              value={role}
              options={roleOptions}
              onChange={(e: SelectChangeEvent<unknown>) =>
                setRole(e.target.value as TripMemberRole)
              }
              disabled={isSubmitting}
            />
          </Box>
        </Stack>

        <Typography
          sx={{
            fontSize: '11px',
            color: 'text.secondary',
            fontStyle: 'italic',
          }}
        >
          * {t(`roleDescriptions.${role}`)}
        </Typography>

        <Stack
          direction="row"
          spacing={1.5}
          sx={{ justifyContent: 'flex-end' }}
        >
          <AppButton
            intent="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
            sx={{ fontSize: '13px', px: 2 }}
          >
            {t('cancel')}
          </AppButton>
          <AppButton
            type="submit"
            intent="primary"
            loading={isSubmitting}
            startIcon={<PersonAddRoundedIcon />}
            sx={{ fontSize: '13px', px: 2.5 }}
          >
            {t('sendInvite')}
          </AppButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default InviteMemberForm;
