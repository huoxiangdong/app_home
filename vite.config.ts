import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import Unocss from "unocss/vite";
import { presetAttributify, presetUno } from "unocss";
import presetWind from '@unocss/preset-wind'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3060,
  },
  plugins: [
    vue(),
    Unocss({
      presets: [
        presetAttributify({}),
        presetUno(),
        presetWind(),
      ],
    }),
  ],
});
