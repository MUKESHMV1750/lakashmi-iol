import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://e-commerce-backend-zxs4.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'recharts';
            }
            if (id.includes('lucide-react') || id.includes('framer-motion')) {
              return 'ui-icons';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});
