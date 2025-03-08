import replace from '@rollup/plugin-replace';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { reactRouter } from '@react-router/dev/vite';
import { remixPWA } from '@remix-pwa/dev';

const replaceOptions = { __DATE__: new Date().toISOString() };

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
      remixPWA(),
      !process.env.VITEST && reactRouter(),
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
