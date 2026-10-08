'use client';

import { useEffect, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';

export interface AppInfiniteScrollTriggerProps {
  hasMore: boolean;
  loading?: boolean;
  onLoadMore: () => void;
  // Load next page soon
  rootMargin?: string;
}

const AppInfiniteScrollTrigger = ({
  hasMore,
  loading = false,
  onLoadMore,
  rootMargin = '160px',
}: AppInfiniteScrollTriggerProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const onLoadMoreRef = useRef(onLoadMore);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  });

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMoreRef.current();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading, rootMargin]);

  if (!hasMore && !loading) return null;

  return (
    <Box
      ref={sentinelRef}
      sx={{
        flexShrink: 0,
        minHeight: '1px',
        display: 'flex',
        justifyContent: 'center',
        py: loading ? 1.5 : 0,
      }}
    >
      {loading && <CircularProgress size={22} />}
    </Box>
  );
};

export default AppInfiniteScrollTrigger;
