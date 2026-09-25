'use client';

import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';

import type { TripMember, TripMemberRole } from '../../types/member.types';
import TripMemberRow from './TripMemberRow';

interface TripMemberListProps {
  members: TripMember[];
  isLoading: boolean;
  isCurrentUserOwner: boolean;
  currentUserRole?: TripMemberRole;
  currentUserId?: string | number;
  onEditRole: (member: TripMember) => void;
  onRemove: (member: TripMember) => void;
  onLeave: (member: TripMember) => void;
  onAccept?: (member: TripMember) => void;
}

const TripMemberList = ({
  members,
  isLoading,
  isCurrentUserOwner,
  currentUserRole,
  currentUserId,
  onEditRole,
  onRemove,
  onLeave,
  onAccept,
}: TripMemberListProps) => {
  const t = useTranslations('members');

  if (isLoading) {
    return (
      <Stack spacing={1.5}>
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={68}
            sx={{ borderRadius: '16px' }}
          />
        ))}
      </Stack>
    );
  }

  if (members.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
          px: 2,
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
            mb: 2,
          }}
        >
          <PeopleOutlineRoundedIcon sx={{ fontSize: '32px' }} />
        </Box>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '16px',
            color: 'text.primary',
            mb: 0.5,
          }}
        >
          {t('empty.title')}
        </Typography>
        <Typography
          sx={{ fontSize: '13px', color: 'text.secondary', maxWidth: '340px' }}
        >
          {t('empty.desc')}
        </Typography>
      </Box>
    );
  }

  return (
    <Stack
      spacing={1.5}
      sx={{ maxHeight: '420px', overflowY: 'auto', pr: 0.5 }}
    >
      {members.map((member) => (
        <TripMemberRow
          key={member.id}
          member={member}
          isCurrentUserOwner={isCurrentUserOwner}
          currentUserRole={currentUserRole}
          currentUserId={currentUserId}
          onEditRole={onEditRole}
          onRemove={onRemove}
          onLeave={onLeave}
          onAccept={onAccept}
        />
      ))}
    </Stack>
  );
};

export default TripMemberList;
