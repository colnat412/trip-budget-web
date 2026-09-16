'use client';

import { useState } from 'react';
import { Stack, Typography, type SelectChangeEvent } from '@mui/material';
import { useTranslations } from 'next-intl';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';

import AppDialog from '@/base/components/ui/AppDialog';
import AppSelect, {
  type AppSelectOption,
} from '@/base/components/ui/AppSelect';
import AppButton from '@/base/components/ui/AppButton';
import type { TripMember, TripMemberRole } from '../../types/member.types';

interface EditMemberRoleDialogProps {
  open: boolean;
  onClose: () => void;
  member: TripMember | null;
  onSubmit: (role: TripMemberRole) => void;
  isSubmitting: boolean;
}

const EditMemberRoleDialog = ({
  open,
  onClose,
  member,
  onSubmit,
  isSubmitting,
}: EditMemberRoleDialogProps) => {
  const t = useTranslations('members');
  const [selectedRole, setSelectedRole] = useState<TripMemberRole>(
    member?.role === 'OWNER' ? 'EDITOR' : (member?.role ?? 'MEMBER'),
  );

  if (!member) return null;

  const roleOptions: AppSelectOption[] = [
    {
      value: 'EDITOR',
      label: t('roles.EDITOR'),
      icon: <EditRoundedIcon sx={{ fontSize: '18px', color: 'info.main' }} />,
    },
    {
      value: 'MEMBER',
      label: t('roles.MEMBER'),
      icon: (
        <GroupRoundedIcon sx={{ fontSize: '18px', color: 'success.main' }} />
      ),
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

  const handleSave = () => {
    onSubmit(selectedRole);
  };

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={t('actions.changeRole')}
      maxWidth="xs"
      actions={
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ justifyContent: 'flex-end', width: '100%' }}
        >
          <AppButton
            intent="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t('cancel')}
          </AppButton>
          <AppButton
            intent="primary"
            onClick={handleSave}
            loading={isSubmitting}
          >
            {t('sendInvite')}
          </AppButton>
        </Stack>
      }
    >
      <Stack spacing={2.5} sx={{ pt: 1 }}>
        <Stack spacing={0.5}>
          <Typography
            sx={{ fontWeight: 700, fontSize: '14px', color: 'text.primary' }}
          >
            {member.name} ({member.email})
          </Typography>
        </Stack>

        <AppSelect
          label={t('roleLabel')}
          value={selectedRole}
          options={roleOptions}
          onChange={(e: SelectChangeEvent<unknown>) =>
            setSelectedRole(e.target.value as TripMemberRole)
          }
          disabled={isSubmitting}
        />

        <Typography
          sx={{
            fontSize: '11px',
            color: 'text.secondary',
            fontStyle: 'italic',
          }}
        >
          * {t(`roleDescriptions.${selectedRole}`)}
        </Typography>
      </Stack>
    </AppDialog>
  );
};

export default EditMemberRoleDialog;
