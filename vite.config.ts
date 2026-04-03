import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "./",
  build: {
    rolldownOptions: {
      input: {
        content: "index.html",
        background: "extension/background.ts",
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "content") {
            return "index.js";
          }
          if (chunkInfo.name === "background") {
            return "background.js";
          }
          if (chunkInfo.name === "networking") { // TODO: Remove this if it ends up being unnecessary
            return "networking.js";
          }
          return "[name].js";
        },
      },
    },
  },
});
