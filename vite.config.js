import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 443, // Ensures HMR works correctly on HTTPS
      path: "/ws", // Custom WebSocket path
    },
    allowedHosts: [
      '185.193.17.112',
      'frontend.conferencemeet.online'
    ],
    proxy: {
      "/socket": {
        target: "ws://localhost:8000",
        ws: true,
        changeOrigin: true,
      },
    },
  },
})
