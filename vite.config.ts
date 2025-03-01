import replace from '@rollup/plugin-replace';
import { defineConfig } from 'vite';
import { ManifestOptions, VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import { reactRouter } from '@react-router/dev/vite';

const pwaConfig: Partial<VitePWAOptions> = {
  workbox: {
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
    clientsClaim: true,
    skipWaiting: true,
  },
  base: '/',
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
  manifest: {
    display: 'standalone',
    name: 'Aura',
    short_name: 'aura',
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
};

const replaceOptions = { __DATE__: new Date().toISOString() };

pwaConfig.srcDir = 'src';
pwaConfig.filename = 'prompt-sw.ts';
pwaConfig.strategies = 'injectManifest';
(pwaConfig.manifest as Partial<ManifestOptions>).name = 'Aura Service Worker';
(pwaConfig.manifest as Partial<ManifestOptions>).short_name = 'Aura';
pwaConfig.injectManifest = {
  minify: true,
  enableWorkboxModulesLogs: true,
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
};

// @ts-expect-error just ignore
replaceOptions.__RELOAD_SW__ = true;
// pwaConfig.selfDestroying = true;

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
      VitePWA(pwaConfig),
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
