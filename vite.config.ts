import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/nutriotrack/",

  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "logo.png"],
      workbox: {
        navigateFallbackDenylist: [/^\/oauth/],
        globPatterns: ["**/*.{js,css,html,ico,svg,woff2}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      manifest: {
        name: "NutrioTrack – Smart Nutrition Tracking",
        short_name: "NutrioTrack",
        description:
          "Track your meals, macros, and weight with AI-powered food analysis.",
        theme_color: "#22c55e",
        background_color: "#f0f2f5",
        display: "standalone",
        orientation: "portrait",
        start_url: "/nutriotrack/",
        icons: [
          {
            src: "/logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "@tanstack/react-query"],
  },

  optimizeDeps: {
    include: ["react", "react-dom", "@tanstack/react-query"],
  },
}));
