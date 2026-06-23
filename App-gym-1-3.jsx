import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  // Ground — Cotton Beige light base (80%)
  bg:      "#F9F3EA",       // Cotton Beige — main app ground
  s1:      "#F3EBE0",       // slightly deeper beige — cards on beige ground
  s2:      "#EDE3D6",       // warm beige surface — secondary cards, inputs
  s3:      "#DDD0C0",       // beige mid — borders, dividers
  s4:      "#C9B89E",       // beige active — active borders, handles
  // Primary action — Sorbet Orange (20%)
  accent:  "#FFA552",       // Sorbet Orange — CTA, active states, rings
  accentD: "#E8893A",       // orange pressed
  accentL: "#FFBF7A",       // orange hover / glow
  accentS: "#FFA5521A",     // orange wash
  // Energy accent — deeper orange (sparingly: START, progress rings, badges)
  pink:    "#FF8C2A",       // deep orange — primary energy signal
  pinkD:   "#E07020",       // deep orange pressed state
  pinkL:   "#FFBF7A",       // orange light / glow
  pinkS:   "#FF8C2A22",     // orange wash
  // Text — warm tones for beige world
  t1:      "#2D1F0F",       // near-black warm — primary text
  t2:      "#8B6A4A",       // muted warm brown — secondary text
  t3:      "#B8936A",       // light warm brown — labels, placeholders
  // Functional
  purple:  "#FFA552",       // map old purple → orange
  purpleS: "#FFA55218",
  success: "#6DB87A",       // warm green success
  warn:    "#FFA552",       // orange warning
  info:    "#FFBF7A",       // light orange info
  bear:    "#FFA552",       // map old bear → orange
  bearD:   "#E8893A",
  bearL:   "#FFBF7A",
};

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_DISPLAY = "'Barlow Condensed', 'Inter', sans-serif";
const FONT_SERIF = "'Playfair Display', 'Georgia', serif";

const useGlobalStyles = () => {
  useEffect(() => {
    const id = "wlt-pink";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Barlow+Condensed:wght@600;700;800;900&family=Playfair+Display:wght@400;700;900&display=swap');
      *, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; -webkit-font-smoothing: antialiased; }
      html, body, #root { height: 100%; margin: 0; padding: 0; overflow: hidden; }
      @keyframes fadeUp { from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)} }
      @keyframes fadeIn { from{opacity:0}to{opacity:1} }
      @keyframes slideUp { from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)} }
      @keyframes slideInR { from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)} }
      @keyframes heartBeat { 0%,100%{transform:scale(1)} 14%{transform:scale(1.3)} 28%{transform:scale(1)} 42%{transform:scale(1.3)} 70%{transform:scale(1)} }
      @keyframes ripple { 0%{transform:scale(0.8);opacity:0.8} 100%{transform:scale(2.4);opacity:0} }
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      @keyframes checkDraw { from{stroke-dashoffset:40} to{stroke-dashoffset:0} }
      @keyframes glowRing { 0%,100%{box-shadow:0 0 0 0 rgba(255,165,82,0.35)} 50%{box-shadow:0 0 0 14px rgba(255,165,82,0)} }
      @keyframes countdownPop { 0%{transform:scale(1.4);opacity:0} 30%{opacity:1} 100%{transform:scale(1);opacity:1} }
      @keyframes slideDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
      @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(-10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
      @keyframes spin { to{transform:rotate(360deg)} }
      @keyframes confirmPop { 0%{transform:scale(1)} 40%{transform:scale(1.08)} 100%{transform:scale(1)} }
      .anim-confirmPop { animation: confirmPop 0.3s cubic-bezier(.34,1.56,.64,1) both; }
      .anim-fadeUp  { animation: fadeUp  0.4s cubic-bezier(.22,1,.36,1) both; }
      .anim-fadeIn  { animation: fadeIn  0.25s ease both; }
      .anim-slideR  { animation: slideInR 0.35s cubic-bezier(.22,1,.36,1) both; }
      .anim-slideUp { animation: slideUp  0.38s cubic-bezier(.22,1,.36,1) both; }
      .anim-slideDown { animation: slideDown 0.3s cubic-bezier(.22,1,.36,1) both; }
      .pressable { transition: transform 0.13s cubic-bezier(.34,1.56,.64,1), opacity 0.12s ease; cursor: pointer; -webkit-user-select: none; user-select: none; }
      .pressable:active { transform: scale(0.93); opacity: 0.88; }
      ::-webkit-scrollbar { display: none; }
      * { scrollbar-width: none; }
      input:focus { outline: 1.5px solid #FFA552; outline-offset: 1px; border-color: #FFA552 !important; }
    `;
    document.head.appendChild(s);
  }, []);
};

/* ── PRIMITIVES ── */
const Label = ({ children, style = {} }) => (
  <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: "0.08em", textTransform: "uppercase", ...style }}>{children}</div>
);
const Chip = ({ children, color = C.accent, bg, style = {} }) => (
  <div style={{ display: "inline-flex", alignItems: "center", background: bg || `${color}18`, color, borderRadius:0, padding: "3px 10px", fontSize: 11, fontWeight: 700, fontFamily: FONT, ...style }}>{children}</div>
);
const Ring = ({ pct = 0, size = 44, sw = 3.5, color = C.accent, bg = C.s3, children }) => {
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={sw} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={`${circ*pct} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: "stroke-dasharray 0.6s cubic-bezier(.22,1,.36,1)" }} />
      {children && (
        <foreignObject x="0" y="0" width={size} height={size}>
          <div style={{ width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT }}>{children}</div>
        </foreignObject>
      )}
    </svg>
  );
};

/* ── TOAST ── */
const Toast = ({ message, show }) => (
  <div style={{
    position:"fixed", top:72, left:"50%",
    transform:"translateX(-50%)",
    background:C.accent, color:"#fff",
    borderRadius:0, padding:"9px 20px",
    fontSize:13, fontWeight:700,
    zIndex:500, pointerEvents:"none",
    boxShadow:`0 8px 24px ${C.accent}50`,
    opacity: show ? 1 : 0,
    transition:"opacity 0.25s ease",
    whiteSpace:"nowrap",
    fontFamily: FONT,
  }}>{message}</div>
);

/* ── FLORAL ── */
const FloralBranch = ({ side="left", style={} }) => (
  <svg width="90" height="160" viewBox="0 0 90 160" style={{ opacity:0.2, ...style }} fill="none">
    {side==="left" ? (
      <>
        <path d="M45 155 Q30 120 20 90 Q10 60 25 30" stroke="#FFA552" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="18" cy="45" rx="10" ry="6" fill="#FFA552" transform="rotate(-30 18 45)" />
        <ellipse cx="12" cy="68" rx="10" ry="6" fill="#FFBF7A" transform="rotate(-45 12 68)" />
        <ellipse cx="22" cy="92" rx="9" ry="5" fill="#FFA552" transform="rotate(-20 22 92)" />
        <ellipse cx="35" cy="115" rx="8" ry="5" fill="#FFBF7A" transform="rotate(10 35 115)" />
        <circle cx="16" cy="34" r="5" fill="#FFA552" opacity="0.6" />
      </>
    ) : (
      <>
        <path d="M45 155 Q60 120 70 90 Q80 60 65 30" stroke="#FFA552" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="72" cy="45" rx="10" ry="6" fill="#FFA552" transform="rotate(30 72 45)" />
        <ellipse cx="78" cy="68" rx="10" ry="6" fill="#FFBF7A" transform="rotate(45 78 68)" />
        <ellipse cx="68" cy="92" rx="9" ry="5" fill="#FFA552" transform="rotate(20 68 92)" />
        <ellipse cx="55" cy="115" rx="8" ry="5" fill="#FFBF7A" transform="rotate(-10 55 115)" />
        <circle cx="74" cy="34" r="5" fill="#FFA552" opacity="0.6" />
      </>
    )}
  </svg>
);

/* ── PROFILE AVATAR ── */
const ProfileAvatar = ({ size=72, showGlow=false, photoURL, onPickPhoto, uploading=false }) => {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) onPickPhoto?.(file);
  };

  return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:10 }}>
      {/* Outer wrapper — position:relative so input overlay works */}
      <div style={{ width:size, height:size, position:"relative", flexShrink:0 }}>
        {showGlow && (
          <>
            <div style={{ position:"absolute",inset:-8,borderRadius:0,background:`radial-gradient(circle,${C.accent}28 0%,transparent 70%)`,animation:"glowRing 2.5s ease-in-out infinite",pointerEvents:"none" }} />
            <div style={{ position:"absolute",inset:-4,borderRadius:0,border:`1.5px solid ${C.accent}35`,animation:"ripple 2.5s ease-out infinite",pointerEvents:"none" }} />
          </>
        )}
        {/* Avatar circle */}
        <div style={{ width:size,height:size,borderRadius:0,overflow:"hidden",background:C.pinkL,border:`2px solid ${C.accent}50`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",boxShadow:`0 4px 20px ${C.accent}25` }}>
          {photoURL ? (
            <img src={photoURL} alt="Foto de perfil" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
          ) : (
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4,opacity:0.65 }}>
              <svg width={size*0.34} height={size*0.34} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke={C.accent} strokeWidth="1.8"/>
                <path d="M4 20C4 16.686 7.582 14 12 14C16.418 14 20 16.686 20 20" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
          )}
          {uploading && (
            <div style={{ position:"absolute",inset:0,background:"rgba(255,255,255,0.75)",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <div style={{ width:22,height:22,borderRadius:0,border:`2.5px solid ${C.accent}40`,borderTopColor:C.accent,animation:"spin 0.7s linear infinite" }}/>
            </div>
          )}
        </div>

        {/* Camera badge — decorative only */}
        <div style={{ position:"absolute",bottom:1,right:1,width:size*0.3,height:size*0.3,minWidth:24,minHeight:24,borderRadius:0,background:C.accent,border:`2px solid ${C.s1}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 2px 8px ${C.accent}50`,pointerEvents:"none",zIndex:1 }}>
          <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="13" r="3.5" stroke="#fff" strokeWidth="2.2"/>
          </svg>
        </div>

        {/* Native file input — overlays the entire avatar, opacity:0 but fully interactive */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{
            position:"absolute", inset:0,
            width:"100%", height:"100%",
            opacity:0, cursor:"pointer",
            zIndex:2, borderRadius:0,
          }}
        />
      </div>

      <div style={{ fontSize:10,fontWeight:600,color:C.t3,letterSpacing:"0.05em",textTransform:"uppercase",pointerEvents:"none" }}>
        {photoURL ? "Cambiar foto" : "Subir foto"}
      </div>
    </div>
  );
};

/* ── TAB BAR ── */
const TABS = [
  { id:"home", label:"Inicio", icon:(a)=>(
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" fill={a?C.accent:"none"} stroke={a?C.accent:C.t3} strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  )},
  { id:"routines", label:"Rutinas", icon:(a)=>(
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="2" fill={a?C.accent:"none"} stroke={a?C.accent:C.t3} strokeWidth="1.8"/>
      <rect x="14" y="3" width="7" height="7" rx="2" fill={a?C.accent:"none"} stroke={a?C.accent:C.t3} strokeWidth="1.8"/>
      <rect x="3" y="14" width="7" height="7" rx="2" fill={a?C.accent:"none"} stroke={a?C.accent:C.t3} strokeWidth="1.8"/>
      <rect x="14" y="14" width="7" height="7" rx="2" fill="none" stroke={C.t3} strokeWidth="1.8" strokeDasharray={a?"0":"3 3"}/>
    </svg>
  )},
  { id:"stats", label:"Stats", icon:(a)=>(
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="13" width="4" height="8" rx="1.5" fill={a?C.accent:C.t3} opacity={a?1:0.5}/>
      <rect x="10" y="8" width="4" height="13" rx="1.5" fill={a?C.accent:C.t3} opacity={a?1:0.5}/>
      <rect x="17" y="3" width="4" height="18" rx="1.5" fill={a?C.accent:C.t3} opacity={a?1:0.5}/>
    </svg>
  )},
  /* { id:"profile", label:"Perfil", icon:(a)=>(
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" fill={a?C.accent:"none"} stroke={a?C.accent:C.t3} strokeWidth="1.8"/>
      <path d="M4 20C4 16.686 7.582 14 12 14C16.418 14 20 16.686 20 20" stroke={a?C.accent:C.t3} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )}, */
];

const TabBar = ({ active, onTab }) => (
  <div style={{
    display:"flex",alignItems:"center",height:62,
    background:"rgba(249,243,234,0.88)",
    backdropFilter:"blur(24px) saturate(180%)",
    WebkitBackdropFilter:"blur(24px) saturate(180%)",
    borderTop:"0.5px solid rgba(184,147,106,0.25)",
    flexShrink:0,
    paddingBottom:"env(safe-area-inset-bottom,0px)",
    boxShadow:"0 -1px 0 rgba(184,147,106,0.12)",
  }}>
    {TABS.map(t => {
      const isActive = active===t.id;
      return (
        <button key={t.id} className="pressable" onClick={()=>onTab(t.id)}
          style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,position:"relative",background:"none",border:"none",padding:"10px 0",cursor:"pointer" }}>
          {/* Icon — orange tint when active, muted when not */}
          <div style={{ opacity: isActive ? 1 : 0.45, transition:"opacity 0.2s" }}>
            {t.icon(isActive)}
          </div>
          {/* Orange dot indicator */}
          <div style={{
            width: isActive ? 4 : 0,
            height: 4,
            borderRadius:0,
            background:C.accent,
            transition:"width 0.25s cubic-bezier(.34,1.56,.64,1)",
            boxShadow: isActive ? `0 0 6px ${C.accent}80` : "none",
          }}/>
        </button>
      );
    })}
  </div>
);

/* ── DEFAULT ROUTINES (basadas en gym.pdf — pesos de Ricardo, nota con peso de Lin) ── */
const DEFAULT_ROUTINES = [
  {
    id:1, name:"Día de Piernas", sub:"Cuádriceps · Isquios · Glúteos · Gemelos",
    emoji:"LEGS", color:C.accent, dark:C.accentD, duration:50, difficulty:3,
    exercises:[
      { name:"Legcurl",               machine:10, sets:3, reps:12, weight:45, rest:75, muscle:"Isquios"    },
      { name:"Extensión de piernas",   machine:2,  sets:3, reps:12, weight:59, rest:75, muscle:"Cuádriceps" },
      { name:"Hip abductor",          machine:3,  sets:3, reps:12, weight:77, rest:60, muscle:"Glúteos"    },
      { name:"Abductor",              machine:4,  sets:3, reps:12, weight:77, rest:60, muscle:"Glúteos"    },
      { name:"Leg press",             machine:1,  sets:3, reps:12, weight:90, rest:90, muscle:"Cuádriceps" },
      { name:"Sentadilla Asistida",   machine:0,  sets:3, reps:12, weight:20, rest:90, muscle:"Piernas"    },
      { name:"Pantorrilla",           machine:0,  sets:3, reps:12, weight:20, rest:45, muscle:"Gemelos"    },
    ],
  },
  {
    id:2, name:"Día de Pecho", sub:"Pecho · Deltoides · Core",
    emoji:"CHEST", color:C.pink, dark:C.pinkD, duration:45, difficulty:3,
    exercises:[
      { name:"Chest press",           machine:20, sets:3, reps:12, weight:45, rest:90, muscle:"Pecho"          },
      { name:"Pec Fly rear delta",    machine:26, sets:3, reps:12, weight:36, rest:60, muscle:"Pecho/Deltoides" },
      { name:"Tronco",                machine:30, sets:3, reps:12, weight:63, rest:60, muscle:"Core"           },
      { name:"Tronco",                machine:34, sets:3, reps:12, weight:54, rest:60, muscle:"Core"           },
      { name:"Abs",                   machine:40, sets:3, reps:12, weight:81, rest:45, muscle:"Abdominales"    },
      { name:"Lumbar",                machine:44, sets:3, reps:12, weight:77, rest:45, muscle:"Lumbar"         },
    ],
  },
  {
    id:3, name:"Día de Brazos", sub:"Brazos · Peso libre",
    emoji:"ARMS", color:C.accentL, dark:C.accent, duration:25, difficulty:2,
    exercises:[
      { name:"Brazos",                machine:52, sets:3, reps:12, weight:72, rest:60, muscle:"Brazos" },
      { name:"Brazos Peso Libre",     machine:0,  sets:3, reps:12, weight:20, rest:60, muscle:"Brazos" },
    ],
  },
];

const STATS_WEEK = [18, 26, 14, 32, 28, 0, 0];
const DAYS = ["L","M","X","J","V","S","D"];

/* ── PHOTO DATA ── */
const makePhoto = (id,label,date,who,gradA,gradB,emoji,dataURL=null) => ({id,label,date,who,gradA,gradB,emoji,dataURL});

/* ── ALMACENAMIENTO DE FOTOS (carpeta etiquetada en el dispositivo) ──
   Usa el plugin Filesystem de Capacitor cuando la app corre empacada
   (Android/iOS), guardando cada imagen como archivo real dentro de una
   carpeta dedicada de la app (Directory.Data/WeLiftTogether/fotos).
   Si Capacitor no está disponible (vista previa en navegador), recurre
   a localStorage para que el flujo siga funcionando sin romperse. */
const PHOTO_DIR = "WeLiftTogether/fotos";
const MANIFEST_PATH = `${PHOTO_DIR}/manifest.json`;
const LOCAL_FALLBACK_KEY = "weLiftTogether_photos";

let _capFsPromise = null;
const getCapacitorFS = () => {
  if (_capFsPromise) return _capFsPromise;
  _capFsPromise = import("@capacitor/filesystem")
    .then(mod => ({ Filesystem: mod.Filesystem, Directory: mod.Directory }))
    .catch(() => null);
  return _capFsPromise;
};

const ensurePhotoDir = async (Filesystem, Directory) => {
  try { await Filesystem.mkdir({ path: PHOTO_DIR, directory: Directory.Data, recursive: true }); }
  catch (e) { /* ya existe */ }
};

const readManifest = async (Filesystem, Directory) => {
  try {
    const res = await Filesystem.readFile({ path: MANIFEST_PATH, directory: Directory.Data, encoding: "utf8" });
    return JSON.parse(res.data);
  } catch (e) { return []; }
};

const writeManifest = async (Filesystem, Directory, list) => {
  await Filesystem.writeFile({ path: MANIFEST_PATH, directory: Directory.Data, data: JSON.stringify(list), encoding: "utf8" });
};

const loadStoredPhotos = async () => {
  const cap = await getCapacitorFS();
  if (cap) {
    const { Filesystem, Directory } = cap;
    await ensurePhotoDir(Filesystem, Directory);
    const manifest = await readManifest(Filesystem, Directory);
    return Promise.all(manifest.map(async (p) => {
      try {
        const file = await Filesystem.readFile({ path: `${PHOTO_DIR}/${p.id}.jpg`, directory: Directory.Data, encoding: "base64" });
        return { ...p, dataURL: `data:image/jpeg;base64,${file.data}` };
      } catch (e) { return p; }
    }));
  }
  try {
    const raw = localStorage.getItem(LOCAL_FALLBACK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
};

const persistNewPhoto = async (photo) => {
  const cap = await getCapacitorFS();
  if (cap) {
    const { Filesystem, Directory } = cap;
    await ensurePhotoDir(Filesystem, Directory);
    const base64 = (photo.dataURL || "").split(",")[1] || "";
    await Filesystem.writeFile({ path: `${PHOTO_DIR}/${photo.id}.jpg`, directory: Directory.Data, data: base64 });
    const manifest = await readManifest(Filesystem, Directory);
    const { dataURL, ...meta } = photo;
    manifest.unshift(meta);
    await writeManifest(Filesystem, Directory, manifest);
    return;
  }
  try {
    const raw = localStorage.getItem(LOCAL_FALLBACK_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(photo);
    localStorage.setItem(LOCAL_FALLBACK_KEY, JSON.stringify(list));
  } catch (e) { /* almacenamiento no disponible */ }
};

const deleteStoredPhoto = async (id) => {
  const cap = await getCapacitorFS();
  if (cap) {
    const { Filesystem, Directory } = cap;
    try { await Filesystem.deleteFile({ path: `${PHOTO_DIR}/${id}.jpg`, directory: Directory.Data }); }
    catch (e) { /* ya no existe */ }
    const manifest = await readManifest(Filesystem, Directory);
    await writeManifest(Filesystem, Directory, manifest.filter(p => p.id !== id));
    return;
  }
  try {
    const raw = localStorage.getItem(LOCAL_FALLBACK_KEY);
    const list = raw ? JSON.parse(raw) : [];
    localStorage.setItem(LOCAL_FALLBACK_KEY, JSON.stringify(list.filter(p => p.id !== id)));
  } catch (e) { /* almacenamiento no disponible */ }
};

/* ── FOTO DE PERFIL — almacenada via window.storage del artefacto ── */
const PROFILE_STORAGE_KEY = "wlt_profile_photo";

const loadProfilePhoto = async () => {
  try {
    const result = await window.storage.get(PROFILE_STORAGE_KEY);
    return result ? result.value : null;
  } catch (e) {
    try { return localStorage.getItem(PROFILE_STORAGE_KEY) || null; } catch { return null; }
  }
};

const saveProfilePhoto = async (dataURL) => {
  try {
    await window.storage.set(PROFILE_STORAGE_KEY, dataURL);
  } catch (e) {
    try { localStorage.setItem(PROFILE_STORAGE_KEY, dataURL); } catch { /* noop */ }
  }
};

/* Lee un File y devuelve un dataURL cuadrado en JPEG de 400×400 */
const fileToSquareDataURL = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = () => {
    const img = new Image();
    img.onerror = reject;
    img.onload = () => {
      const TARGET = 400;
      const srcSize = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = TARGET; canvas.height = TARGET;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        img,
        (img.width - srcSize) / 2, (img.height - srcSize) / 2,
        srcSize, srcSize,
        0, 0, TARGET, TARGET
      );
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});


/* ── PHOTO LIGHTBOX ── */
const PhotoLightbox = ({ photo, onClose, onDelete }) => (
  <div className="anim-fadeIn" onClick={onClose}
    style={{ position:"fixed",inset:0,zIndex:400,background:"rgba(249,243,234,0.94)",backdropFilter:"blur(16px)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT }}>
    <div onClick={e=>e.stopPropagation()} className="anim-slideUp"
      style={{ width:300,borderRadius:0,overflow:"hidden",boxShadow:`0 32px 80px rgba(0,0,0,0.6)` }}>
      <div style={{ height:300,position:"relative",background: photo.dataURL ? "#000" : `linear-gradient(145deg,${photo.gradA},${photo.gradB})`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
        {photo.dataURL ? (
          <img src={photo.dataURL} alt={photo.label} style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover" }}/>
        ) : (
          <svg width="34%" height="34%" viewBox="0 0 24 24" fill="none" opacity="0.3">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="13" r="4" stroke="#fff" strokeWidth="1.6"/>
          </svg>
        )}
        {/* Emoji badge always on top */}
        <div style={{ position:"absolute",top:12,right:12,width:36,height:36,borderRadius:0,background:"rgba(255,255,255,0.9)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:"0 3px 12px rgba(0,0,0,0.2)",zIndex:1 }}></div>
      </div>
      <div style={{ background:C.s1,padding:"18px 20px" }}>
        <div style={{ fontSize:17,fontWeight:800,color:C.t1 }}>{photo.label}</div>
        <div style={{ fontSize:13,color:C.t2,marginTop:4 }}>{photo.date} · {photo.who}</div>
        {onDelete && (
          <button className="pressable" onClick={()=>onDelete(photo)}
            style={{ marginTop:14,width:"100%",background:"none",border:`1.5px solid ${C.accent}33`,borderRadius:0,padding:"10px",fontSize:13,fontWeight:700,color:C.accent,cursor:"pointer",fontFamily:FONT }}>
            Eliminar foto
          </button>
        )}
        <button className="pressable" onClick={onClose}
          style={{ marginTop:10,width:"100%",background:C.s2,border:"none",borderRadius:0,padding:"11px",fontSize:14,fontWeight:700,color:C.t2,cursor:"pointer",fontFamily:FONT }}>
          Cerrar
        </button>
      </div>
    </div>
  </div>
);

/* ── PHOTO CARD ── */
const PhotoCard = ({ photo, onTap }) => (
  <div className="pressable anim-fadeUp" onClick={()=>onTap(photo)}
    style={{ borderRadius:0,overflow:"hidden",cursor:"pointer",position:"relative",aspectRatio:"1/1",background:photo.dataURL?"#000":`linear-gradient(145deg,${photo.gradA},${photo.gradB})`,boxShadow:`0 3px 12px ${photo.gradA||"#C8102E"}40` }}>
    {photo.dataURL ? (
      <img src={photo.dataURL} alt={photo.label} style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover" }}/>
    ) : (
      <div style={{ position:"absolute",inset:0,background:`linear-gradient(145deg,${photo.gradA}CC,${photo.gradB}88)`,display:"flex",alignItems:"center",justifyContent:"center" }}>
        <svg width="38%" height="38%" viewBox="0 0 24 24" fill="none" opacity="0.35">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="13" r="4" stroke="#fff" strokeWidth="1.6"/>
        </svg>
      </div>
    )}
    <div style={{ position:"absolute",top:8,left:8,width:28,height:28,borderRadius:0,background:"rgba(255,255,255,0.85)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,backdropFilter:"blur(4px)" }}></div>
    <div style={{ position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,0.52))",padding:"18px 10px 8px" }}>
      <div style={{ fontSize:11,fontWeight:700,color:"#fff",lineHeight:1.2 }}>{photo.label}</div>
      <div style={{ fontSize:9,color:"rgba(255,255,255,0.75)",marginTop:2 }}>{photo.date}</div>
    </div>
  </div>
);

/* ── CAMERA MODAL ── */
const CameraModal = ({ onClose, onCapture, routineEmoji = "" }) => {
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const streamRef  = useRef(null);
  const [ready,       setReady]       = useState(false);
  const [facing,      setFacing]      = useState("environment"); // "environment" = trasera, "user" = delantera
  const [flash,       setFlash]       = useState(false);
  const [countdown,   setCountdown]   = useState(null);
  const [captured,    setCaptured]    = useState(null); // dataURL de la foto real
  const [camError,    setCamError]    = useState(null);

  /* ── Arranca / reinicia stream ── */
  const startStream = useCallback(async (facingMode) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setReady(true);
        };
      }
    } catch (err) {
      setCamError("No se pudo acceder a la cámara. Verifica los permisos.");
    }
  }, []);

  useEffect(() => {
    startStream(facing);
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, [facing, startStream]);

  /* ── Flip cámara ── */
  const handleFlip = () => {
    setReady(false);
    setFacing(f => f === "environment" ? "user" : "environment");
  };

  /* ── Captura al llegar a 0 ── */
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setFlash(true);
      // Captura del frame actual del video sobre canvas
      const video  = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas) {
        const size = Math.min(video.videoWidth, video.videoHeight);
        canvas.width  = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        // Centrar crop cuadrado
        const ox = (video.videoWidth  - size) / 2;
        const oy = (video.videoHeight - size) / 2;
        if (facing === "user") {
          // Espejo para selfie
          ctx.translate(size, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, ox, oy, size, size, 0, 0, size, size);
        const dataURL = canvas.toDataURL("image/jpeg", 0.9);
        setTimeout(() => {
          setFlash(false);
          setCaptured(dataURL);
          setCountdown(null);
        }, 300);
      }
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, facing]);

  const shoot = () => setCountdown(3);

  const handleSave = () => {
    onCapture({ dataURL: captured });
    onClose();
  };

  return (
    <div className="anim-fadeIn" style={{ position:"fixed",inset:0,zIndex:300,background:"#000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:FONT }}>
      {flash && <div style={{ position:"fixed",inset:0,background:"#fff",zIndex:400,pointerEvents:"none" }}/>}
      <canvas ref={canvasRef} style={{ display:"none" }}/>

      {/* Top bar */}
      <div style={{ position:"absolute",top:0,left:0,right:0,padding:"20px 22px",paddingTop:"calc(20px + env(safe-area-inset-top,0px))",display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:10 }}>
        <button onClick={onClose} style={{ background:"rgba(255,255,255,0.15)",border:"none",borderRadius:0,padding:"8px 16px",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:FONT,backdropFilter:"blur(8px)" }}>Cancelar</button>
        <div style={{ fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.8)",background:"rgba(0,0,0,0.3)",borderRadius:0,padding:"5px 12px",backdropFilter:"blur(8px)" }}> Gym · Hoy</div>
        {/* Flip button */}
        {!captured && (
          <button onClick={handleFlip} style={{ background:"rgba(255,255,255,0.15)",border:"none",borderRadius:0,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",backdropFilter:"blur(8px)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 7H4M4 7L8 3M4 7L8 11" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 17H20M20 17L16 13M20 17L16 21" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        {captured && <div style={{ width:38 }}/>}
      </div>

      {/* Visor cuadrado */}
      <div style={{ width:"min(88vw,340px)",height:"min(88vw,340px)",borderRadius:0,overflow:"hidden",position:"relative",border:"2px solid rgba(255,255,255,0.18)",boxShadow:`0 0 60px rgba(0,151,167,0.45)` }}>
        {/* Video live */}
        <video
          ref={videoRef}
          playsInline
          muted
          style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transform: facing==="user"?"scaleX(-1)":"none",transition:"opacity 0.3s",opacity:captured?0:ready?1:0.3 }}
        />

        {/* Loader mientras abre cámara */}
        {!ready && !captured && !camError && (
          <div style={{ position:"absolute",inset:0,background:"#F9F3EA",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14 }}>
            <div style={{ width:40,height:40,borderRadius:0,border:`3px solid ${C.accent}`,borderTopColor:"transparent",animation:"spin 0.8s linear infinite" }}/>
            <div style={{ fontSize:12,color:"rgba(255,255,255,0.5)",fontWeight:600 }}>Abriendo cámara…</div>
          </div>
        )}

        {/* Error de permisos */}
        {camError && (
          <div style={{ position:"absolute",inset:0,background:"#F9F3EA",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,padding:24 }}>
            
            <div style={{ fontSize:13,color:"rgba(255,255,255,0.8)",fontWeight:600,textAlign:"center",lineHeight:1.5 }}>{camError}</div>
          </div>
        )}

        {/* Preview capturada */}
        {captured && (
          <div style={{ position:"absolute",inset:0 }}>
            <img src={captured} alt="preview" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
            {/* Overlay con emoji de rutina */}
            <div style={{ position:"absolute",top:12,right:12,width:44,height:44,borderRadius:0,background:"rgba(255,255,255,0.9)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:"0 4px 16px rgba(0,0,0,0.25)" }}></div>
            <div style={{ position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,0.6))",padding:"28px 16px 14px",textAlign:"center" }}>
              <div style={{ fontSize:13,fontWeight:700,color:"#fff" }}>¡Lista para guardar!</div>
            </div>
          </div>
        )}

        {/* Countdown overlay */}
        {countdown !== null && !captured && (
          <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.35)" }}>
            <div key={countdown} style={{ fontSize:90,fontWeight:900,color:"#fff",animation:"countdownPop 0.5s cubic-bezier(.22,1,.36,1) both",lineHeight:1,textShadow:"0 4px 24px rgba(0,0,0,0.5)" }}>{countdown}</div>
          </div>
        )}

        {/* Corner guides */}
        {!captured && ready && (
          <>
            <div style={{ position:"absolute",top:12,left:12,width:22,height:22,borderTop:"2px solid rgba(255,255,255,0.7)",borderLeft:"2px solid rgba(255,255,255,0.7)",borderRadius:0,pointerEvents:"none" }}/>
            <div style={{ position:"absolute",top:12,right:12,width:22,height:22,borderTop:"2px solid rgba(255,255,255,0.7)",borderRight:"2px solid rgba(255,255,255,0.7)",borderRadius:0,pointerEvents:"none" }}/>
            <div style={{ position:"absolute",bottom:12,left:12,width:22,height:22,borderBottom:"2px solid rgba(255,255,255,0.7)",borderLeft:"2px solid rgba(255,255,255,0.7)",borderRadius:0,pointerEvents:"none" }}/>
            <div style={{ position:"absolute",bottom:12,right:12,width:22,height:22,borderBottom:"2px solid rgba(255,255,255,0.7)",borderRight:"2px solid rgba(255,255,255,0.7)",borderRadius:0,pointerEvents:"none" }}/>
          </>
        )}
      </div>

      {/* Bottom controls */}
      <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"28px 40px",paddingBottom:"calc(28px + env(safe-area-inset-bottom,0px))",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        {/* Thumbnail última foto / emoji rutina */}
        <div style={{ width:52,height:52,borderRadius:0,overflow:"hidden",border:"2px solid rgba(255,255,255,0.25)",background:"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>
          
        </div>

        {!captured ? (
          <button
            onClick={shoot}
            disabled={countdown !== null || !ready}
            style={{ width:78,height:78,borderRadius:0,background:"transparent",border:"4px solid rgba(255,255,255,0.5)",cursor:(countdown!==null||!ready)?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 0 2px rgba(255,255,255,0.2),0 8px 32px rgba(242,196,100,0.5)`,flexShrink:0,opacity:(countdown!==null||!ready)?0.5:1,transition:"opacity 0.2s,transform 0.1s",padding:0 }}
          >
            <div style={{ width:62,height:62,borderRadius:0,background: countdown!==null ? C.accent : "#fff",transition:"background 0.2s" }}/>
          </button>
        ) : (
          <button className="pressable" onClick={handleSave}
            style={{ background:C.accent,border:"none",borderRadius:0,padding:"16px 32px",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:FONT,boxShadow:`0 8px 28px ${C.accent}70` }}>
            Guardar foto
          </button>
        )}

        {/* Retake */}
        {captured ? (
          <button onClick={()=>setCaptured(null)} style={{ width:52,height:52,borderRadius:0,background:"rgba(255,255,255,0.12)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",backdropFilter:"blur(8px)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M1 4v6h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.51 15a9 9 0 1 0 .49-4.95" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : (
          <div style={{ width:52 }}/>
        )}
      </div>

      {/* Spin keyframe inline */}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

/* ── ROUTINE PICKER MODAL — floating-card snap slider ── */
const RoutinePickerModal = ({ routines, current, onSelect, onClose }) => {
  const [pickedId,setPickedId] = useState(current?.id ?? routines[0]?.id);
  const trackRef = useRef(null);
  const cardRefs = useRef({});

  // Center the starting card on mount (no animation, just position)
  useEffect(() => {
    const el = cardRefs.current[pickedId];
    if (el) el.scrollIntoView({ block:"nearest", inline:"center" });
  }, []);

  // Track which card is centered as the user scrolls
  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closestId = null, closestDist = Infinity;
    for (const r of routines) {
      const el = cardRefs.current[r.id];
      if (!el) continue;
      const cardCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(cardCenter - trackCenter);
      if (dist < closestDist) { closestDist = dist; closestId = r.id; }
    }
    if (closestId && closestId !== pickedId) setPickedId(closestId);
  };

  const goToCard = (id) => {
    setPickedId(id);
    const el = cardRefs.current[id];
    if (el) el.scrollIntoView({ behavior:"smooth", block:"nearest", inline:"center" });
  };

  const pickedRoutine = routines.find(r=>r.id===pickedId) || routines[0];

  const handleConfirm = () => {
    onSelect(pickedRoutine);
    onClose();
  };

  return (
    <div className="anim-fadeIn" style={{ position:"fixed",inset:0,zIndex:250,background:"rgba(249,243,234,0.7)",backdropFilter:"blur(10px)",display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:FONT }} onClick={onClose}>
      <div className="anim-slideUp"
        onClick={e=>e.stopPropagation()}
        onTouchStart={e=>e.stopPropagation()}
        onTouchMove={e=>e.stopPropagation()}
        onTouchEnd={e=>e.stopPropagation()}
        style={{ width:"100%",maxWidth:480,background:C.s1,borderRadius:0,padding:"20px 0",paddingBottom:"calc(22px + env(safe-area-inset-bottom,0px))",border:`1px solid ${C.s3}` }}>
        <div style={{ width:36,height:4,borderRadius:0,background:C.s3,margin:"0 auto 18px",padding:"0 20px" }}/>
        <div style={{ padding:"0 24px",marginBottom:18 }}>
          <div style={{ fontSize:17,fontWeight:800,color:C.t1,marginBottom:4 }}>Rutina del día</div>
          <div style={{ fontSize:13,color:C.t2 }}>¿Qué toca hoy?</div>
        </div>

        {/* Horizontal floating-card snap slider */}
        <div
          ref={trackRef}
          onScroll={onScroll}
          style={{
            display:"flex",gap:14,overflowX:"auto",scrollSnapType:"x mandatory",
            padding:"6px 20vw",WebkitOverflowScrolling:"touch",
          }}>
          {routines.map(r=>{
            const isPicked = pickedId===r.id;
            return (
              <div key={r.id}
                ref={el=>cardRefs.current[r.id]=el}
                className="pressable"
                onClick={()=>goToCard(r.id)}
                style={{
                  scrollSnapAlign:"center",flexShrink:0,width:"58vw",maxWidth:240,
                  background:C.bg,borderRadius:0,padding:"20px 18px",textAlign:"center",
                  border:`1.5px solid ${isPicked?r.color:C.s3}`,
                  boxShadow:isPicked?`0 14px 32px ${r.color}35, 0 4px 12px rgba(0,0,0,0.06)`:"0 2px 8px rgba(0,0,0,0.04)",
                  transform:isPicked?"translateY(-4px) scale(1)":"translateY(0) scale(0.94)",
                  opacity:isPicked?1:0.6,
                  transition:"transform 0.3s cubic-bezier(.22,1,.36,1), opacity 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                }}>
                <div style={{ width:56,height:56,borderRadius:0,background:`${r.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 14px" }}></div>
                <div style={{ fontSize:15,fontWeight:800,color:C.t1,marginBottom:4 }}>{r.name}</div>
                <div style={{ fontSize:11,color:C.t3,marginBottom:12 }}>{r.sub}</div>
                <div style={{ display:"flex",gap:6,justifyContent:"center",marginBottom:12 }}>
                  <Chip color={r.color} style={{ fontSize:10 }}>{r.duration} min</Chip>
                  <Chip color={r.color} style={{ fontSize:10 }}>{r.exercises.length} ejerc.</Chip>
                </div>
                {/* Difficulty squares — same style as EditRoutineModal */}
                <div style={{ textAlign:"left" }}>
                  <Label style={{ fontSize:9,marginBottom:6 }}>Dificultad</Label>
                  <div style={{ display:"flex",gap:4 }}>
                    {[1,2,3,4,5].map(d=>(
                      <div key={d} style={{ height:20,flex:1,borderRadius:0,background:d<=r.difficulty?r.color:C.s3 }}/>
                    ))}
                  </div>
                </div>
                {current?.id===r.id&&(
                  <div style={{ marginTop:12,fontSize:10,fontWeight:700,color:r.color,textTransform:"uppercase",letterSpacing:"0.06em" }}>● Rutina actual</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Dot indicators */}
        <div style={{ display:"flex",justifyContent:"center",gap:6,marginTop:16,marginBottom:20 }}>
          {routines.map(r=>(
            <div key={r.id} onClick={()=>goToCard(r.id)} className="pressable"
              style={{ width:pickedId===r.id?16:6,height:6,borderRadius:0,background:pickedId===r.id?pickedRoutine.color:C.s3,transition:"all 0.25s cubic-bezier(.22,1,.36,1)" }}/>
          ))}
        </div>

        {/* Confirm / cancel actions */}
        <div style={{ padding:"0 24px",display:"flex",flexDirection:"column",gap:8 }}>
          <button className="pressable" onClick={handleConfirm}
            style={{ width:"100%",background:`linear-gradient(135deg,${pickedRoutine.color},${pickedRoutine.dark})`,border:"none",borderRadius:0,padding:"15px",fontSize:14,fontWeight:700,color:"#fff",cursor:"pointer",fontFamily:FONT,boxShadow:`0 8px 24px ${pickedRoutine.color}45` }}>
            Elegir "{pickedRoutine.name}"
          </button>
          <button className="pressable" onClick={onClose}
            style={{ width:"100%",background:"none",border:"none",borderRadius:0,padding:"10px",fontSize:13,fontWeight:600,color:C.t3,cursor:"pointer",fontFamily:FONT }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── START WORKOUT MODAL — draggable bottom sheet ── */
const StartWorkoutModal = ({ routine, onConfirm, onClose }) => {
  const sheetRef = useRef(null);
  const startY = useRef(null);
  const currentY = useRef(0);

  const onTouchStart = (e) => {
    e.stopPropagation();
    startY.current = e.touches[0].clientY;
    currentY.current = 0;
    if (sheetRef.current) sheetRef.current.style.transition = "none";
  };

  const onTouchMove = (e) => {
    e.stopPropagation();
    const dy = e.touches[0].clientY - startY.current;
    if (dy < 0) return; // don't drag up past neutral
    currentY.current = dy;
    if (sheetRef.current) sheetRef.current.style.transform = `translateY(${dy}px)`;
  };

  const onTouchEnd = (e) => {
    e.stopPropagation();
    if (sheetRef.current) {
      sheetRef.current.style.transition = "transform 0.3s cubic-bezier(.22,1,.36,1)";
    }
    if (currentY.current > 100) {
      if (sheetRef.current) sheetRef.current.style.transform = "translateY(100%)";
      setTimeout(onClose, 280);
    } else {
      if (sheetRef.current) sheetRef.current.style.transform = "translateY(0)";
    }
    currentY.current = 0;
  };

  return (
    <div className="anim-fadeIn" onClick={onClose}
      style={{ position:"fixed",inset:0,zIndex:250,background:"rgba(249,243,234,0.65)",backdropFilter:"blur(10px)",display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:FONT }}>
      <div
        ref={sheetRef}
        onClick={e=>e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="anim-slideUp"
        style={{ width:"100%",maxWidth:480,background:C.s1,borderRadius:0,padding:"0 24px 24px",paddingBottom:"calc(24px + env(safe-area-inset-bottom,0px))",border:`1px solid ${C.s3}`,boxShadow:`0 -8px 40px rgba(0,151,167,0.18)`,touchAction:"none" }}>
        {/* Drag handle */}
        <div style={{ padding:"14px 0 10px",display:"flex",justifyContent:"center",cursor:"grab" }}>
          <div style={{ width:36,height:4,borderRadius:0,background:C.s4 }}/>
        </div>
        <div style={{ textAlign:"center",marginBottom:20 }}>
          <div style={{ width:64,height:64,borderRadius:0,background:`${routine.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 14px" }}></div>
          <div style={{ fontSize:24,fontWeight:900,color:C.t1,letterSpacing:"0.02em",fontFamily:FONT_DISPLAY,textTransform:"uppercase" }}>{routine.name}</div>
          <div style={{ fontSize:13,color:C.t2,marginTop:4 }}>{routine.duration} min · {routine.exercises.length} ejercicios</div>
        </div>
        <div style={{ display:"flex",gap:10,marginBottom:16 }}>
          {[
            { icon:null, label:"Duración", val:`${routine.duration} min` },
            { icon:null, label:"Ejercicios", val:routine.exercises.length },
            { icon:null, label:"Dificultad", val:"★".repeat(routine.difficulty) },
          ].map((m,i)=>(
            <div key={i} style={{ flex:1,background:C.bg,borderRadius:0,padding:"10px 6px",textAlign:"center",border:`1px solid ${C.s3}` }}>
              <div style={{ fontSize:13,fontWeight:800,color:C.t1 }}>{m.val}</div>
              <div style={{ fontSize:9,fontWeight:700,color:C.t3,textTransform:"uppercase",letterSpacing:"0.06em",marginTop:4 }}>{m.label}</div>
            </div>
          ))}
        </div>
        <button className="pressable" onClick={onConfirm}
          style={{ width:"100%",background:`linear-gradient(135deg,${routine.color},${routine.dark})`,border:"none",borderRadius:0,padding:"15px",fontSize:15,fontWeight:700,color:"#fff",cursor:"pointer",fontFamily:FONT,boxShadow:`0 8px 24px ${routine.color}50`,marginBottom:10 }}>
          ¡Empezar entrenamiento!
        </button>
        <button onClick={onClose}
          style={{ width:"100%",background:"none",border:"none",borderRadius:0,padding:"10px",fontSize:14,fontWeight:600,color:C.t3,cursor:"pointer",fontFamily:FONT }}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

/* ── HOME SCREEN ── */
const HomeScreen = ({ onStartWorkout, routines, todayRoutine, onChangeTodayRoutine, onOpenRoutinePicker, onOpenStartConfirm, onOpenLightbox, onGoStats }) => {
  const [photos,setPhotos]=useState([]);
  const [photosLoading,setPhotosLoading]=useState(true);
  const [showCamera,setShowCamera]=useState(false);
  const [cameraFabVisible,setCameraFabVisible]=useState(false);
  const [showToast,setShowToast]=useState(false);
  const [toastMsg,setToastMsg]=useState("");
  const [profilePhoto,setProfilePhoto]=useState(null);
  const [profileUploading,setProfileUploading]=useState(false);
  const historialRef=useRef(null);

  const fireToast=(msg)=>{ setToastMsg(msg); setShowToast(true); setTimeout(()=>setShowToast(false),2200); };

  /* Carga inicial de fotos reales desde la carpeta del dispositivo */
  useEffect(()=>{
    let mounted=true;
    loadStoredPhotos().then(list=>{ if(mounted){ setPhotos(list); setPhotosLoading(false); } });
    loadProfilePhoto().then(url=>{ if(mounted) setProfilePhoto(url); });
    return ()=>{ mounted=false; };
  },[]);

  useEffect(()=>{
    const el=historialRef.current;
    if(!el)return;
    const obs=new IntersectionObserver(([entry])=>setCameraFabVisible(entry.isIntersecting),{threshold:0.15});
    obs.observe(el);
    return()=>obs.disconnect();
  },[]);

  const handleCapture=useCallback((captured)=>{
    const label = todayRoutine?.name || "Entrenamiento";
    const emoji = todayRoutine?.emoji || "";
    const photo = makePhoto(Date.now(), label, "Ahora mismo", "Tú", null, null, emoji, captured.dataURL);
    setPhotos(prev=>[photo, ...prev]);
    persistNewPhoto(photo);
    fireToast("¡Foto añadida!");
  },[todayRoutine]);

  const handleDeletePhoto=useCallback((photo)=>{
    setPhotos(prev=>prev.filter(p=>p.id!==photo.id));
    setLightboxPhoto(null);
    deleteStoredPhoto(photo.id);
    fireToast("Foto eliminada");
  },[]);

  const handlePickProfilePhoto=useCallback(async (file)=>{
    setProfileUploading(true);
    try {
      const dataURL = await fileToSquareDataURL(file);
      setProfilePhoto(dataURL);
      await saveProfilePhoto(dataURL);
      fireToast("Foto de perfil actualizada");
    } catch (e) {
      fireToast("No se pudo cargar la foto");
    } finally {
      setProfileUploading(false);
    }
  },[]);

  return (
    <div style={{ flex:1,overflowY:"auto",background:C.bg,fontFamily:FONT,position:"relative" }}>
      {showCamera&&<CameraModal onClose={()=>setShowCamera(false)} onCapture={handleCapture} routineEmoji={""}/>}
      <Toast message={toastMsg} show={showToast}/>

      {/* Greeting */}
      <div className="anim-fadeUp" style={{ padding:"16px 22px 0",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div>
          <Label>Miércoles, 11 Jun</Label>
          {/* <div style={{ fontSize:24,fontWeight:800,color:C.t1,letterSpacing:"-0.5px",marginTop:4,lineHeight:1.15 }}>
            Buenos días,<br/><span style={{ color:C.accent }}>Ricardo</span>
          </div> */}
        </div>

      </div>

      {/* Bear Hero */}
      <div className="anim-fadeUp" style={{ padding:"16px 22px 0",animationDelay:"0.05s" }}>
        <div style={{ position:"relative",background:C.s1,borderRadius:0,padding:"32px 22px 26px",textAlign:"center",border:`1px solid ${C.s3}`,boxShadow:`0 4px 24px rgba(0,151,167,0.15)`,overflow:"hidden" }}>
          <div style={{ position:"absolute",top:-40,right:-40,width:120,height:120,borderRadius:0,background:`radial-gradient(circle,${C.pink}22 0%,transparent 70%)`,pointerEvents:"none" }}/>
          <div style={{ fontSize:15,fontWeight:700,color:C.accentL,letterSpacing:"0.12em",marginBottom:20,fontFamily:FONT_DISPLAY,textTransform:"uppercase" }}>Más fuertes juntos, cada día</div>
          <div style={{ display:"flex",justifyContent:"center",marginBottom:20 }}>
            <ProfileAvatar size={110} showGlow={false}
              photoURL={profilePhoto} onPickPhoto={handlePickProfilePhoto} uploading={profileUploading}/>
          </div>

          {/* Start workout button — metallic gold */}
          <button className="pressable" onClick={onOpenStartConfirm}
            style={{
              background:"linear-gradient(135deg,#C9A84C 0%,#E8C96A 40%,#A07828 100%)",
              border:"1px solid #D4B05A",
              borderRadius:0,
              padding:"15px 40px",
              fontSize:14,
              fontWeight:800,
              color:"#fff",
              cursor:"pointer",
              fontFamily:FONT_DISPLAY,
              letterSpacing:"0.14em",
              textTransform:"uppercase",
              boxShadow:"0 8px 28px rgba(160,120,40,0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
              marginBottom:18,
              textShadow:"0 1px 3px rgba(80,50,0,0.4)",
            }}>
            INICIAR ENTRENAMIENTO
          </button>

          {/* Routine selector pill */}
          <div className="pressable" onClick={onOpenRoutinePicker} style={{ display:"inline-flex",alignItems:"center",gap:10,background:C.s2,borderRadius:0,padding:"10px 18px",border:`1px solid ${C.s3}`,cursor:"pointer" }}>
            <span style={{ fontSize:16 }}></span>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontSize:12,fontWeight:700,color:C.t1 }}>{todayRoutine.name}</div>
              <div style={{ fontSize:10,color:C.t3 }}>{todayRoutine.duration} min · {todayRoutine.exercises.length} ejerc.</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke={C.t2} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* This week — 2-col stats + mini chart */}
      <div className="anim-fadeUp pressable" onClick={onGoStats} style={{ padding:"22px 22px 0",animationDelay:"0.15s" }}>
        <Label style={{ marginBottom:12 }}>Esta semana <span style={{ fontSize:9,color:C.accent,fontWeight:700 }}>→ ver stats</span></Label>
        <div style={{ background:C.s1,borderRadius:0,padding:"18px",border:`1px solid ${C.s3}` }}>
          {/* Mini bar chart — thin line + dot cap */}
          <div style={{ display:"flex",gap:5,alignItems:"flex-end",height:56,marginBottom:14 }}>
            {STATS_WEEK.map((v,i)=>{
              const max=Math.max(...STATS_WEEK);
              const h=max>0?(v/max)*40:0;
              const isToday=i===2;
              const color=isToday?C.accent:v>0?C.s4:C.s3;
              return (
                <div key={i} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
                  <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",height:44,gap:0 }}>
                    {/* Dot cap */}
                    <div style={{ width:5,height:5,borderRadius:0,background:v>0?color:"transparent",marginBottom:0,flexShrink:0,boxShadow:isToday?`0 0 6px ${C.accent}80`:"none" }}/>
                    {/* Thin line */}
                    <div style={{ width:2,height:h||0,borderRadius:0,background:color,transition:"height 0.6s cubic-bezier(.22,1,.36,1)" }}/>
                    {/* Baseline dot */}
                    {v>0&&<div style={{ width:2,height:2,borderRadius:0,background:color,flexShrink:0 }}/>}
                  </div>
                  <span style={{ fontSize:9,fontWeight:700,color:isToday?C.accent:C.t3 }}>{DAYS[i]}</span>
                </div>
              );
            })}
          </div>
          {/* Quick stats row */}
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:22,fontWeight:900,color:C.t1,lineHeight:1 }}>6<span style={{ fontSize:12,fontWeight:600,color:C.t3 }}> grupos</span></div>
            <Label style={{ marginTop:4 }}>Frec. muscular</Label>
          </div>
        </div>
      </div>

      {/* Historial */}
      <div ref={historialRef} className="anim-fadeUp" style={{ padding:"22px 22px 0",animationDelay:"0.2s" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
          <div>
            <Label>Historial del gym</Label>
            <div style={{ fontSize:11,color:C.t3,marginTop:4 }}>{photos.length} fotos juntos</div>
          </div>
          <button className="pressable" onClick={()=>setShowCamera(true)} style={{ display:"flex",alignItems:"center",gap:6,background:C.accent,border:"none",borderRadius:0,padding:"8px 16px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:FONT }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="13" r="4" stroke="#fff" strokeWidth="2"/>
            </svg>
            Nueva foto
          </button>
        </div>
        {photosLoading ? (
          <div style={{ display:"flex",justifyContent:"center",gap:8,padding:"30px 0" }}>
            {[0,1,2].map(i=><div key={i} style={{ width:6,height:6,borderRadius:0,background:C.accent,opacity:0.6,animation:`pulse 1s ease-in-out ${i*0.2}s infinite` }}/>)}
          </div>
        ) : photos.length===0 ? (
          <div style={{ textAlign:"center",padding:"36px 20px",color:C.t3 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ marginBottom:10,opacity:0.5 }}>
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke={C.t3} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="13" r="4" stroke={C.t3} strokeWidth="1.6"/>
            </svg>
            <div style={{ fontSize:13,fontWeight:600 }}>Aún no hay fotos</div>
            <div style={{ fontSize:12,marginTop:4 }}>Toma la primera foto de su entrenamiento juntos</div>
          </div>
        ) : (
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            {photos.map(photo=><PhotoCard key={photo.id} photo={photo} onTap={onOpenLightbox}/>)}
          </div>
        )}
        <div style={{ height:24 }}/>
      </div>

      {/* Camera FAB — safe distance from tab bar */}
      <div style={{ position:"fixed",bottom:88,left:"50%",transform:`translateX(-50%) translateY(${cameraFabVisible?0:20}px)`,opacity:cameraFabVisible?1:0,transition:"all 0.35s cubic-bezier(.34,1.56,.64,1)",zIndex:150,pointerEvents:cameraFabVisible?"auto":"none" }}>
        <button className="pressable" onClick={()=>setShowCamera(true)} style={{ display:"flex",alignItems:"center",gap:10,background:C.accent,border:"none",borderRadius:0,padding:"13px 24px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT,boxShadow:`0 8px 28px ${C.accent}55`,whiteSpace:"nowrap" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="13" r="4" stroke="#fff" strokeWidth="2"/>
          </svg>
          Subir foto

        </button>
      </div>
    </div>
  );
};

/* ── EDIT ROUTINE MODAL ── */
const EditRoutineModal = ({ routine, onSave, onClose }) => {
  const [name, setName] = useState(routine.name);
  const [sub, setSub] = useState(routine.sub);
  const [duration, setDuration] = useState(routine.duration);
  const [difficulty, setDifficulty] = useState(routine.difficulty);
  const [exercises, setExercises] = useState(routine.exercises.map((e,i)=>({...e,_id:i})));
  const [newExName, setNewExName] = useState("");
  const [newExSets, setNewExSets] = useState(3);
  const [newExReps, setNewExReps] = useState(10);
  const [newExWeight, setNewExWeight] = useState(0);
  const [newExMuscle, setNewExMuscle] = useState("");
  const [showAddEx, setShowAddEx] = useState(false);

  const removeEx = (id) => setExercises(prev=>prev.filter(e=>e._id!==id));
  const addEx = () => {
    if(!newExName.trim())return;
    setExercises(prev=>[...prev,{ name:newExName.trim(),sets:newExSets,reps:newExReps,weight:newExWeight,muscle:newExMuscle.trim(),_id:Date.now() }]);
    setNewExName(""); setNewExSets(3); setNewExReps(10); setNewExWeight(0); setNewExMuscle(""); setShowAddEx(false);
  };

  const handleSave = () => {
    onSave({ ...routine, name:name.trim()||routine.name, sub:sub.trim()||routine.sub, duration:Number(duration), difficulty, exercises:exercises.map(({_id,...e})=>e) });
    onClose();
  };

  const inputStyle = { width:"100%",background:C.s2,border:`1px solid ${C.s3}`,borderRadius:0,padding:"10px 14px",fontSize:14,color:C.t1,fontFamily:FONT,outline:"none" };
  const smallInput = { ...inputStyle, padding:"8px 10px",fontSize:13,textAlign:"center" };

  return (
    <div className="anim-fadeIn" style={{ position:"fixed",inset:0,zIndex:260,background:"rgba(249,243,234,0.72)",backdropFilter:"blur(10px)",display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:FONT }} onClick={onClose}>
      <div className="anim-slideUp" onClick={e=>e.stopPropagation()} style={{ width:"100%",maxWidth:480,overflowY:"auto",background:C.bg,borderRadius:0,maxHeight:"92vh",paddingBottom:"env(safe-area-inset-bottom,0px)" }}>
        <div style={{ position:"sticky",top:0,background:C.bg,padding:"16px 20px 14px",borderBottom:`1px solid ${C.s3}`,display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:1 }}>
          <button onClick={onClose} style={{ background:"none",border:"none",color:C.t2,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:FONT }}>Cancelar</button>
          <div style={{ fontSize:16,fontWeight:800,color:C.t1 }}>Editar rutina</div>
          <button onClick={handleSave} style={{ background:C.accent,border:"none",borderRadius:0,padding:"7px 16px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT }}>Guardar</button>
        </div>

        <div style={{ padding:"16px 20px" }}>
          <Label style={{ marginBottom:8 }}>Nombre</Label>
          <input style={{ ...inputStyle,marginBottom:14 }} value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre de la rutina"/>
          <Label style={{ marginBottom:8 }}>Descripción</Label>
          <input style={{ ...inputStyle,marginBottom:14 }} value={sub} onChange={e=>setSub(e.target.value)} placeholder="Grupos musculares"/>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20 }}>
            <div>
              <Label style={{ marginBottom:8 }}>Duración (min)</Label>
              <input type="number" style={smallInput} value={duration} onChange={e=>setDuration(e.target.value)}/>
            </div>
            <div>
              <Label style={{ marginBottom:8 }}>Dificultad</Label>
              <div style={{ display:"flex",gap:4,marginTop:4 }}>
                {[1,2,3,4,5].map(d=>(
                  <div key={d} className="pressable" onClick={()=>setDifficulty(d)} style={{ height:28,flex:1,borderRadius:0,background:d<=difficulty?routine.color:C.s3,cursor:"pointer",transition:"background 0.2s" }}/>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
            <Label>Ejercicios ({exercises.length})</Label>
            <button className="pressable" onClick={()=>setShowAddEx(v=>!v)} style={{ display:"flex",alignItems:"center",gap:5,background:C.accent,border:"none",borderRadius:0,padding:"5px 12px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FONT }}>
              <span style={{ fontSize:16,lineHeight:1 }}>+</span> Agregar
            </button>
          </div>

          {showAddEx&&(
            <div className="anim-fadeUp" style={{ background:C.s2,borderRadius:0,padding:"14px",marginBottom:14,border:`1px solid ${C.s3}` }}>
              <input style={{ ...inputStyle,marginBottom:10 }} value={newExName} onChange={e=>setNewExName(e.target.value)} placeholder="Nombre del ejercicio"/>
              <input style={{ ...inputStyle,marginBottom:10 }} value={newExMuscle} onChange={e=>setNewExMuscle(e.target.value)} placeholder="Músculo (opcional)"/>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12 }}>
                {[
                  {label:"Series",val:newExSets,set:setNewExSets},
                  {label:"Reps",val:newExReps,set:setNewExReps},
                  {label:"Peso kg",val:newExWeight,set:setNewExWeight},
                ].map((f,i)=>(
                  <div key={i} style={{ textAlign:"center" }}>
                    <Label style={{ marginBottom:4,fontSize:9 }}>{f.label}</Label>
                    <input type="number" style={{ ...smallInput,fontSize:12 }} value={f.val} onChange={e=>f.set(Number(e.target.value))}/>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex",gap:8 }}>
                <button onClick={()=>setShowAddEx(false)} style={{ flex:1,background:C.s1,border:`1px solid ${C.s3}`,borderRadius:0,padding:"10px",fontSize:13,fontWeight:600,color:C.t2,cursor:"pointer",fontFamily:FONT }}>Cancelar</button>
                <button className="pressable" onClick={addEx} style={{ flex:2,background:C.accent,border:"none",borderRadius:0,padding:"10px",fontSize:13,fontWeight:700,color:"#fff",cursor:"pointer",fontFamily:FONT }}>Añadir ejercicio</button>
              </div>
            </div>
          )}

          {exercises.map((ex,i)=>(
            <div key={ex._id} style={{ background:C.s1,borderRadius:0,padding:"12px 14px",marginBottom:10,border:`1px solid ${C.s3}`,display:"flex",alignItems:"center",gap:12 }}>
              <div style={{ width:28,height:28,borderRadius:0,background:C.s2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:C.t3,flexShrink:0 }}>{i+1}</div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:14,fontWeight:700,color:C.t1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{ex.name}</div>
                <div style={{ fontSize:11,color:C.t3,marginTop:2 }}>{ex.sets}×{ex.reps}{ex.weight>0?` · ${ex.weight}kg`:""}{ex.muscle?` · ${ex.muscle}`:""}</div>
              </div>
              <button className="pressable" onClick={()=>removeEx(ex._id)} style={{ width:28,height:28,borderRadius:0,background:`${C.accent}15`,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0 }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 2L10 10M10 2L2 10" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          ))}
          <div style={{ height:20 }}/>
        </div>
      </div>
    </div>
  );
};

/* ── ROUTINES SCREEN ── */
const RoutinesScreen = ({ routines, onSelect, onUpdateRoutines }) => {
  const [editingRoutine,setEditingRoutine]=useState(null);
  const clickTimer = useRef(null);

  const handleSave = (updated) => {
    onUpdateRoutines(prev=>prev.map(r=>r.id===updated.id?updated:r));
  };

  useEffect(() => () => { if (clickTimer.current) clearTimeout(clickTimer.current); }, []);

  // Disambiguate single vs double tap: a single click is delayed briefly so
  // a following second click can cancel it and open edit instead, rather
  // than both the select action and the edit modal firing together.
  const handleCardClick = (r) => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      setEditingRoutine(r);
    } else {
      clickTimer.current = setTimeout(() => {
        clickTimer.current = null;
        onSelect(r);
      }, 280);
    }
  };

  return (
    <>
      {editingRoutine&&<EditRoutineModal routine={editingRoutine} onSave={handleSave} onClose={()=>setEditingRoutine(null)}/>}
      <div style={{ flex:1,overflowY:"auto",background:C.bg,fontFamily:FONT }}>
        <div style={{ padding:"16px 22px 0" }}>
          <div style={{ fontSize:32,fontWeight:900,color:C.t1,letterSpacing:"-0.5px",marginBottom:4,fontFamily:FONT_SERIF }}>Rutinas</div>
          <div style={{ fontSize:13,color:C.t2,marginBottom:20,fontFamily:FONT,letterSpacing:"0.04em" }}>Escoge y entrena juntos</div>
        </div>
        <div style={{ padding:"0 22px 24px",display:"flex",flexDirection:"column",gap:18 }}>
          {routines.map((r,i)=>(
            <div key={r.id} className="anim-fadeUp pressable" onClick={()=>handleCardClick(r)} style={{ borderRadius:0,overflow:"hidden",background:C.s1,border:`1px solid ${C.s3}`,animationDelay:`${i*0.08}s`,boxShadow:"0 4px 20px rgba(0,0,0,0.07)",cursor:"pointer" }}>
              {/* Full-bleed hero header */}
              <div style={{ height:92,background:`linear-gradient(135deg,${r.color},${r.dark})`,position:"relative",display:"flex",alignItems:"center",padding:"0 20px",overflow:"hidden" }}>
                <div style={{ position:"absolute",top:-20,right:-20,width:100,height:100,borderRadius:0,background:"rgba(255,255,255,0.08)",pointerEvents:"none" }}/>
                <div style={{ position:"absolute",bottom:-30,left:60,width:80,height:80,borderRadius:0,background:"rgba(255,255,255,0.06)",pointerEvents:"none" }}/>
                <div style={{ fontSize:42,marginRight:14,filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.2))" }}></div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.7)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4 }}>{r.sub}</div>
                  <div style={{ fontSize:20,fontWeight:900,color:"#fff",letterSpacing:"-0.2px",fontFamily:FONT_SERIF,lineHeight:1.15 }}>{r.name}</div>
                </div>
              </div>
              <div style={{ padding:"16px 20px 20px" }}>
                <div style={{ display:"flex",gap:4,marginBottom:16 }}>
                  {[1,2,3,4,5].map(d=><div key={d} style={{ height:4,flex:1,borderRadius:0,background:d<=r.difficulty?r.color:C.s3 }}/>)}
                </div>
                <div style={{ display:"flex",gap:12,justifyContent:"space-between",alignItems:"center" }}>
                  {[
                    { icon:null,val:`${r.duration} min` },
                    { icon:null,val:`${r.exercises.length} ejerc.` },
                  ].map((m,i)=>(
                    <div key={i} style={{ display:"flex",alignItems:"center",gap:5 }}>
                      <span style={{ fontSize:12,fontWeight:600,color:C.t2 }}>{m.val}</span>
                    </div>
                  ))}
                  <div style={{ flex:1 }}/>
                  <button className="pressable" onClick={(e)=>{e.stopPropagation();setEditingRoutine(r);}} style={{ background:C.s2,border:`1px solid ${C.s3}`,borderRadius:0,padding:"7px 13px",fontSize:11,fontWeight:700,color:C.t2,cursor:"pointer",fontFamily:FONT,display:"flex",alignItems:"center",gap:4 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke={C.t2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke={C.t2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Editar
                  </button>
                  <button className="pressable" onClick={(e)=>{e.stopPropagation();onSelect(r);}} style={{ background:r.color,border:"none",borderRadius:0,padding:"7px 15px",fontSize:11,fontWeight:700,color:"#fff",cursor:"pointer",fontFamily:FONT }}>Empezar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

/* ── STATS SCREEN ── */
const DAY_EXERCISES = {
  0: { day:"Lunes",    exercises:["Legcurl","Extensión de piernas","Hip abductor"],     minutes:18 },
  1: { day:"Martes",   exercises:["Chest press","Pec Fly rear delta","Tronco","Abs"],   minutes:26 },
  2: { day:"Miércoles",exercises:["Brazos","Brazos Peso Libre"],                         minutes:14 },
  3: { day:"Jueves",   exercises:["Leg press","Sentadilla Asistida","Pantorrilla","Abductor","Lumbar"], minutes:32 },
  4: { day:"Viernes",  exercises:["Chest press","Tronco","Abs","Lumbar"],               minutes:28 },
  5: { day:"Sábado",   exercises:[],                                                     minutes:0  },
  6: { day:"Domingo",  exercises:[],                                                     minutes:0  },
};

const StatsScreen = () => {
  const [period,setPeriod]=useState("week");
  const [selectedDay,setSelectedDay]=useState(null);
  const sheetRef = useRef(null);
  const startY = useRef(null);
  const currentY = useRef(0);

  const weekData = [18,26,14,32,28,0,0];
  const monthData = [42,58,35,61,49,38,55,60,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  const data = period==="week"?weekData:monthData;
  const labels = period==="week"?["L","M","X","J","V","S","D"]:Array.from({length:30},(_,i)=>`${i+1}`);
  const max=Math.max(...data,1);
  const todayIdx=period==="week"?2:0;

  const onTouchStart = (e) => {
    e.stopPropagation();
    startY.current = e.touches[0].clientY;
    currentY.current = 0;
    if (sheetRef.current) sheetRef.current.style.transition = "none";
  };
  const onTouchMove = (e) => {
    e.stopPropagation();
    const dy = e.touches[0].clientY - startY.current;
    if (dy < 0) return;
    currentY.current = dy;
    if (sheetRef.current) sheetRef.current.style.transform = `translateY(${dy}px)`;
  };
  const onTouchEnd = (e) => {
    e.stopPropagation();
    if (sheetRef.current) sheetRef.current.style.transition = "transform 0.3s cubic-bezier(.22,1,.36,1)";
    if (currentY.current > 80) {
      if (sheetRef.current) sheetRef.current.style.transform = "translateY(100%)";
      setTimeout(() => setSelectedDay(null), 280);
    } else {
      if (sheetRef.current) sheetRef.current.style.transform = "translateY(0)";
    }
    currentY.current = 0;
  };

  return (
    <div style={{ flex:1,overflowY:"auto",background:C.bg,fontFamily:FONT,padding:"16px 22px 32px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24 }}>
        <div>
          <div style={{ fontSize:32,fontWeight:900,color:C.t1,letterSpacing:"-0.5px",fontFamily:FONT_SERIF }}>Estadísticas</div>
          <div style={{ fontSize:13,color:C.t2,marginTop:2,letterSpacing:"0.04em" }}>Tu progreso</div>
        </div>
        <div style={{ display:"flex",background:C.s2,borderRadius:0,padding:3,gap:2 }}>
          {["week","month"].map(p=>(
            <button key={p} onClick={()=>setPeriod(p)}
              style={{ background:period===p?C.s1:"transparent",border:"none",borderRadius:0,padding:"5px 12px",fontSize:11,fontWeight:700,color:period===p?C.t1:C.t3,cursor:"pointer",fontFamily:FONT,transition:"all 0.18s",boxShadow:period===p?"0 1px 4px rgba(0,0,0,0.08)":"none" }}>
              {p==="week"?"Semana":"Mes"}
            </button>
          ))}
        </div>
      </div>

      {/* Activity chart */}
      <div className="anim-fadeUp" style={{ background:C.s1,borderRadius:0,padding:"18px",marginBottom:14,border:`1px solid ${C.s3}` }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:14 }}>
          <div style={{ fontSize:14,fontWeight:700,color:C.t1 }}>Minutos activos</div>
          <Chip color={C.accent} style={{ fontSize:10 }}>{period==="week"?"Esta semana":"Este mes"}</Chip>
        </div>
        <div style={{ display:"flex",gap:period==="week"?10:4,alignItems:"flex-end",height:90 }}>
          {data.map((v,i)=>{
            const h = max>0?(v/max)*62:0;
            const isToday = i===todayIdx;
            const isSelected = selectedDay===i;
            const clickable = period==="week" && v>0;
            const color = isSelected ? C.accentL : isToday ? C.accent : v>0 ? C.s4 : C.s3;
            return (
              <div key={i} className={clickable?"pressable":""} onClick={()=>{ if(clickable) setSelectedDay(i===selectedDay?null:i); }}
                style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:clickable?"pointer":"default" }}>
                {v>0&&<span style={{ fontSize:8,fontWeight:700,color:isSelected?C.accent:C.t3,opacity:isSelected?1:0.7 }}>{v}m</span>}
                {/* Thin line + dot cap column */}
                <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",flex:1,gap:0 }}>
                  <div style={{
                    width:6,height:6,borderRadius:0,flexShrink:0,
                    background: v>0 ? color : "transparent",
                    boxShadow: (isSelected||isToday)&&v>0 ? `0 0 8px ${color}90` : "none",
                    transition:"all 0.35s",
                  }}/>
                  <div style={{
                    width:2,
                    height:h||0,
                    borderRadius:0,
                    background: color,
                    transition:"height 0.5s cubic-bezier(.22,1,.36,1), background 0.3s",
                    transformOrigin:"bottom",
                  }}/>
                  {v>0&&<div style={{ width:2,height:2,borderRadius:0,background:color,flexShrink:0 }}/>}
                </div>
                {period==="week"&&<span style={{ fontSize:10,fontWeight:700,color:isSelected?C.accent:isToday?C.accent:C.t3 }}>{labels[i]}</span>}
              </div>
            );
          })}
        </div>
        {period==="week"&&(
          <div style={{ marginTop:10,fontSize:11,color:C.t3,textAlign:"center" }}>
            Toca una barra para ver el detalle del día
          </div>
        )}
      </div>

      {/* Summary stats */}
      {[
        { label:"Frec. muscular semanal",val:"6 grupos",detail:"↑ 2 vs. semana pasada",color:C.accent,pct:0.75 },
        { label:"Sesiones completadas",val:"47",detail:"↑ 4 vs. semana pasada",color:C.pink,pct:0.58 },
      ].map((s,i)=>(
        <div key={i} className="anim-fadeUp" style={{ background:C.s1,borderRadius:0,padding:"16px",marginBottom:10,border:`1px solid ${C.s3}`,animationDelay:`${i*0.07}s`,boxShadow:`0 2px 12px ${s.color}10` }}>
          <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:10 }}>
            <Ring pct={s.pct} size={50} sw={4.5} color={s.color} bg={C.s3}>
              <span style={{ fontSize:9,fontWeight:700,color:s.color }}>{Math.round(s.pct*100)}%</span>
            </Ring>
            <div>
              <div style={{ fontSize:22,fontWeight:900,color:C.t1 }}>{s.val}</div>
              <Label style={{ marginTop:2 }}>{s.label}</Label>
            </div>
          </div>
          <div style={{ height:4,borderRadius:0,background:C.s3,overflow:"hidden" }}>
            <div style={{ height:"100%",borderRadius:0,background:s.color,width:`${s.pct*100}%`,transition:"width 0.8s cubic-bezier(.22,1,.36,1)" }}/>
          </div>
          <div style={{ fontSize:11,color:C.t3,marginTop:6 }}>{s.detail}</div>
        </div>
      ))}

      {/* Day detail bottom sheet */}
      {selectedDay!==null && (
        <div className="anim-fadeIn" onClick={()=>setSelectedDay(null)}
          style={{ position:"fixed",inset:0,zIndex:250,background:"rgba(249,243,234,0.6)",backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:FONT }}>
          <div
            ref={sheetRef}
            className="anim-slideUp"
            onClick={e=>e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ width:"100%",maxWidth:480,background:C.s1,borderRadius:0,paddingBottom:"calc(28px + env(safe-area-inset-bottom,0px))",border:`1px solid ${C.s3}`,boxShadow:`0 -4px 32px rgba(0,151,167,0.2)`,touchAction:"none" }}>
            {/* Drag handle */}
            <div style={{ padding:"14px 0 8px",display:"flex",justifyContent:"center" }}>
              <div style={{ width:36,height:4,borderRadius:0,background:C.s4 }}/>
            </div>
            <div style={{ padding:"4px 22px 20px" }}>
              <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:18 }}>
                <div style={{ width:44,height:44,borderRadius:0,background:`${C.accent}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22 }}>●</div>
                <div>
                  <div style={{ fontSize:18,fontWeight:900,color:C.t1,fontFamily:FONT_DISPLAY }}>{DAY_EXERCISES[selectedDay].day}</div>
                  <div style={{ fontSize:12,color:C.t2,marginTop:2 }}>Esta semana</div>
                </div>
                <div style={{ marginLeft:"auto",textAlign:"right" }}>
                  <div style={{ fontSize:22,fontWeight:900,color:C.accent }}>{DAY_EXERCISES[selectedDay].minutes}</div>
                  <div style={{ fontSize:10,fontWeight:700,color:C.t3,textTransform:"uppercase",letterSpacing:"0.07em" }}>min activos</div>
                </div>
              </div>

              {DAY_EXERCISES[selectedDay].exercises.length > 0 ? (
                <>
                  <div style={{ fontSize:11,fontWeight:700,color:C.t3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10 }}>Ejercicios completados</div>
                  {DAY_EXERCISES[selectedDay].exercises.map((ex,i)=>(
                    <div key={i} style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:0,background:i%2===0?C.s2:C.bg,marginBottom:6 }}>
                      <div style={{ width:28,height:28,borderRadius:0,background:`${C.accent}18`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5L5 9.5L11 3.5" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <span style={{ fontSize:14,fontWeight:600,color:C.t1 }}>{ex}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div style={{ textAlign:"center",padding:"24px 0",color:C.t3,fontSize:14 }}>
                  
                  Día de descanso
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── EDIT PROFILE MODAL ── */
const EditProfileModal = ({ profile, onSave, onClose }) => {
  const [name,setName]=useState(profile.name);
  const [partner,setPartner]=useState(profile.partner);
  const [emoji,setEmoji]=useState(profile.emoji);
  const avatarOptions=["A","B","C","D","E","F","G"];
  const inputStyle={ width:"100%",background:C.s2,border:`1px solid ${C.s3}`,borderRadius:0,padding:"10px 14px",fontSize:14,color:C.t1,fontFamily:FONT,outline:"none" };
  return (
    <div className="anim-fadeIn" style={{ position:"fixed",inset:0,zIndex:260,background:"rgba(249,243,234,0.72)",backdropFilter:"blur(10px)",display:"flex",flexDirection:"column",fontFamily:FONT }}>
      <div className="anim-slideUp" style={{ background:C.bg,marginTop:"auto",borderRadius:0,maxHeight:"85vh",overflowY:"auto",paddingBottom:"env(safe-area-inset-bottom,0px)" }}>
        <div style={{ position:"sticky",top:0,background:C.bg,padding:"16px 20px 14px",borderBottom:`1px solid ${C.s3}`,display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:1 }}>
          <button onClick={onClose} style={{ background:"none",border:"none",color:C.t2,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:FONT }}>Cancelar</button>
          <div style={{ fontSize:16,fontWeight:800,color:C.t1 }}>Editar perfil</div>
          <button onClick={()=>{onSave({name,partner,emoji});onClose();}} style={{ background:C.accent,border:"none",borderRadius:0,padding:"7px 16px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT }}>Guardar</button>
        </div>
        <div style={{ padding:"20px" }}>
          <Label style={{ marginBottom:10 }}>Avatar</Label>
          <div style={{ display:"flex",gap:10,marginBottom:20,flexWrap:"wrap" }}>
            {avatarOptions.map(e=>(
              <div key={e} className="pressable" onClick={()=>setEmoji(e)} style={{ width:44,height:44,borderRadius:0,background:emoji===e?`${C.accent}20`:C.s2,border:`2px solid ${emoji===e?C.accent:C.s3}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,cursor:"pointer",transition:"all 0.15s" }}>{e}</div>
            ))}
          </div>
          <Label style={{ marginBottom:8 }}>Nombre</Label>
          <input style={{ ...inputStyle,marginBottom:14 }} value={name} onChange={e=>setName(e.target.value)}/>
          <Label style={{ marginBottom:8 }}>Pareja</Label>
          <input style={{ ...inputStyle,marginBottom:20 }} value={partner} onChange={e=>setPartner(e.target.value)}/>
        </div>
      </div>
    </div>
  );
};

/* ── PROFILE SCREEN ── */
const ProfileScreen = ({ profile, onEditProfile }) => {
  return (
  <div style={{ flex:1,overflowY:"auto",background:C.bg,fontFamily:FONT }}>
    <div style={{ position:"relative",padding:"28px 22px 24px",background:`linear-gradient(160deg,${C.s2} 0%,${C.bg} 100%)`,textAlign:"center",borderBottom:`1px solid ${C.s3}` }}>
      <div style={{ position:"absolute",top:12,left:20 }}><FloralBranch side="left" style={{ opacity:0.25 }}/></div>
      <div style={{ position:"absolute",top:12,right:20 }}><FloralBranch side="right" style={{ opacity:0.25 }}/></div>
      <div style={{ width:80,height:80,borderRadius:0,margin:"0 auto 12px",background:`linear-gradient(135deg,${C.s3},${C.s2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,border:`3px solid ${C.accent}40`,boxShadow:`0 0 0 6px ${C.accent}12` }}></div>
      <div style={{ fontSize:22,fontWeight:900,color:C.t1 }}>{profile.name}</div>
      <div style={{ fontSize:13,color:C.t2,marginTop:2 }}>Pareja de {profile.partner}</div>
      <div style={{ display:"flex",gap:10,justifyContent:"center",marginTop:14 }}>
        <button className="pressable" onClick={onEditProfile} style={{ display:"inline-flex",alignItems:"center",gap:6,background:C.s1,border:`1px solid ${C.s3}`,borderRadius:0,padding:"7px 18px",fontSize:12,fontWeight:700,color:C.t2,cursor:"pointer",fontFamily:FONT }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke={C.t2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke={C.t2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Editar perfil
        </button>
      </div>
    </div>
    <div style={{ padding:"16px 22px 32px" }}>
      {[
        { label:"Socio de entreno",val:`${profile.partner} ` },
      ].map((row,i)=>(
        <div key={i} style={{ background:C.s1,borderRadius:0,padding:"14px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",border:`1px solid ${C.s3}` }}>
          <span style={{ fontSize:14,color:C.t2 }}>{row.label}</span>
          <span style={{ fontSize:14,fontWeight:700,color:C.t1 }}>{row.val}</span>
        </div>
      ))}
    </div>
  </div>
  );
};



/* ── EXERCISE ROW ── */
const ExerciseRow = ({ ex, idx, accent, onToggle, style={} }) => {
  const [done, setDone] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [weight, setWeight] = useState(ex.weight ?? 0);
  const [sets, setSets] = useState(ex.sets ?? 3);
  const [reps, setReps] = useState(ex.reps ?? 12);
  const [machine, setMachine] = useState(ex.machine ?? "");
  const [unlockedField, setUnlockedField] = useState(null); // which chip label is currently editable
  const [popping, setPopping] = useState(false);
  const tapTimers = useRef({});
  const relockTimer = useRef(null);
  const collapseTimer = useRef(null);
  const popTimer = useRef(null);

  const handleToggle = () => {
    const next = !done;
    setDone(next);
    onToggle && onToggle(next);
    if (collapseTimer.current) clearTimeout(collapseTimer.current);
    if (next) {
      // Quick "pop" on the button itself, then let the person see the
      // checkmark land before the card collapses
      setPopping(true);
      if (popTimer.current) clearTimeout(popTimer.current);
      popTimer.current = setTimeout(() => setPopping(false), 300);
      collapseTimer.current = setTimeout(() => setExpanded(false), 320);
    } else {
      setExpanded(true); // un-completing always re-opens the full card
    }
  };

  useEffect(() => () => {
    if (collapseTimer.current) clearTimeout(collapseTimer.current);
    if (popTimer.current) clearTimeout(popTimer.current);
  }, []);

  // Requires two quick taps (within 350ms) on a locked field before it
  // unlocks for editing — guards against accidental value changes from a
  // stray tap, without needing an awkward long-press.
  const handleChipTap = (label) => {
    if (unlockedField === label) return; // already unlocked
    if (tapTimers.current[label]) {
      clearTimeout(tapTimers.current[label]);
      tapTimers.current[label] = null;
      setUnlockedField(label);
      if (relockTimer.current) clearTimeout(relockTimer.current);
      relockTimer.current = setTimeout(() => setUnlockedField(null), 4000);
    } else {
      tapTimers.current[label] = setTimeout(() => { tapTimers.current[label] = null; }, 350);
    }
  };

  useEffect(() => () => {
    Object.values(tapTimers.current).forEach(t => t && clearTimeout(t));
    if (relockTimer.current) clearTimeout(relockTimer.current);
  }, []);

  const editableChip = (label, value, setter, type="number") => {
    const unlocked = unlockedField === label;
    return (
      <div
        style={{ flex:1,background:done?`${accent}10`:C.s2,borderRadius:0,padding:"8px 4px",textAlign:"center",transition:"background 0.3s, opacity 0.2s",opacity:unlocked?1:0.85,border:unlocked?`1px solid ${accent}50`:"1px solid transparent" }}
        onClick={e=>{e.stopPropagation();handleChipTap(label);}}>
        <div style={{ fontSize:9,fontWeight:700,color:C.t3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4 }}>{label}</div>
        <input
          type={type}
          value={value}
          readOnly={!unlocked}
          onChange={e=>unlocked && setter(e.target.value)}
          onBlur={()=>setUnlockedField(f=>f===label?null:f)}
          style={{ width:"100%",background:"transparent",border:"none",outline:"none",fontSize:16,fontWeight:900,color:done?accent:C.t1,textAlign:"center",fontFamily:"inherit",padding:0,MozAppearance:"textfield",cursor:unlocked?"text":"pointer" }}
        />
      </div>
    );
  };

  // ── Collapsed summary row (completed exercises) ──
  if (done && !expanded) {
    return (
      <div
        className="anim-fadeUp pressable"
        onClick={()=>setExpanded(true)}
        style={{
          borderRadius:0,
          border:`1px solid ${accent}30`,
          background:`${accent}08`,
          transition:"all 0.3s ease",
          animationDelay:`${idx*0.05}s`,
          cursor:"pointer",
          padding:"12px 16px",
          display:"flex",alignItems:"center",gap:12,
          ...style
        }}>
        <div style={{ width:28,height:28,borderRadius:0,flexShrink:0,background:`linear-gradient(135deg,${accent},${C.accentD})`,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2.5 7L5.5 10L11.5 4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ fontSize:14,fontWeight:700,color:accent,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{ex.name}</div>
        </div>
        <div style={{ fontSize:11,color:C.t3,fontWeight:600,flexShrink:0 }}>{sets}×{reps} · {weight}kg</div>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink:0,opacity:0.5 }}>
          <path d="M4 6L8 10L12 6" stroke={C.t3} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    );
  }

  return (
    <div
      className="anim-fadeUp pressable"
      onClick={handleToggle}
      style={{
        borderRadius:0,
        border:`1px solid ${done?`${accent}35`:C.s3}`,
        background:done?`${accent}08`:C.s1,
        transition:"all 0.3s ease",
        animationDelay:`${idx*0.05}s`,
        boxShadow:done?"none":"0 1px 4px rgba(0,0,0,0.03)",
        cursor:"pointer",
        overflow:"hidden",
        ...style
      }}>
      <div style={{ padding:"18px 18px" }}>
        {/* Header row */}
        <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:16 }}>
          {/* Index / check bubble */}
          <div style={{ width:36,height:36,borderRadius:0,flexShrink:0,background:done?`linear-gradient(135deg,${accent},${C.accentD})`:C.s2,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.25s" }}>
            {done?(
              <svg width="15" height="15" viewBox="0 0 14 14" fill="none"><path d="M2.5 7L5.5 10L11.5 4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ):(
              <span style={{ fontSize:13,fontWeight:800,color:C.t3 }}>{idx+1}</span>
            )}
          </div>
          {/* Name + chips row */}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:15,fontWeight:700,color:done?accent:C.t1,lineHeight:1.2,transition:"color 0.2s" }}>{ex.name}</div>
            <div style={{ display:"flex",alignItems:"center",gap:6,marginTop:6,flexWrap:"wrap" }}>
              {ex.muscle&&<Chip color={accent} style={{ fontSize:9,padding:"2px 8px" }}>{ex.muscle}</Chip>}
              {/* Editable machine chip */}
              <div onClick={e=>{e.stopPropagation();handleChipTap("machine");}} style={{ display:"flex",alignItems:"center",gap:3,background:C.s2,borderRadius:0,padding:"3px 9px",border:unlockedField==="machine"?`1px solid ${accent}50`:"1px solid transparent" }}>
                <span style={{ fontSize:9,fontWeight:700,color:C.t3 }}>Máq.</span>
                <input
                  type="number"
                  value={machine}
                  readOnly={unlockedField!=="machine"}
                  onChange={e=>unlockedField==="machine" && setMachine(e.target.value)}
                  onBlur={()=>setUnlockedField(f=>f==="machine"?null:f)}
                  style={{ width:28,background:"transparent",border:"none",outline:"none",fontSize:9,fontWeight:700,color:C.t2,fontFamily:"inherit",padding:0,MozAppearance:"textfield",textAlign:"left",cursor:unlockedField==="machine"?"text":"pointer" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info chips row — all editable, stop propagation */}
        <div style={{ display:"flex",gap:10,marginBottom:14 }}>
          {editableChip("Series", sets, setSets)}
          {editableChip("Reps", reps, setReps)}
          {editableChip("Peso kg", weight, setWeight)}
        </div>

        {/* Confirm button */}
        <button
          className={`pressable${popping ? " anim-confirmPop" : ""}`}
          onClick={e=>{e.stopPropagation();handleToggle();}}
          style={{
            width:"100%",border:"none",borderRadius:0,padding:"11px",
            fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT,
            background:done?`${accent}14`:`linear-gradient(135deg,${accent},${C.accentD})`,
            color:done?accent:"#fff",
            boxShadow:done?"none":`0 4px 14px ${accent}35`,
            transition:"all 0.25s ease",
          }}>
          {done ? "Completado" : "Confirmar"}
        </button>
      </div>
    </div>
  );
};

/* ── EXERCISE SCREEN ── */
const ALL_PRESET_EXERCISES = DEFAULT_ROUTINES.flatMap(r =>
  r.exercises.map(ex => ({ ...ex, _routineName: r.name, _routineEmoji: r.emoji, _routineColor: r.color }))
);

const ExerciseScreen = ({ routine, onBack }) => {
  const [doneSet,setDoneSet]=useState(new Set());
  const [exercises,setExercises]=useState(routine.exercises.map((e,i)=>({ ...e, _id:`base-${i}` })));
  const [showAdd,setShowAdd]=useState(false);
  const [addMode,setAddMode]=useState("preset"); // "preset" | "custom"
  const [presetSearch,setPresetSearch]=useState("");
  const [newName,setNewName]=useState("");
  const [newMuscle,setNewMuscle]=useState("");
  const [newMachine,setNewMachine]=useState("");
  const [newSets,setNewSets]=useState(3);
  const [newReps,setNewReps]=useState(12);
  const [newWeight,setNewWeight]=useState(0);

  const total=exercises.length;
  const doneCount=doneSet.size;
  const pct=total>0?doneCount/total:0;

  const handleToggle=(id,isDone)=>{
    setDoneSet(prev=>{
      const next=new Set(prev);
      isDone?next.add(id):next.delete(id);
      return next;
    });
  };

  const addExercise=(ex)=>{
    setExercises(prev=>[...prev,{ ...ex, _id:`ex-${Date.now()}-${Math.random().toString(36).slice(2,8)}` }]);
    setShowAdd(false);
    setPresetSearch("");
  };

  const handleAddCustom=()=>{
    if(!newName.trim())return;
    addExercise({
      name:newName.trim(), muscle:newMuscle.trim()||undefined,
      machine:newMachine!==""?Number(newMachine):undefined,
      sets:Number(newSets), reps:Number(newReps), weight:Number(newWeight),
    });
    setNewName(""); setNewMuscle(""); setNewMachine(""); setNewSets(3); setNewReps(12); setNewWeight(0);
  };

  const filteredPresets = presetSearch.trim()
    ? ALL_PRESET_EXERCISES.filter(ex =>
        ex.name.toLowerCase().includes(presetSearch.toLowerCase()) ||
        (ex.muscle||"").toLowerCase().includes(presetSearch.toLowerCase())
      )
    : ALL_PRESET_EXERCISES;

  const inputS={ background:C.s2,border:`1px solid ${C.s3}`,borderRadius:0,padding:"9px 12px",fontSize:14,color:C.t1,fontFamily:FONT,outline:"none",width:"100%" };
  const numS={ ...inputS,textAlign:"center",padding:"8px 6px" };

  return (
    <div className="anim-slideR" style={{ flex:1,display:"flex",flexDirection:"column",background:C.bg,fontFamily:FONT,overflow:"hidden" }}>
      {/* Header */}
      <div style={{ padding:"16px 20px 14px",background:C.bg,borderBottom:`1px solid ${C.s3}`,flexShrink:0 }}>
        <button className="pressable" onClick={onBack} style={{ background:"none",border:"none",display:"flex",alignItems:"center",gap:6,color:C.t2,fontSize:13,fontWeight:600,cursor:"pointer",padding:0,marginBottom:14,fontFamily:FONT }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9L11 14" stroke={C.t2} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Rutinas
        </button>
        <div style={{ display:"flex",alignItems:"center",gap:14 }}>
          <div style={{ width:48,height:48,borderRadius:0,flexShrink:0,background:`${routine.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",color:routine.color }}>{routine.name.slice(0,4)}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:22,fontWeight:900,color:C.t1,letterSpacing:"0.03em",fontFamily:FONT_DISPLAY,textTransform:"uppercase" }}>{routine.name}</div>
            <div style={{ fontSize:12,color:C.t2,marginTop:2 }}>{routine.duration} min · {total} ejercicios</div>
          </div>
          <Ring pct={pct} size={48} sw={4} color={routine.color} bg={C.s3}>
            <span style={{ fontSize:10,fontWeight:800,color:routine.color }}>{doneCount}/{total}</span>
          </Ring>
        </div>
        <div style={{ marginTop:14,height:5,borderRadius:0,background:C.s3,overflow:"hidden" }}>
          <div style={{ height:"100%",borderRadius:0,background:`linear-gradient(90deg,${routine.color},${routine.dark})`,width:`${pct*100}%`,transition:"width 0.5s cubic-bezier(.22,1,.36,1)" }}/>
        </div>
      </div>

      {/* List */}
      <div style={{ flex:1,overflowY:"auto",padding:"16px 20px 24px" }}>
        {exercises.map((ex,i)=>(
          <ExerciseRow key={ex._id} ex={ex} idx={i} accent={routine.color}
            onToggle={(isDone)=>handleToggle(ex._id,isDone)} style={{ marginBottom:14 }}/>
        ))}

        {/* ── Add exercise panel ── */}
        {showAdd ? (
          <div className="anim-slideDown" style={{ background:C.s1,borderRadius:0,marginBottom:10,border:`1.5px solid ${routine.color}30`,overflow:"hidden" }}>

            {/* Mode toggle tabs */}
            <div style={{ display:"flex",borderBottom:`1px solid ${C.s3}` }}>
              {[["preset","Presets"],["custom","Nuevo"]].map(([mode,label])=>(
                <button key={mode} onClick={()=>setAddMode(mode)} style={{
                  flex:1,padding:"12px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:FONT,border:"none",
                  background:addMode===mode?C.s1:C.s2,
                  color:addMode===mode?routine.color:C.t3,
                  borderBottom:addMode===mode?`2px solid ${routine.color}`:"2px solid transparent",
                  transition:"all 0.15s",
                }}>
                  {label}
                </button>
              ))}
            </div>

            {addMode==="preset" ? (
              <div style={{ padding:"14px" }}>
                {/* Search */}
                <input
                  style={{ ...inputS,marginBottom:10 }}
                  placeholder="Buscar ejercicio o músculo…"
                  value={presetSearch}
                  onChange={e=>setPresetSearch(e.target.value)}
                  autoFocus
                />
                {/* Preset list */}
                <div style={{ maxHeight:260,overflowY:"auto",display:"flex",flexDirection:"column",gap:6 }}>
                  {filteredPresets.length===0 && (
                    <div style={{ textAlign:"center",padding:"20px",color:C.t3,fontSize:13 }}>Sin resultados</div>
                  )}
                  {filteredPresets.map((ex,i)=>(
                    <div key={i} className="pressable" onClick={()=>addExercise(ex)}
                      style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:0,background:C.s2,border:`1px solid ${C.s3}`,cursor:"pointer",transition:"background 0.15s" }}>
                      <div style={{ width:32,height:32,borderRadius:0,background:`${ex._routineColor}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:ex._routineColor,flexShrink:0 }}>{ex._routineName.slice(0,3).toUpperCase()}</div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ fontSize:13,fontWeight:700,color:C.t1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{ex.name}</div>
                        <div style={{ fontSize:10,color:C.t3,marginTop:1 }}>{ex.muscle||""}{ex.machine!=null&&ex.machine>0?` · Máq. ${ex.machine}`:""} · {ex.sets}×{ex.reps} · {ex.weight}kg</div>
                      </div>
                      <div style={{ width:26,height:26,borderRadius:0,background:routine.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                        <span style={{ color:"#fff",fontSize:16,lineHeight:1,marginTop:-1 }}>+</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={()=>setShowAdd(false)} style={{ marginTop:12,width:"100%",background:C.s2,border:`1px solid ${C.s3}`,borderRadius:0,padding:"10px",fontSize:13,fontWeight:600,color:C.t2,cursor:"pointer",fontFamily:FONT }}>Cancelar</button>
              </div>
            ) : (
              <div style={{ padding:"14px" }}>
                <input style={{ ...inputS,marginBottom:8 }} placeholder="Nombre del ejercicio" value={newName} onChange={e=>setNewName(e.target.value)}/>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8 }}>
                  <input style={inputS} placeholder="Músculo (opcional)" value={newMuscle} onChange={e=>setNewMuscle(e.target.value)}/>
                  <input style={inputS} placeholder="Máquina #" type="number" value={newMachine} onChange={e=>setNewMachine(e.target.value)}/>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14 }}>
                  {[["Series",newSets,setNewSets],["Reps",newReps,setNewReps],["Peso kg",newWeight,setNewWeight]].map(([label,val,set])=>(
                    <div key={label} style={{ textAlign:"center" }}>
                      <div style={{ fontSize:9,fontWeight:700,color:C.t3,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4 }}>{label}</div>
                      <input type="number" style={numS} value={val} onChange={e=>set(e.target.value)}/>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex",gap:8 }}>
                  <button onClick={()=>setShowAdd(false)} style={{ flex:1,background:C.s2,border:`1px solid ${C.s3}`,borderRadius:0,padding:"10px",fontSize:13,fontWeight:600,color:C.t2,cursor:"pointer",fontFamily:FONT }}>Cancelar</button>
                  <button className="pressable" onClick={handleAddCustom} style={{ flex:2,background:routine.color,border:"none",borderRadius:0,padding:"10px",fontSize:13,fontWeight:700,color:"#fff",cursor:"pointer",fontFamily:FONT,boxShadow:`0 4px 14px ${routine.color}50` }}>Añadir</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button className="pressable" onClick={()=>{ setShowAdd(true); setAddMode("preset"); }}
            style={{ width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"none",border:`1.5px dashed ${C.s4}`,borderRadius:0,padding:"14px",fontSize:13,fontWeight:700,color:C.t3,cursor:"pointer",fontFamily:FONT,marginBottom:10 }}>
            <span style={{ fontSize:18,lineHeight:1 }}>+</span> Agregar ejercicio
          </button>
        )}

        {doneCount===total&&total>0&&(
          <div className="anim-slideUp" style={{ textAlign:"center",padding:"28px 20px 12px" }}>
            
            <div style={{ fontSize:28,fontWeight:900,color:C.t1,letterSpacing:"0.04em",fontFamily:FONT_DISPLAY,textTransform:"uppercase" }}>¡Rutina completada!</div>
            <div style={{ fontSize:14,color:C.t2,marginTop:6 }}>Más fuertes juntos hoy</div>
            <div style={{ marginTop:20,background:`linear-gradient(135deg,${routine.color},${routine.dark})`,borderRadius:0,padding:"18px",display:"flex",gap:24,justifyContent:"center",boxShadow:`0 12px 40px ${routine.color}35` }}>
              {[
                { label:"Tiempo",val:`${routine.duration} min` },
                { label:"Sets",val:`${exercises.reduce((a,e)=>a+(e.sets||0),0)}` },
                { label:"Ejercicios",val:`${total}` },
              ].map((m,i)=>(
                <div key={i} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:20,fontWeight:900,color:"#fff" }}>{m.val}</div>
                  <div style={{ fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.75)",textTransform:"uppercase",letterSpacing:"0.07em" }}>{m.label}</div>
                </div>
              ))}
            </div>
            <button className="pressable" onClick={onBack} style={{ marginTop:16,background:C.s1,border:`1px solid ${C.s3}`,borderRadius:0,padding:"12px 32px",fontSize:14,fontWeight:700,color:C.t1,cursor:"pointer",fontFamily:FONT }}>Volver a rutinas</button>
          </div>
        )}
      </div>
    </div>
  );
};

const TAB_ORDER = ["home", "routines", "stats"];
const TAB_W = 100 / TAB_ORDER.length; // each screen = 33.33% of the 300%-wide strip

/* ── SWIPE TAB CONTAINER ── */
const SwipeTabContainer = ({ tab, onTabChange, children }) => {
  const tabIdx = TAB_ORDER.indexOf(tab);
  const containerRef = useRef(null);
  const startX = useRef(null);
  const startY = useRef(null);
  const dx = useRef(0);
  // null = undecided, true = horizontal, false = vertical
  const direction = useRef(null);

  /* translateX of the strip: each step moves one screen width (= TAB_W%) */
  const baseTranslate = (idx, extraPx = 0) =>
    `translateX(calc(${idx * -TAB_W}% + ${extraPx}px))`;

  const applyTranslate = (extraPx = 0, animated = false) => {
    const el = containerRef.current;
    if (!el) return;
    el.style.transition = animated ? "transform 0.32s cubic-bezier(.22,1,.36,1)" : "none";
    el.style.transform = baseTranslate(tabIdx, extraPx);
  };

  // Snap to correct position whenever tab changes (TabBar tap or popstate)
  useEffect(() => { applyTranslate(0, true); }, [tab]); // eslint-disable-line

  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    dx.current = 0;
    direction.current = null;
    applyTranslate(0, false); // freeze, no CSS transition during drag
  };

  const onTouchMove = (e) => {
    if (startX.current === null) return;
    const moveX = e.touches[0].clientX - startX.current;
    const moveY = e.touches[0].clientY - startY.current;

    // Lock direction on first decisive move (> 8px either axis)
    if (direction.current === null && (Math.abs(moveX) > 8 || Math.abs(moveY) > 8)) {
      direction.current = Math.abs(moveX) >= Math.abs(moveY) ? "h" : "v";
    }
    if (direction.current !== "h") return; // vertical scroll — hands off

    e.preventDefault(); // prevent page scroll while swiping tabs

    // Rubber-band at edges
    const atLeft  = tabIdx === 0 && moveX > 0;
    const atRight = tabIdx === TAB_ORDER.length - 1 && moveX < 0;
    dx.current = (atLeft || atRight) ? moveX * 0.18 : moveX;

    applyTranslate(dx.current, false);
  };

  const onTouchEnd = () => {
    if (direction.current !== "h") { direction.current = null; return; }

    const THRESHOLD = window.innerWidth * 0.28;
    if      (dx.current < -THRESHOLD && tabIdx < TAB_ORDER.length - 1) onTabChange(TAB_ORDER[tabIdx + 1]);
    else if (dx.current >  THRESHOLD && tabIdx > 0)                     onTabChange(TAB_ORDER[tabIdx - 1]);
    else                                                                  applyTranslate(0, true);

    startX.current = null;
    dx.current = 0;
    direction.current = null;
  };

  return (
    <div style={{ flex:1, overflow:"hidden", position:"relative", display:"flex", flexDirection:"column" }}>
      <div
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          display:"flex",
          flexDirection:"row",
          width:`${TAB_ORDER.length * 100}%`,  // 300vw total
          height:"100%",
          transform: baseTranslate(tabIdx),
          willChange:"transform",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* ── EXIT CONFIRM MODAL ── */
const ExitConfirmModal = ({ onConfirm, onCancel }) => (
  <div
    className="anim-fadeIn"
    onClick={onCancel}
    style={{
      position:"fixed", inset:0, zIndex:600,
      background:"rgba(249,243,234,0.72)",
      backdropFilter:"blur(12px)",
      display:"flex", alignItems:"flex-end", justifyContent:"center",
      paddingBottom:"env(safe-area-inset-bottom,0px)",
      fontFamily:FONT,
    }}
  >
    <div
      className="anim-slideUp"
      onClick={e=>e.stopPropagation()}
      style={{
        width:"100%", maxWidth:480,
        background:C.s1,
        borderRadius:0,
        padding:"28px 24px 32px",
        boxShadow:"0 -12px 48px rgba(0,0,0,0.4)",
      }}
    >
      {/* Drag handle */}
      <div style={{ width:36, height:4, borderRadius:0, background:C.s3, margin:"0 auto 22px" }}/>

      {/* Icon */}
      <div style={{
        width:56, height:56, borderRadius:0, margin:"0 auto 16px",
        background:C.pinkS,
        border:`1.5px solid ${C.pink}40`,
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:`0 4px 16px ${C.pink}30`,
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={C.pink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="16 17 21 12 16 7" stroke={C.pink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="21" y1="12" x2="9" y2="12" stroke={C.pink} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:20, fontWeight:800, color:C.t1, letterSpacing:"-0.3px" }}>
          ¿Salir de WeLiftTogether?
        </div>
        <div style={{ fontSize:14, color:C.t3, marginTop:6, lineHeight:1.5 }}>
          Tu progreso está guardado. Puedes volver en cualquier momento.
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <button
          className="pressable"
          onClick={onConfirm}
          style={{
            width:"100%", padding:"14px", border:"none", borderRadius:0,
            background:`linear-gradient(135deg,${C.accent},${C.accentD})`,
            color:"#fff", fontSize:15, fontWeight:700,
            cursor:"pointer", fontFamily:FONT,
            boxShadow:`0 6px 20px ${C.accent}55`,
          }}
        >
          Salir
        </button>
        <button
          className="pressable"
          onClick={onCancel}
          style={{
            width:"100%", padding:"14px", border:`1.5px solid ${C.s3}`,
            borderRadius:0, background:C.s2,
            color:C.t2, fontSize:15, fontWeight:700,
            cursor:"pointer", fontFamily:FONT,
          }}
        >
          Quedarme aquí
        </button>
      </div>
    </div>
  </div>
);

/* ── ROOT ── */
export default function App() {
  useGlobalStyles();
  const [routines,setRoutines]=useState(DEFAULT_ROUTINES);
  const [todayRoutine,setTodayRoutine]=useState(DEFAULT_ROUTINES[0]);
  const [profile,setProfile]=useState({ name:"Ricardo",partner:"Arline",emoji:"" });

  /* ── SCREEN STACK ──
     screen values: "home" | "routines" | "stats" | "exercise" | "editProfile"
     modal values (overlay over tabs): "startConfirm" | "routinePicker" | "lightbox"
     Each navigation pushes { screen, tab, routineId, modal, modalData } into history.
     popstate restores whatever state is in event.state.
  */
  const [tab,       setTab]       = useState("home");
  const [screen,    setScreen]    = useState("tab");   // "tab" | "exercise"
  const [modal,     setModal]     = useState(null);    // null | "startConfirm" | "routinePicker" | "lightbox" | "exitConfirm"
  const [modalData, setModalData] = useState(null);
  const [activeRoutine, setActiveRoutine] = useState(null);

  // Seed history: push a sentinel first, then the real root entry.
  // This ensures there is always an entry BEHIND the root so Android's
  // hardware back pops to the sentinel (intercepted below) rather than
  // minimising/closing the app with no warning.
  useEffect(() => {
    window.history.replaceState({ _sentinel: true }, "");           // slot 0
    window.history.pushState({ screen:"tab", tab:"home", modal:null }, ""); // slot 1
  }, []);

  // Single popstate handler — restores full app state from history entry.
  // When Android back reaches the sentinel, re-push the root entry and show
  // the exit-confirmation dialog so the user can consciously close the app.
  useEffect(() => {
    const onPop = (e) => {
      const s = e.state;

      // ── Sentinel hit: hardware back pressed at app root ──
      if (!s || s._sentinel) {
        // Always keep something in front of the sentinel
        window.history.pushState({ screen:"tab", tab:"home", modal:null }, "");
        setModal("exitConfirm");
        setModalData(null);
        return;
      }

      setTab(s.tab || "home");
      setScreen(s.screen || "tab");
      setModal(s.modal || null);
      setModalData(s.modalData || null);
      if (s.screen === "exercise") {
        const r = routines.find(r => r.id === s.routineId);
        if (r) setActiveRoutine(r);
      } else {
        setActiveRoutine(null);
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [routines]);

  // Push a new state into history
  const pushState = useCallback((patch) => {
    const current = window.history.state || {};
    const next = { ...current, ...patch };
    window.history.pushState(next, "");
  }, []);

  /* ── NAV ACTIONS ── */
  const goTab = (id) => {
    setTab(id);
    setScreen("tab");
    setModal(null);
    setActiveRoutine(null);
    pushState({ screen:"tab", tab:id, modal:null, routineId:null });
  };

  const goExercise = (r) => {
    const target = r || routines[0];
    setActiveRoutine(target);
    setScreen("exercise");
    setModal(null);
    pushState({ screen:"exercise", tab, routineId:target.id, modal:null });
  };

  const goBack = () => window.history.back();

  // Deterministic modal dismissal — pushes a state with modal:null on top of
  // the CURRENT known tab/screen, instead of relying on history.back() (which
  // depends on whatever happens to sit behind the modal entry and can land
  // on the wrong tab if other navigations were pushed in between).
  const dismissModal = () => {
    setModal(null);
    setModalData(null);
    pushState({ screen, tab, modal:null, modalData:null });
  };

  const openModal = (name, data=null) => {
    setModal(name);
    setModalData(data);
    pushState({ modal:name, modalData:data });
  };

  const closeModal = () => {
    // Don't call goBack() — just pop so Android back also works
    window.history.back();
  };

  const handleUpdateRoutines = (updater) => {
    setRoutines(prev => {
      const next = updater(prev);
      const updated = next.find(r => r.id === todayRoutine.id);
      if (updated) setTodayRoutine(updated);
      return next;
    });
  };

  // Called when user taps "Salir" in the exit confirmation dialog.
  // Pop twice: once to get off the re-pushed root, once to reach the sentinel,
  // and a final go-back so Android closes the app naturally.
  const confirmExit = () => {
    setModal(null);
    // history stack at this point: [sentinel, root(re-pushed)]
    // We need to pop back through the sentinel so Android takes over.
    window.history.go(-2);
  };

  const cancelExit = () => {
    setModal(null);
    setModalData(null);
  };

  const showExercise = screen === "exercise";

  return (
    <div style={{ width:"100vw",height:"100vh",height:"100dvh",background:C.bg,display:"flex",flexDirection:"column",overflow:"hidden",fontFamily:FONT,paddingTop:"env(safe-area-inset-top,0px)" }}>

      {/* ── Root-level modals — outside SwipeTabContainer so fixed positioning is never clipped ── */}
      {modal==="exitConfirm" && (
        <ExitConfirmModal onConfirm={confirmExit} onCancel={cancelExit}/>
      )}
      {modal==="editProfile" && (
        <EditProfileModal profile={profile} onSave={setProfile} onClose={closeModal}/>
      )}
      {modal==="routinePicker" && (
        <RoutinePickerModal routines={routines} current={todayRoutine}
          onSelect={(r)=>setTodayRoutine(r)}
          onClose={dismissModal}/>
      )}
      {modal==="startConfirm" && (
        <StartWorkoutModal
          routine={modalData || todayRoutine}
          onConfirm={()=>goExercise(modalData || todayRoutine)}
          onClose={closeModal}/>
      )}
      {modal==="lightbox" && modalData && (
        <PhotoLightbox photo={modalData} onClose={closeModal}
          onDelete={(photo)=>{
            closeModal();
          }}/>
      )}

      <div style={{ flex:1,overflow:"hidden",display:"flex",flexDirection:"column" }}>
        {showExercise ? (
          <ExerciseScreen routine={activeRoutine} onBack={goBack}/>
        ) : (
          <SwipeTabContainer tab={tab} onTabChange={goTab}>
            <div style={{ width:`${TAB_W}%`, height:"100%", flexShrink:0, overflow:"hidden", display:"flex", flexDirection:"column" }}>
              <HomeScreen
                onStartWorkout={()=>goExercise(todayRoutine)}
                routines={routines}
                todayRoutine={todayRoutine}
                onOpenRoutinePicker={()=>openModal("routinePicker")}
                onOpenLightbox={(photo)=>openModal("lightbox", photo)}
                onOpenStartConfirm={()=>goExercise(todayRoutine)}
                onChangeTodayRoutine={setTodayRoutine}
                onGoStats={()=>goTab("stats")}
              />
            </div>
            <div style={{ width:`${TAB_W}%`, height:"100%", flexShrink:0, overflow:"hidden", display:"flex", flexDirection:"column" }}>
              <RoutinesScreen routines={routines}
                onSelect={(r)=>openModal("startConfirm", r)}
                onUpdateRoutines={handleUpdateRoutines}/>
            </div>
            <div style={{ width:`${TAB_W}%`, height:"100%", flexShrink:0, overflow:"hidden", display:"flex", flexDirection:"column" }}>
              <StatsScreen/>
            </div>
          </SwipeTabContainer>
        )}
      </div>
      {!showExercise&&<TabBar active={tab} onTab={goTab}/>}
    </div>
  );
}
