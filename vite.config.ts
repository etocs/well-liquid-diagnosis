import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// ---------------------------------------------------------------------------
// Dev-proxy support for cross-origin (CORS) API endpoints
// ---------------------------------------------------------------------------
// When the external API server doesn't send Access-Control-Allow-Origin headers
// you can route requests through Vite's local dev server so they share the same
// origin (http://localhost:3000).
//
// Steps:
//  1. Create a file named ".env.local" in the project root with the line:
//       VITE_API_PROXY_TARGET=http://localhost:8080
//     (replace the value with the actual API host:port)
//  2. Restart the dev server (npm run dev).
//  3. In the API config modal, enter the URL as a relative path, e.g.:
//       /api-proxy/data
//     Vite will forward that request to http://localhost:8080/data.
// ---------------------------------------------------------------------------

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_API_PROXY_TARGET
  const proxyPath = '/api-proxy'

  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      proxy: proxyTarget
        ? {
            [proxyPath]: {
              target: proxyTarget,
              changeOrigin: true,
              rewrite: (path: string) => path.replace(new RegExp(`^${proxyPath}`), ''),
            },
          }
        : {},
    },
  }
})
