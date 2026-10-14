import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [tailwindcss(), react()],
  define: { "import.meta.env.VITE_STATIC_HUNT": JSON.stringify("1") },
  resolve: {
    tsconfigPaths: true,
  },
  publicDir: "public",
  build: {
    outDir: "dist-static",
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "index.html"),
    },
  },
});
