import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  // GitHub Pages 部署需要使用仓库名称作为 base 路径
  base: '/haobai/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    host: true
  },
  build: {
    // 确保资源使用相对路径
    assetsDir: 'assets',
    // 启用代码分割优化
    rollupOptions: {
      output: {
        // 手动代码分割，减少初始加载包大小
        manualChunks: {
          // Element Plus 单独打包
          'element-plus': ['element-plus', '@element-plus/icons-vue'],
          // 编辑器单独打包（较大）
          'editor': ['@wangeditor/editor', '@wangeditor/editor-for-vue'],
        },
        // 确保 chunk 文件使用相对路径引用
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const ext = info[info.length - 1]
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name || '')) {
            return 'assets/images/[name]-[hash][extname]'
          }
          if (/\.(css)$/i.test(assetInfo.name || '')) {
            return 'assets/css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    },
    // 压缩优化
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
