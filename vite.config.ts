import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    define: {
      'process.env': process.env,
    },
    plugins: [
      tsconfigPaths(),
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
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
      }),
    ],
    server: {
      port: 3000,

      proxy: {
        '^/brightid(/.*)?$': {
          target: 'https://recovery.brightid.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/brightid/, ''),
          secure: process.env.NODE_ENV !== 'development',
        },

        '^/auranode(/.*)?$': {
          target: 'https://aura-node.brightid.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/auranode/, ''),
          secure: process.env.NODE_ENV !== 'development',
        },
        '^/auranode-test(/.*)?$': {
          target: 'https://aura-test.brightid.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/auranode-test\//, ''),
          secure: process.env.NODE_ENV !== 'development',
          autoRewrite: true,
        },
      },
    },
  };
});
