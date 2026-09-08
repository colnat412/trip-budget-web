'use client';

import { type FormEvent, useState } from 'react';
import {
  Avatar,
  Box,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import { useTranslations } from 'next-intl';

import {
  AppButton,
  AppTextArea,
  AppTextField,
  AppToast,
} from '@/base/components/ui';
import { getUserInitials } from '@/base/utils';
import { useUserContext } from '../context/UserContext';
import type { SidebarUser } from '@/base/components/layout/sidebar/types';
import type { UserProfile } from '@/features/auth/types';

interface ProfileFormProps {
  onClose: () => void;
  user?: Partial<SidebarUser> | UserProfile;
}

export default function ProfileForm({ onClose, user }: ProfileFormProps) {
  const t = useTranslations('profile');
  const { user: currentUser } = useUserContext();

  const rawUser =
    (user as { data?: UserProfile })?.data ??
    user ??
    (currentUser as { data?: UserProfile })?.data ??
    currentUser;

  const currentEmail = rawUser?.email || 'admin@gmail.com';
  const initialName = rawUser?.name || 'Member';

  const [fullName, setFullName] = useState<string>(initialName);
  const [phone, setPhone] = useState<string>('');
  const [role, setRole] = useState<string>(rawUser?.role || 'Member');
  const [bio, setBio] = useState<string>('Bio.');
  const [fullNameError, setFullNameError] = useState<string | undefined>();
  const [toastOpen, setToastOpen] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fullName.trim()) {
      setFullNameError(t('fullNameRequired'));
      return;
    }

    setToastOpen(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <>
      <AppToast
        open={toastOpen}
        severity="success"
        message={t('saveSuccess')}
        onClose={() => setToastOpen(false)}
      />

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <DialogContent
          sx={{
            p: { xs: 2, sm: 2.5 },
            pt: '10px !important',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          <Stack
            direction="row"
            spacing={2.5}
            sx={{ alignItems: 'center', pb: 1 }}
          >
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={currentUser?.avatarUrl || '/avatar.jpg'}
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: 'primary.light',
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                {getUserInitials(fullName)}
              </Avatar>
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  bgcolor: 'primary.main',
                  color: 'common.white',
                  p: 0.75,
                  border: '2px solid white',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
                aria-label="Change avatar"
              >
                <CameraAltRoundedIcon sx={{ fontSize: '14px' }} />
              </IconButton>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '15px',
                  color: 'text.primary',
                }}
              >
                {fullName}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block' }}
              >
                {role}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  cursor: 'pointer',
                  mt: 0.5,
                  display: 'inline-block',
                }}
              >
                {t('changeAvatar')}
              </Typography>
            </Box>
          </Stack>

          <AppTextField
            label={t('fullName')}
            placeholder={t('fullNamePlaceholder')}
            required
            value={fullName}
            error={Boolean(fullNameError)}
            helperText={fullNameError}
            slotProps={{ inputLabel: { shrink: true } }}
            onChange={(e) => {
              setFullName(e.target.value);
              setFullNameError(undefined);
            }}
          />

          <AppTextField
            label={t('email')}
            value={currentEmail}
            disabled
            slotProps={{ inputLabel: { shrink: true } }}
            // helperText="Email tài khoản được đồng bộ từ Identity Service"
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <AppTextField
              label={t('phone')}
              placeholder={t('phonePlaceholder')}
              value={phone}
              slotProps={{ inputLabel: { shrink: true } }}
              onChange={(e) => setPhone(e.target.value)}
            />

            <AppTextField
              disabled
              label={t('role')}
              placeholder={t('rolePlaceholder')}
              value={role}
              slotProps={{ inputLabel: { shrink: true } }}
              onChange={(e) => setRole(e.target.value)}
            />
          </Stack>

          <AppTextArea
            label={t('bio')}
            placeholder={t('bioPlaceholder')}
            value={bio}
            minRows={3}
            maxRows={5}
            slotProps={{ inputLabel: { shrink: true } }}
            onChange={(e) => setBio(e.target.value)}
          />

          <Box
            sx={{
              p: 1.5,
              borderRadius: '10px',
              bgcolor: 'action.hover',
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontStyle: 'italic' }}
            >
              💡 {t('saveNote')}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1.5 }}>
          <AppButton intent="secondary" size="medium" onClick={onClose}>
            {t('cancel')}
          </AppButton>
          <AppButton type="submit" intent="primary" size="medium">
            {t('saveChanges')}
          </AppButton>
        </DialogActions>
      </Box>
    </>
  );
}
