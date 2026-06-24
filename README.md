# WeLiftTogether

App de fitness para parejas: rutinas, seguimiento de sesiones, fotos de progreso y estadísticas. Construida con React + Vite y empaquetada como app nativa Android/iOS con Capacitor.

## Stack

- **React 18** + **Vite 5**
- **Capacitor 6** — `@capacitor/app`, `@capacitor/haptics`, `@capacitor/filesystem`
- **Supabase** — base de datos (Postgres) y Storage para fotos

## Desarrollo local

```bash
npm install
npm run dev
```

Crea un archivo `.env.local` en la raíz con tus credenciales de Supabase:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON=tu-anon-key
```

Si no defines estas variables, la app usa unas credenciales de prueba embebidas como fallback — solo para desarrollo rápido, no usar en producción.

## Base de datos

El esquema completo (tablas `routines`, `workout_sessions`, `workout_photos`, políticas RLS y el bucket de Storage `gym-photos`) está en [`supabase/schema.sql`](./supabase/schema.sql). Ejecútalo una vez en el SQL Editor de tu proyecto Supabase antes de correr la app contra una base nueva.

## Build nativo (Android/iOS)

```bash
npm run build
npx cap sync android   # o: npx cap sync ios
npx cap open android   # abre Android Studio
```

`capacitor.config.ts` soporta live-reload contra tu servidor Vite local en desarrollo:

```bash
CAP_DEV_SERVER_URL=http://192.168.1.XXX:5173 npx cap run android
```

Sin esa variable, el build usa siempre el contenido empaquetado de `dist/` — nunca apunta a una máquina de desarrollo en producción.

## CI

`.github/workflows/android.yml` compila un APK de debug en cada push a `main` (artifact descargable desde la pestaña Actions). Para distribución real (Play Store o instalación firmada) falta configurar un keystore de release — ver sección de firma en `android/app/build.gradle`.

## Haptic feedback

`src/App.jsx` incluye un wrapper (`haptic`) sobre `@capacitor/haptics` con fallback a `navigator.vibrate` cuando el plugin nativo no está disponible (ej. en navegador). Se usa en navegación entre tabs, confirmar/completar ejercicios, acciones destructivas (borrar foto, sesión, ejercicio) y diálogos de confirmación.
