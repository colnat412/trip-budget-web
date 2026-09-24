'use client';

import React from 'react';
import { Box, Tooltip, IconButton, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import DirectionsCarFilledRoundedIcon from '@mui/icons-material/DirectionsCarFilledRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTranslations } from 'next-intl';

import { getGoogleMapsDirectionsUrl } from '../services/googleMapsService';
import { DistanceInfo, DurationInfo } from '../types';

export interface ActivityDistanceConnectorProps {
  originLocation: string;
  destinationLocation: string;
  distance?: DistanceInfo;
  duration?: DurationInfo;
  isEstimated?: boolean;
}

const ActivityDistanceConnector = ({
  originLocation,
  destinationLocation,
  distance,
  duration,
  isEstimated,
}: ActivityDistanceConnectorProps) => {
  const theme = useTheme();
  const t = useTranslations('plan.distance');

  const gmapsUrl = getGoogleMapsDirectionsUrl(
    originLocation,
    destinationLocation,
  );
  console.log('gmapsUrl', gmapsUrl);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1.5, sm: 2 },
        my: 0.5,
      }}
    >
      <Box
        sx={{
          width: { xs: '95px', sm: '110px' },
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            px: 1,
            py: 0.5,
            borderRadius: '10px',
            bgcolor:
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.primary.main, 0.12)
                : alpha(theme.palette.primary.main, 0.05),
            border: 1,
            borderColor: alpha(theme.palette.primary.main, 0.2),
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: alpha(theme.palette.primary.main, 0.45),
              bgcolor:
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.primary.main, 0.18)
                  : alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <DirectionsCarFilledRoundedIcon
              sx={{
                fontSize: '13px',
                color: 'primary.main',
              }}
            />
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: { xs: '11px', sm: '12px' },
                fontWeight: 700,
                color: 'text.primary',
                whiteSpace: 'nowrap',
                lineHeight: 1.2,
              }}
            >
              {distance?.text || '—'}
            </Typography>

            <Tooltip title={t('openInGoogleMaps')} arrow placement="top">
              <IconButton
                component="a"
                href={gmapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  p: 0,
                  ml: 0.25,
                  color: 'primary.main',
                  '&:hover': { color: 'primary.dark' },
                }}
              >
                <OpenInNewRoundedIcon sx={{ fontSize: '11px' }} />
              </IconButton>
            </Tooltip>
          </Box>

          {duration && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 0.25,
              }}
            >
              <Typography
                sx={{
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'text.secondary',
                  whiteSpace: 'nowrap',
                  lineHeight: 1.1,
                }}
              >
                {duration.text}
              </Typography>

              {isEstimated && (
                <Tooltip title={t('estimatedTooltip')} arrow placement="top">
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.warning.main, 0.15),
                      color: 'warning.main',
                      cursor: 'pointer',
                    }}
                  >
                    <InfoOutlinedIcon sx={{ fontSize: '10px' }} />
                  </Box>
                </Tooltip>
              )}
            </Box>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          width: '20px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '44px',
          alignSelf: 'stretch',
        }}
      >
        <Box
          sx={{
            width: '2px',
            height: '100%',
            bgcolor: 'divider',
            borderStyle: 'dashed',
            borderRadius: '2px',
          }}
        />
      </Box>

      <Box sx={{ flex: 1 }} />
    </Box>
  );
};

export default ActivityDistanceConnector;
