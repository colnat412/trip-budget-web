'use client';

import React from 'react';
import HotelRoundedIcon from '@mui/icons-material/HotelRounded';
import DirectionsSubwayRoundedIcon from '@mui/icons-material/DirectionsSubwayRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import type { AppSelectOption } from '@/base/components/ui';

export type TripCategory =
  | 'ACCOMMODATION'
  | 'TRANSPORTATION'
  | 'FOOD_BEVERAGE'
  | 'SIGHTSEEING'
  | 'SHOPPING'
  | 'ENTERTAINMENT'
  | 'OTHER';

export const TRIP_CATEGORIES: TripCategory[] = [
  'FOOD_BEVERAGE',
  'ACCOMMODATION',
  'TRANSPORTATION',
  'SIGHTSEEING',
  'SHOPPING',
  'ENTERTAINMENT',
  'OTHER',
];

export const CATEGORY_CONFIG: Record<
  TripCategory | string,
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

export const getCategorySelectOptions = (
  tCat: (key: TripCategory) => string,
): AppSelectOption[] => {
  return TRIP_CATEGORIES.map((cat) => {
    const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.OTHER;
    return {
      value: cat,
      label: tCat(cat),
      icon: React.cloneElement(
        config.icon as React.ReactElement<{ fontSize?: string; sx?: object }>,
        {
          fontSize: 'small',
          sx: { color: config.color },
        },
      ),
    };
  });
};
