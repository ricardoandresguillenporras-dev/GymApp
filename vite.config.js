import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    // Chunking limpio para Capacitor WebView
    rollupOptions: {
      output: {
        manualChunks: {
          supabase:  ["@supabase/supabase-js"],
          capacitor: [
            "@capacitor/core",
            "@capacitor/haptics",
            "@capacitor/filesystem",
            "@capacitor/app",
          ],
        },
      },
    },
  },
  // Exponer variables de entorno al cliente con prefijo VITE_
  // → crear un archivo .env.local con:
  //   VITE_SUPABASE_URL=https://tvfkmvattmlfruajwdibg.supabase.co
  //   VITE_SUPABASE_ANON=<tu anon key>
  envPrefix: "VITE_",
});
