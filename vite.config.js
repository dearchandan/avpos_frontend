import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': false, // or true, depending on your needs
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development') // Define the NODE_ENV
  },
  plugins: [
      vue(),
      Components({
        dirs: ['./src/components','./src/layouts','./src/pages']
      }),
      AutoImport({
        imports:['vue']
      }),
      VueI18nPlugin({
        runtimeOnly: false,
        include: resolve(dirname(fileURLToPath(import.meta.url)), './src/lang/**'), // provide a path to the folder where you'll store translation data (see below)
      })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    
  },
  base: '/',
  build: {
    sourcemap: process.env.NODE_ENV === 'production' ? false : true, // Disable sourcemaps in production for better performance
    emptyOutDir: true,
    outDir: './build',
    rollupOptions: {
      output : {
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
        }
    }
  },
  server: {
    proxy: {
      '/api': process.env.VITE_API_BASE_URL, // Your Laravel backend URL
    },
  },
})
