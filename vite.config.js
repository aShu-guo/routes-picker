import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import UnoCSS from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS()],
  base: '/routes-picker',
  envDir: './envs',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
});
