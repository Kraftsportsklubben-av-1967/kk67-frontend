import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const pathResolve = (newPath: string) => path.resolve(__dirname, newPath)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  alias: {
    '@': pathResolve('/src'),
    '@components': pathResolve('/src/components'),
    '@pages': pathResolve('/src/pages'),
    '@assets': pathResolve('/assets/'),
    '@views': pathResolve('/views/'),
    '@utils': pathResolve('/utils/'),
    '@public': pathResolve('/public/'),
  },
})
