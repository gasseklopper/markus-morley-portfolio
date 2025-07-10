import { netlifyEdgeAdapter } from "@builder.io/qwik-city/adapters/netlify-edge/vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import baseConfig from "../../vite.config";
import {VitePWA} from "vite-plugin-pwa";

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["src/entry.netlify-edge.tsx", "@qwik-city-plan"],
      },
      outDir: ".netlify/edge-functions/entry.netlify-edge",
    },
    base: '/', // <- hinzufügen!
    plugins: [netlifyEdgeAdapter(), VitePWA({                         // ✅ PWA Plugin hier einfügen
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      srcDir: 'src',
      filename: 'sw.ts',
      strategies: 'injectManifest',
      outDir: 'dist',
      includeAssets: ['favicon.png', 'apple-touch-icon.png', 'fonts/Barlow-Bold.woff',
        'fonts/Barlow-Medium.woff',
        'fonts/Barlow-Light.woff',
        'fonts/Barlow-SemiBold.woff'],
      workbox: {
        navigateFallback: '/404',
      },
      manifest: {
        name: 'Markus Morley Portfolio',
        short_name: 'Portfolio',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0f172a',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/maskable-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })],
  };
});
