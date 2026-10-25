import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  base: "/",
  build: {
    cssMinify: false,
  },
  optimizeDeps: {
    noDiscovery: true,
    include: ["react", "react-dom/client", "react/jsx-runtime"],
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 8000,
    strictPort: false,
  },
  preview: {
    host: "0.0.0.0",
    port: 8000,
    strictPort: false,
  },
})
