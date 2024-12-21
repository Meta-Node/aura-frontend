// import react from '@vitejs/plugin-react';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    define: {
      'process.env': process.env,
    },
    plugins: [tsconfigPaths(), react()],
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
