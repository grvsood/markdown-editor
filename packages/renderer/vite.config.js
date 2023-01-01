/* eslint-env node */

import {chrome} from '../../.electron-vendors.cache.json';
import {join} from 'node:path';
import { builtinModules } from 'node:module';

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, '../..');

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: PROJECT_ROOT,
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
    },
  },
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      input: join(PACKAGE_ROOT, 'index.html'),
      external: [
        ...builtinModules.filter(m => m !== 'process' && m !== 'assert')
      ]
    },
    emptyOutDir: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
  },
  test: {
    environment: 'happy-dom',
  },
  plugins: [],
};

export default config;
