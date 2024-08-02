/* eslint-disable no-undef */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { buildPlugin } from "vite-plugin-build";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    buildPlugin({
      libBuild: {
        buildOptions: {
          rollupOptions: {
            external: ["vue"],
            output: { globals: { vue: "Vue" } },
          },
          lib: {
            entry: path.resolve(__dirname, "src/main.js"),
            name: "tgTalker",
            fileName: (format) => `tgTalker.${format}.js`,
          },
        },
      },
    }),
  ],
});
