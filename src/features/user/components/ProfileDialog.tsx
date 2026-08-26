'use client';

import {
  Box,
  Dialog,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { useTranslations } from 'next-intl';

import ProfileForm from './ProfileForm';
import type { SidebarUser } from '@/base/components/layout/sidebar/types';
import type { UserProfile } from '@/features/auth/types';

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
  user?: Partial<SidebarUser> | UserProfile;
}

export default function ProfileDialog({
  open,
  onClose,
  user,
}: ProfileDialogProps) {
  const t = useTranslations('profile');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: '20px',
            p: { xs: 1, sm: 2 },
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: { xs: 2, sm: 2.5 },
          pb: 1.5,
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <PersonOutlineRoundedIcon />
          </Box>
          <Box>
            <Typography
              component="h2"
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              {t('title')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {t('description')}
            </Typography>
          </Box>
        </Stack>

        <IconButton onClick={onClose} size="small">
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {open && <ProfileForm onClose={onClose} user={user} />}
    </Dialog>
  );
}
