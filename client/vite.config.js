import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@heroicons/react/24/outline'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Group all icon-related packages together
            if (id.includes('@heroicons/react')) {
              return 'vendor-icons';
            }
            if (id.includes('react')) {
              return 'vendor-react';
            }
            return 'vendor'; // all other node_modules
          }
          // Group by feature
          if (id.includes('/components/dashboard/')) {
            return 'dashboard';
          }
          if (id.includes('/components/products/')) {
            return 'products';
          }
        },
      },
    },
  },
  server: {
    // Add server configuration to handle more concurrent requests
    maxConcurrentRequests: 500,
    fs: {
      strict: false
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
