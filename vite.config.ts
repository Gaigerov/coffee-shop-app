import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/coffee-shop-app/',
    server: {
        port: 3000,
    },
    build: {
        assetsInlineLimit: 4096
    }
})  
