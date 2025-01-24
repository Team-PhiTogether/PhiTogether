import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@utils": path.resolve(__dirname, "src/utils"),
            "@components": path.resolve(__dirname, "src/components"),
            "@locales": path.resolve(__dirname, "src/locales"),
            "@renderers": path.resolve(__dirname, "src/utils/renderer/renderers"),
        },
    },
    build: {
        cssTarget: "chrome61",
        esbuild: {
            drop: ["console", "debugger"],
        },
    },
    preview: {
        port: 1443,
    },
});
