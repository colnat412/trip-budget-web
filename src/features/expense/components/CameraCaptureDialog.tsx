'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import CameraswitchOutlinedIcon from '@mui/icons-material/CameraswitchOutlined';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import { useTranslations } from 'next-intl';
import { AppButton, AppDialog } from '@/base/components/ui';

export interface CameraCaptureDialogProps {
  open: boolean;
  onClose: () => void;
  onCapture: (blob: Blob) => void;
}

const CameraCaptureDialog = ({
  open,
  onClose,
  onCapture,
}: CameraCaptureDialogProps) => {
  const t = useTranslations('expense.camera');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>(
    'environment',
  );
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startStream = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(t('cameraError'));
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err: unknown) {
      console.error('Camera stream error:', err);
      setError(t('cameraError'));
    } finally {
      setIsLoading(false);
    }
  }, [facingMode, t]);

  useEffect(() => {
    let isMounted = true;

    if (!open || capturedImage) {
      stopStream();
      return;
    }

    const initCamera = async () => {
      await Promise.resolve();
      if (!isMounted) return;
      await startStream();
    };

    void initCamera();

    return () => {
      isMounted = false;
      stopStream();
    };
  }, [open, capturedImage, startStream, stopStream]);

  const handleSwitchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleTakePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setCapturedBlob(blob);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setCapturedImage(dataUrl);
        stopStream();
      },
      'image/jpeg',
      0.95,
    );
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setCapturedBlob(null);
  };

  const handleUsePhoto = () => {
    if (capturedBlob) {
      onCapture(capturedBlob);
      handleClose();
    }
  };

  const handleClose = () => {
    stopStream();
    setCapturedImage(null);
    setCapturedBlob(null);
    setError(null);
    onClose();
  };

  return (
    <AppDialog
      open={open}
      onClose={handleClose}
      title={t('dialogTitle')}
      description={t('dialogDesc')}
      icon={<CameraAltOutlinedIcon />}
      maxWidth="sm"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4 / 3',
            bgcolor: 'common.black',
            borderRadius: 2,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isLoading && (
            <CircularProgress
              size={40}
              sx={{ color: 'common.white', position: 'absolute' }}
            />
          )}

          {capturedImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={capturedImage}
              alt="Captured receipt preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 20,
                  border: '2px dashed rgba(255, 255, 255, 0.7)',
                  borderRadius: 2,
                  pointerEvents: 'none',
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.35)',
                }}
              />
            </>
          )}
        </Box>

        <Typography
          variant="caption"
          align="center"
          sx={{ color: 'text.secondary', display: 'block' }}
        >
          {t('guide')}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            pt: 1,
          }}
        >
          {capturedImage ? (
            <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
              <AppButton
                fullWidth
                intent="secondary"
                startIcon={<ReplayRoundedIcon />}
                onClick={handleRetake}
              >
                {t('retake')}
              </AppButton>
              <AppButton
                fullWidth
                intent="primary"
                startIcon={<CheckRoundedIcon />}
                onClick={handleUsePhoto}
              >
                {t('usePhoto')}
              </AppButton>
            </Stack>
          ) : (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
              }}
            >
              <Box sx={{ width: 44 }} />

              <Tooltip title={t('takePhoto')} arrow>
                <span>
                  <IconButton
                    disabled={isLoading || Boolean(error)}
                    onClick={handleTakePhoto}
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      boxShadow: 2,
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      '&.Mui-disabled': {
                        bgcolor: 'action.disabledBackground',
                        color: 'action.disabled',
                      },
                    }}
                  >
                    <CameraAltOutlinedIcon sx={{ fontSize: 32 }} />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title={t('switchCamera')} arrow>
                <span>
                  <IconButton
                    disabled={isLoading || Boolean(error)}
                    onClick={handleSwitchCamera}
                    sx={{
                      width: 44,
                      height: 44,
                      color: 'text.primary',
                      bgcolor: 'action.hover',
                      '&:hover': { bgcolor: 'action.selected' },
                    }}
                  >
                    <CameraswitchOutlinedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Box>
    </AppDialog>
  );
};

export default CameraCaptureDialog;
