import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium'
import autoImport from 'unplugin-auto-import/vite'
import { envDir, sourceDir } from './scripts/build'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir)
  // const isProd = mode === 'production'

  return {
    base: './',
    envDir,
    mode,
    plugins: [
      vue(),
      cesium(),
      autoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: './types/declaration-files/auto-import.d.ts',
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': sourceDir,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    server: {
      host: true,
      port: Number(env.VITE_APP_PORT),
      proxy: {
        '/openstreetmap': {
          target: 'https://a.tile.openstreetmap.org/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/openstreetmap/, ''),
          bypass(req, res, options) {
            if (options.rewrite && req.url) {
              const proxyUrl = new URL(
                options.rewrite(req.url),
                options.target as string,
              ).href
              res.setHeader('x-req-proxyUrl', proxyUrl)
              console.log('🚀 ~ bypass ~ proxyUrl:', proxyUrl) // 服务器打印访问代理地址
            }
          },
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          // drop_console: true, // 是否移除 console
          drop_debugger: true,
        },
      },
      chunkSizeWarningLimit: 600,
    },
  }
})
