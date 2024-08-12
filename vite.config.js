/* eslint-disable no-undef */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { buildPlugin } from "vite-plugin-build";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === "center",
        },
      },
    }),
    buildPlugin({
      libBuild: {
        buildOptions: {
          rollupOptions: {
            external: ["vue"],
            output: { globals: { vue: "Vue" }, exports: "named" },
          },
          lib: {
            entry: path.resolve(__dirname, "src/main.js"),
            name: "tgTalker",
            fileName: (format) => `tgTalker.${format}.js`,
          },
          sourcemap: true,
          minify: true,
        },
      },
    }),
  ],
});
