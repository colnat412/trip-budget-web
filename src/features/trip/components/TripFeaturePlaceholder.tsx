import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import { Box, Stack, Typography } from '@mui/material';
import { getTranslations } from 'next-intl/server';

import { AppPageContainer } from '@/base/components/ui';

type TripFeatureKey = 'expenses' | 'scan' | 'settlement' | 'ai';

interface TripFeaturePlaceholderProps {
  feature: TripFeatureKey;
}

const TripFeaturePlaceholder = async ({
  feature,
}: TripFeaturePlaceholderProps) => {
  const t = await getTranslations('tripFeature');

  return (
    <AppPageContainer
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack
        spacing={2}
        sx={{
          width: '100%',
          maxWidth: 520,
          alignItems: 'center',
          p: { xs: 3, md: 5 },
          border: 1,
          borderColor: 'divider',
          borderRadius: '20px',
          bgcolor: 'background.paper',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '16px',
            bgcolor: 'action.selected',
            color: 'primary.main',
          }}
        >
          <ConstructionRoundedIcon sx={{ fontSize: '28px' }} />
        </Box>
        <Typography
          component="h1"
          sx={{ color: 'text.primary', fontSize: '24px', fontWeight: 800 }}
        >
          {t(`${feature}.title`)}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '15px' }}>
          {t('description')}
        </Typography>
      </Stack>
    </AppPageContainer>
  );
};

export default TripFeaturePlaceholder;
