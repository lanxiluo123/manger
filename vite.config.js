import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { viteStaticCopy } from 'vite-plugin-static-copy'
const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'))
const cesiumVersion = packageJson.dependencies.cesium || '1.133.1'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ]
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ]
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/cesium/Build/Cesium/Workers',
          dest: cesiumVersion
        },
        {
          src: 'node_modules/cesium/Build/Cesium/ThirdParty',
          dest: cesiumVersion
        },
        {
          src: 'node_modules/cesium/Build/Cesium/Assets',
          dest: cesiumVersion
        },
        {
          src: 'node_modules/cesium/Build/Cesium/Widgets',
          dest: cesiumVersion
        },
      ]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@apis': resolve(__dirname, 'src/apis'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@components': resolve(__dirname, 'src/components'),
      '@config': resolve(__dirname, 'src/config'),
      '@directive': resolve(__dirname, 'src/directive'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@routes': resolve(__dirname, 'src/routes'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@views': resolve(__dirname, 'src/views'),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          // @use "@styles/_element.scss" as *;
          @use "@styles/_mixins.scss" as *;
          @use "@styles/_variables.scss" as *;
           @use "@/styles/mixins.scss" as *;
        `,
      }
    }
  },
  build: {
    polyfillModulePreload: true,
    assetsDir: cesiumVersion,
    rollupOptions: {
      output: {
      }
    }
  },
  define: {
    CESIUM_BASE_URL: JSON.stringify(`/${cesiumVersion}`), // 取消注释这行
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console'] : [],
  },
  server: {
    port: 30001, // 设置自定义端口号
    host: '0.0.0.0', // 允许外部访问
    open: true, // 自动打开浏览器
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8092',
        changeOrigin: true,
      },
    },
  }
})