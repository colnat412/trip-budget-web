'use client';

import React from 'react';
import { Chip, type ChipProps } from '@mui/material';
import HotelRoundedIcon from '@mui/icons-material/HotelRounded';
import DirectionsSubwayRoundedIcon from '@mui/icons-material/DirectionsSubwayRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { useTranslations } from 'next-intl';

export type CategoryType =
  | 'ACCOMMODATION'
  | 'TRANSPORTATION'
  | 'FOOD_BEVERAGE'
  | 'SIGHTSEEING'
  | 'SHOPPING'
  | 'ENTERTAINMENT'
  | 'OTHER'
  | string;

export interface AppCategoryChipProps extends Omit<ChipProps, 'color'> {
  category: CategoryType;
}

export const CATEGORY_CONFIG: Record<
  string,
  { icon: React.ReactElement; bg: string; color: string }
> = {
  ACCOMMODATION: {
    icon: <HotelRoundedIcon sx={{ fontSize: 16 }} />,
    bg: '#ede7f6',
    color: '#512da8',
  },
  TRANSPORTATION: {
    icon: <DirectionsSubwayRoundedIcon sx={{ fontSize: 16 }} />,
    bg: '#e3f2fd',
    color: '#1565c0',
  },
  FOOD_BEVERAGE: {
    icon: <RestaurantRoundedIcon sx={{ fontSize: 16 }} />,
    bg: '#fff3e0',
    color: '#e65100',
  },
  SIGHTSEEING: {
    icon: <ConfirmationNumberRoundedIcon sx={{ fontSize: 16 }} />,
    bg: '#e0f2f1',
    color: '#00695c',
  },
  SHOPPING: {
    icon: <ShoppingBagRoundedIcon sx={{ fontSize: 16 }} />,
    bg: '#fce4ec',
    color: '#c2185b',
  },
  ENTERTAINMENT: {
    icon: <SportsEsportsRoundedIcon sx={{ fontSize: 16 }} />,
    bg: '#f3e5f5',
    color: '#7b1fa2',
  },
  OTHER: {
    icon: <MoreHorizRoundedIcon sx={{ fontSize: 16 }} />,
    bg: '#f5f5f5',
    color: '#616161',
  },
};

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
