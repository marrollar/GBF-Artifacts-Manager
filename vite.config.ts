import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  base: "./",
  resolve: {
    alias: {
      "@":path.resolve(__dirname, "./src")
    }
  },
  build: {
    minify: true,
    rolldownOptions: {
      input: {
        content: "./index.html",
        background: "./src/extension/background.ts",
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "content") {
            return "index.js";
          }
          if (chunkInfo.name === "background") {
            return "background.js";
          }
          return "[name].js";
        },
      },
    },
  },
});
