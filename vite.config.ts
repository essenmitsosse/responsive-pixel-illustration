import { resolve } from "path";

import { defineConfig } from "vite";

// https://vitejs.dev/config/
const viteConfig = defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});

export default viteConfig;
