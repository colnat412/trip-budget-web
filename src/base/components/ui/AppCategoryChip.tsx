'use client';

import { Chip, type ChipProps } from '@mui/material';
import { useTranslations } from 'next-intl';
import { type TripCategory, CATEGORY_CONFIG } from '@/base/constants';

export type CategoryType = TripCategory | string;
export { CATEGORY_CONFIG };

export interface AppCategoryChipProps extends Omit<ChipProps, 'color'> {
  category: CategoryType;
}

type KnownCategory =
  | 'ACCOMMODATION'
  | 'TRANSPORTATION'
  | 'FOOD_BEVERAGE'
  | 'SIGHTSEEING'
  | 'SHOPPING'
  | 'ENTERTAINMENT'
  | 'OTHER';

const AppCategoryChip = ({
  category,
  size = 'small',
  sx,
  label: customLabel,
  ...chipProps
}: AppCategoryChipProps) => {
  const t = useTranslations('expense.categories');
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.OTHER;
  const label =
    customLabel ||
    (CATEGORY_CONFIG[category] ? t(category as KnownCategory) : t('OTHER'));

  return (
    <Chip
      {...chipProps}
      size={size}
      icon={config.icon}
      label={label}
      sx={{
        backgroundColor: config.bg,
        color: config.color,
        fontWeight: 600,
        fontSize: '12px',
        borderRadius: '6px',
        '& .MuiChip-icon': {
          color: config.color,
        },
        ...sx,
      }}
    />
  );
};

export default AppCategoryChip;
