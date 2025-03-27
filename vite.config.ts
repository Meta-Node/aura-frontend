import replace from '@rollup/plugin-replace';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { ReactRouterVitePWA } from './plugins/sw';
import { reactRouter } from '@react-router/dev/vite';

const replaceOptions = { __DATE__: new Date().toISOString() };

const { ReactRouterVitePWAPlugin } = ReactRouterVitePWA();

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    define: {
      'process.env': process.env,
      APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
    plugins: [
      tsconfigPaths(),
      !process.env.VITEST && reactRouter(),
      ReactRouterVitePWAPlugin({
        srcDir: 'src',
        base: '/',
        filename: 'prompt-sw.ts',
        strategies: 'injectManifest',
        injectManifest: {
          globPatterns: ['**/*.{js,html,css,png,svg,ico}'],
          enableWorkboxModulesLogs: true,
          maximumFileSizeToCacheInBytes: 5242880,
        },
        devOptions: {
          enabled: true,
          type: 'module',
          suppressWarnings: true,
        },
        swOptions: {},
        workbox: {
          maximumFileSizeToCacheInBytes: 5242880,
          clientsClaim: true,
          skipWaiting: true,
        },
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          display: 'standalone',
          name: 'Aura Service Worker',
          short_name: 'Aura',
          description: 'Aura web app',
          theme_color: '#0c0a09',
          icons: [
            {
              src: '/assets/images/pwa/aura-image-256x256.png',
              sizes: '256x256',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/assets/images/pwa/aura-image-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/assets/images/pwa/aura-image-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/assets/images/pwa/aura-image-256x256.png',
              sizes: '256x256',
              type: 'image/png',
            },
          ],
        },
      }),
      replace(replaceOptions),
    ],
    server: {
      port: Number(process.env.PORT) || 3000, // Ensure port is a number

      proxy: {
        '^/brightid(/.*)?$': {
          target: 'https://recovery.brightid.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/brightid/, ''),
          secure: process.env.NODE_ENV?.toLowerCase() !== 'development',
        },

        '^/auranode(/.*)?$': {
          target: 'https://aura-node.brightid.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/auranode/, ''),
          secure: process.env.NODE_ENV?.toLowerCase() !== 'development',
        },

        '^/auranode-test(/.*)?$': {
          target: 'https://aura-test.brightid.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/auranode-test/, ''), // Fixed regex
          secure: process.env.NODE_ENV?.toLowerCase() !== 'development',
          // Removed autoRewrite for safety
        },
      },
    },
  };
});
