import React, { Suspense } from 'react';
import { Loader } from '@mantine/core';

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader size="xl" variant="dots" />
  </div>
);

const SuspenseWrapper = ({ children }) => {
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
};

export default SuspenseWrapper; 