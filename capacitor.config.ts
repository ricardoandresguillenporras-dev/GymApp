import { CapacitorConfig } from "@capacitor/cli";

// En desarrollo (live-reload contra el servidor Vite local), exporta:
//   CAP_DEV_SERVER_URL=http://192.168.1.XXX:5173 npx cap run android
// En producción (build normal), no se define esta variable y Capacitor
// carga el contenido empaquetado de `webDir` — nunca apunta a tu máquina.
const devServerUrl = process.env.CAP_DEV_SERVER_URL;

const config: CapacitorConfig = {
  appId:    "com.welifttogether.app",
  appName:  "WeLiftTogether",
  webDir:   "dist",           // carpeta de salida de Vite
  ...(devServerUrl ? {
    server: {
      url:       devServerUrl,
      cleartext: true,
    },
  } : {}),
  plugins: {
    Filesystem: {
      // Android: permisos de almacenamiento se declaran en AndroidManifest.xml
    },
    Haptics: {
      // Sin configuración adicional requerida; funciona out-of-the-box
      // en iOS y Android con las APIs nativas.
    },
  },
  android: {
    // Asegura que el hardware back button de Android sea interceptado
    // por la app (requerido para el sentinel de historia).
    allowMixedContent: true,
  },
  ios: {
    // Safe-area insets ya manejados via CSS env() en el componente
    contentInset: "automatic",
  },
};

export default config;
