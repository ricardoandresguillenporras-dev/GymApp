// ── Feedback Store ───────────────────────────────────────────────────────
// Local-only feedback log for the "?" panel in SideRail. Nothing here is
// sent to any backend — it's purely a personal notebook of things the user
// typed, so they can scroll back through what they've already reported.
//
// STORAGE:
//   Packaged app (Android/iOS): a real JSON file written via the Capacitor
//   Filesystem plugin, inside Directory.Data — the app's own PRIVATE
//   sandbox (Context.getFilesDir() on Android, the app's Documents
//   container on iOS). This is the same directory workout photos already
//   use (see PHOTO_DIR in App.jsx), so the storage behavior here is
//   proven and consistent with the rest of the app.
//   Browser preview (no Capacitor): falls back to localStorage so the
//   feature still works in `npm run dev`.
//
// UNINSTALL SAFETY — this is the part that matters most here:
//   Directory.Data is NEVER shared/external storage. It's the app's own
//   private data directory, and both Android and iOS delete it completely
//   the instant the app is uninstalled — no manual cleanup code is
//   possible or needed, and none is written here. This module
//   deliberately never touches Directory.External, Directory.ExternalStorage,
//   or any other shared/public location, which ARE the directories that
//   can survive an uninstall — using one of those by mistake would be the
//   actual way to leak data past a "clean" uninstall.
//
// MIGRATION: feedback was previously written straight to a bare
// localStorage key ("wlt_feedback_log") with no file backing at all. The
// very first successful read here migrates whatever was sitting in that
// key into the new file store, so nobody's already-submitted feedback
// quietly disappears when this ships.
// ─────────────────────────────────────────────────────────────────────────

const FEEDBACK_DIR  = "WeLiftTogether";
const FEEDBACK_FILE = `${FEEDBACK_DIR}/feedback.json`;
const LOCAL_KEY      = "wlt_feedback_log"; // legacy key AND the browser-preview store

let _capFsPromise = null;
const getCapacitorFS = () => {
  if (_capFsPromise) return _capFsPromise;
  _capFsPromise = import("@capacitor/filesystem")
    .then(mod => ({ Filesystem: mod.Filesystem, Directory: mod.Directory }))
    .catch(() => null);
  return _capFsPromise;
};

const ensureDir = async (Filesystem, Directory) => {
  try { await Filesystem.mkdir({ path: FEEDBACK_DIR, directory: Directory.Data, recursive: true }); }
  catch (e) { /* ya existe */ }
};

const readLocalFallback = () => {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
};

const writeLocalFallback = (list) => {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(list)); } catch (e) { /* almacenamiento no disponible */ }
};

/** Carga el historial completo, más reciente primero. */
export async function loadFeedback() {
  const cap = await getCapacitorFS();
  if (cap) {
    const { Filesystem, Directory } = cap;
    await ensureDir(Filesystem, Directory);
    try {
      const res = await Filesystem.readFile({ path: FEEDBACK_FILE, directory: Directory.Data, encoding: "utf8" });
      return JSON.parse(res.data);
    } catch (e) {
      // No existe el archivo todavía — migración única desde la clave
      // legacy de localStorage, si había algo ahí.
      const legacy = readLocalFallback();
      if (legacy.length) {
        try {
          await Filesystem.writeFile({ path: FEEDBACK_FILE, directory: Directory.Data, data: JSON.stringify(legacy), encoding: "utf8" });
        } catch (e2) { /* si falla, igual devolvemos lo legacy más abajo */ }
      }
      return legacy;
    }
  }
  return readLocalFallback();
}

/** Agrega una entrada y persiste. Devuelve la lista actualizada. */
export async function addFeedback(text) {
  const trimmed = (text || "").trim();
  if (!trimmed) return loadFeedback();
  const entry = { text: trimmed, date: new Date().toISOString() };

  const cap = await getCapacitorFS();
  if (cap) {
    const { Filesystem, Directory } = cap;
    await ensureDir(Filesystem, Directory);
    const list = await loadFeedback();
    list.unshift(entry);
    await Filesystem.writeFile({ path: FEEDBACK_FILE, directory: Directory.Data, data: JSON.stringify(list), encoding: "utf8" });
    return list;
  }

  const list = readLocalFallback();
  list.unshift(entry);
  writeLocalFallback(list);
  return list;
}

/** Borra todo el historial (no usado en la UI hoy, disponible si se necesita). */
export async function clearFeedback() {
  const cap = await getCapacitorFS();
  if (cap) {
    const { Filesystem, Directory } = cap;
    try { await Filesystem.deleteFile({ path: FEEDBACK_FILE, directory: Directory.Data }); }
    catch (e) { /* ya no existe */ }
  }
  try { localStorage.removeItem(LOCAL_KEY); } catch (e) { /* almacenamiento no disponible */ }
}
