// ── Gym Session ID ─────────────────────────────────────────────────────────
// Identidad compartida para que dos personas entrenen "juntas" en la app SIN
// necesitar login. Por defecto cada dispositivo tiene su propio ID aleatorio,
// pero cualquiera puede crear un código de pareja o unirse al de otra persona
// para leer/escribir los mismos datos en Supabase.
//
// IMPORTANTE — esto NO es seguridad real: cualquiera con el código puede ver
// y escribir esos datos. Es una decisión consciente para evitar el login;
// funciona perfecto para una app de parejas en el gym.
//
// Uso: importar en App.jsx y pasar SYNC_ID como `session_id` en todas las
// queries de Supabase (ver schema-partner.sql para cómo añadir la columna).

const KEY           = 'wlt_gym_session_id';   // ID activo (propio o compartido)
const PARTNER_FLAG  = 'wlt_is_partner_code';  // 'true' si es código compartido

// Caracteres seguros — sin 0/O, 1/I/L para evitar confusión al dictarlo
const SAFE = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
function rnd(len = 4) {
  let s = '';
  for (let i = 0; i < len; i++) s += SAFE[Math.floor(Math.random() * SAFE.length)];
  return s;
}

function getOrCreate() {
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

/** ID que se usa AHORA para todas las queries. Calculado una vez al cargar. */
export const SYNC_ID = getOrCreate();

/** ¿Está este dispositivo usando un código de pareja (no el UUID propio)? */
export function isPartnerSession() {
  return localStorage.getItem(PARTNER_FLAG) === 'true';
}

/** Código visible actualmente (UUID o código tipo "GYM-7F3K"). */
export function currentSessionCode() {
  return localStorage.getItem(KEY) ?? SYNC_ID;
}

/**
 * Crea un nuevo código de pareja — convierte este dispositivo en el "host".
 * Los demás se unen con joinPartnerSession(code).
 * Returns: el código generado (ej. "GYM-7F3K").
 */
export function createPartnerCode() {
  const code = `GYM-${rnd()}`;
  localStorage.setItem(KEY, code);
  localStorage.setItem(PARTNER_FLAG, 'true');
  return code;
}

/**
 * Une este dispositivo a una sesión existente.
 * A partir del próximo reload, leerá/escribirá los datos del host.
 * Returns false si el código está vacío.
 */
export function joinPartnerSession(code) {
  const clean = code.trim().toUpperCase();
  if (!clean) return false;
  localStorage.setItem(KEY, clean);
  localStorage.setItem(PARTNER_FLAG, 'true');
  return true;
}

/**
 * Sale de la sesión compartida y vuelve a un UUID propio nuevo.
 * La data del partner queda intacta en Supabase.
 */
export function leavePartnerSession() {
  localStorage.removeItem(PARTNER_FLAG);
  localStorage.setItem(KEY, crypto.randomUUID());
}
