import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Meu Cafezal",
        short_name: "Meu Cafezal",
        theme_color: "#14171f",
        icons: [
          {
            src: "/icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        screenshots: [
          {
            src: "/screenshots/screenshot1.png",
            sizes: "952x532",
            type: "image/png",
            form_factor: "wide",
          },
          {
            src: "/screenshots/screenshot2.png",
            sizes: "695x821",
            type: "image/png",
            form_factor: "narrow",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
