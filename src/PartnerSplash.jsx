// ── PartnerSplash.jsx ─────────────────────────────────────────────────────
// Shown once at app launch (or when no partner session is active).
// Lets users create a partner code or join an existing one.
// The visual style matches GymApp's existing Cotton Beige / Sorbet Orange palette.
//
// Usage in App.jsx:
//   import { PartnerSplash } from './PartnerSplash';
//   ...
//   {showSplash && <PartnerSplash onDismiss={() => setShowSplash(false)} />}
//
// showSplash logic (in App.jsx root):
//   const SPLASH_KEY = 'wlt_splash_seen';
//   const [showSplash, setShowSplash] = useState(
//     !isPartnerSession() && !localStorage.getItem(SPLASH_KEY)
//   );
//   const handleDismiss = () => {
//     localStorage.setItem(SPLASH_KEY, '1');
//     setShowSplash(false);
//   };

import { useState, useEffect, useRef } from 'react';
import {
  isPartnerSession,
  currentSessionCode,
  createPartnerCode,
  joinPartnerSession,
} from './gymSessionId';

// ── Design tokens (must match App.jsx) ───────────────────────────────────────
const C = {
  bg:      '#F9F3EA',
  s1:      '#F3EBE0',
  s2:      '#EDE3D6',
  s3:      '#DDD0C0',
  s4:      '#C9B89E',
  accent:  '#FFA552',
  accentD: '#E8893A',
  accentL: '#FFBF7A',
  pink:    '#FF8C2A',
  pinkD:   '#E07020',
  t1:      '#2D1F0F',
  t2:      '#8B6A4A',
  t3:      '#B8936A',
};
const FONT         = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_DISPLAY = "'Barlow Condensed', 'Inter', sans-serif";

// ── Dumbbell SVG icon ─────────────────────────────────────────────────────────
const DumbbellIcon = ({ size = 48, color = C.accent }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="18" y="21" width="12" height="6" rx="3" fill={color} opacity="0.9"/>
    <rect x="6"  y="17" width="6"  height="14" rx="3" fill={color}/>
    <rect x="36" y="17" width="6"  height="14" rx="3" fill={color}/>
    <rect x="10" y="19" width="8"  height="10" rx="2.5" fill={color} opacity="0.75"/>
    <rect x="30" y="19" width="8"  height="10" rx="2.5" fill={color} opacity="0.75"/>
  </svg>
);

// ── Pair of rings / link icon (create session) ────────────────────────────────
const LinkIcon = ({ size = 20, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── PartnerSplash ─────────────────────────────────────────────────────────────
export function PartnerSplash({ onDismiss }) {
  const [step, setStep] = useState('intro');  // 'intro' | 'create' | 'join'
  const [code, setCode] = useState('');       // for "join" input
  const [myCode, setMyCode] = useState('');   // generated code after "create"
  const [copied, setCopied] = useState(false);
  const [joinErr, setJoinErr] = useState('');
  const inputRef = useRef(null);

  // Auto-focus join input when step changes
  useEffect(() => {
    if (step === 'join') setTimeout(() => inputRef.current?.focus(), 200);
  }, [step]);

  const handleCreate = () => {
    const generated = createPartnerCode();
    setMyCode(generated);
    setStep('create');
  };

  const handleShare = () => {
    const msg = `¡Entrenemos juntos! Únete a mi sesión en WeLiftTogether con el código: ${myCode}`;
    if (navigator.share) {
      navigator.share({ text: msg }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(myCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
    }
  };

  const handleJoin = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) { setJoinErr('Ingresa un código primero'); return; }
    const ok = joinPartnerSession(trimmed);
    if (!ok) { setJoinErr('Código inválido'); return; }
    localStorage.setItem('wlt_splash_seen', '1');
    // Reload so SYNC_ID (computed once on module load) picks up the new code
    window.location.reload();
  };

  const handleContinueSolo = () => {
    onDismiss();
  };

  const handleContinueWithCode = () => {
    localStorage.setItem('wlt_splash_seen', '1');
    // Code was created and saved — reload so all DB calls use it
    window.location.reload();
  };

  // ── Base overlay ────────────────────────────────────────────────────────────
  return (
    <div
      className="anim-fadeIn"
      style={{
        position: 'fixed', inset: 0, zIndex: 700,
        background: 'rgba(45,31,15,0.72)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        fontFamily: FONT,
        paddingBottom: 'env(safe-area-inset-bottom,0px)',
      }}
    >
      <div
        className="anim-slideUp"
        style={{
          width: '100%', maxWidth: 480,
          background: C.bg,
          borderRadius: '28px 28px 0 0',
          padding: '0 24px 32px',
          boxShadow: '0 -12px 56px rgba(0,0,0,0.45)',
          border: `1px solid ${C.s3}`,
          overflow: 'hidden',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: C.s4 }}/>
        </div>

        {/* ── INTRO STEP ── */}
        {step === 'intro' && (
          <>
            {/* Header gradient strip */}
            <div style={{
              margin: '18px -24px 0',
              padding: '28px 24px 24px',
              background: `linear-gradient(135deg,${C.pink} 0%,${C.accent} 60%,${C.accentL} 100%)`,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Decorative rings */}
              <div style={{ position:'absolute',top:-20,right:-20,width:100,height:100,borderRadius:'50%',background:'rgba(255,255,255,0.07)',pointerEvents:'none'}}/>
              <div style={{ position:'absolute',bottom:-30,left:-10,width:80,height:80,borderRadius:'50%',background:'rgba(255,255,255,0.05)',pointerEvents:'none'}}/>

              <div style={{ marginBottom: 14 }}>
                <DumbbellIcon size={52} color="rgba(255,255,255,0.95)"/>
              </div>
              <div style={{
                fontSize: 28, fontWeight: 900, color: '#fff',
                fontFamily: FONT_DISPLAY,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                lineHeight: 1.1, marginBottom: 8,
                textShadow: '0 2px 8px rgba(80,30,0,0.3)',
              }}>
                ¿Entrenamos juntos?
              </div>
              <div style={{
                fontSize: 13, color: 'rgba(255,255,255,0.82)',
                fontWeight: 500, lineHeight: 1.5,
              }}>
                Comparte una sesión con tu pareja o compañero de gym.
                Ambos ven el mismo historial, rutinas y fotos — sin login.
              </div>
            </div>

            {/* CTA buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>

              {/* Primary: generate code */}
              <button
                className="pressable"
                onClick={handleCreate}
                style={{
                  width: '100%', border: 'none', borderRadius: 20, padding: '16px',
                  background: `linear-gradient(135deg,${C.pink},${C.accentD})`,
                  color: '#fff', fontSize: 15, fontWeight: 800,
                  cursor: 'pointer', fontFamily: FONT_DISPLAY,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  boxShadow: `0 8px 24px ${C.pink}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                }}
              >
                <LinkIcon size={18} color="#fff"/>
                Generar experiencia compartida
              </button>

              {/* Secondary: join existing */}
              <button
                className="pressable"
                onClick={() => setStep('join')}
                style={{
                  width: '100%', border: `1.5px solid ${C.s3}`, borderRadius: 20,
                  padding: '15px', background: C.s1,
                  color: C.t1, fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', fontFamily: FONT,
                }}
              >
                Tengo un código — unirme
              </button>

              {/* Ghost: solo */}
              <button
                onClick={handleContinueSolo}
                style={{
                  width: '100%', border: 'none', background: 'none',
                  padding: '10px', borderRadius: 16,
                  color: C.t3, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: FONT,
                }}
              >
                Continuar solo por ahora
              </button>
            </div>
          </>
        )}

        {/* ── CREATE STEP — code generated ── */}
        {step === 'create' && (
          <>
            <div style={{ textAlign: 'center', padding: '22px 0 8px' }}>
              {/* Success checkmark */}
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: `${C.accent}18`,
                border: `1.5px solid ${C.accent}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: `0 4px 20px ${C.accent}30`,
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                    stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                    stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div style={{ fontSize: 20, fontWeight: 800, color: C.t1, marginBottom: 6 }}>
                ¡Sesión creada!
              </div>
              <div style={{ fontSize: 13, color: C.t2, lineHeight: 1.5, marginBottom: 20 }}>
                Comparte este código con tu compañero.<br/>
                Cuando se una, ambos verán el mismo gym.
              </div>

              {/* Code display */}
              <div style={{
                background: C.s1, border: `1.5px solid ${C.accent}50`,
                borderRadius: 20, padding: '18px 20px',
                marginBottom: 20,
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: C.t3,
                  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8,
                }}>
                  Código de sesión
                </div>
                <div style={{
                  fontSize: 32, fontWeight: 900, color: C.accent,
                  letterSpacing: '0.08em', fontFamily: 'monospace',
                }}>
                  {myCode}
                </div>
                <div style={{ fontSize: 11, color: C.t3, marginTop: 6 }}>
                  Dictalo, copialo o compártelo por mensaje
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                className="pressable"
                onClick={handleShare}
                style={{
                  width: '100%', border: `1.5px solid ${C.s3}`, borderRadius: 20,
                  padding: '14px', background: C.s1,
                  color: C.t1, fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', fontFamily: FONT,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {copied ? '✓ Copiado' : '📋 Compartir código'}
              </button>

              <button
                className="pressable"
                onClick={handleContinueWithCode}
                style={{
                  width: '100%', border: 'none', borderRadius: 20, padding: '15px',
                  background: `linear-gradient(135deg,${C.pink},${C.accentD})`,
                  color: '#fff', fontSize: 15, fontWeight: 800,
                  cursor: 'pointer', fontFamily: FONT_DISPLAY,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  boxShadow: `0 6px 22px ${C.pink}50`,
                }}
              >
                Entrar al gym juntos →
              </button>
            </div>
          </>
        )}

        {/* ── JOIN STEP ── */}
        {step === 'join' && (
          <>
            <div style={{ padding: '22px 0 8px' }}>
              <button
                onClick={() => setStep('intro')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: C.t3, fontSize: 13, fontWeight: 600, fontFamily: FONT,
                  marginBottom: 16, padding: 0,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 4L6 8L10 12" stroke={C.t3} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Atrás
              </button>

              <div style={{ fontSize: 20, fontWeight: 800, color: C.t1, marginBottom: 6 }}>
                Unirse a una sesión
              </div>
              <div style={{ fontSize: 13, color: C.t2, marginBottom: 22, lineHeight: 1.5 }}>
                Ingresa el código que te compartió tu compañero de gym.
              </div>

              {/* Code input */}
              <div style={{ marginBottom: 8 }}>
                <input
                  ref={inputRef}
                  value={code}
                  onChange={e => { setCode(e.target.value); setJoinErr(''); }}
                  placeholder="GYM-7F3K"
                  maxLength={9}
                  style={{
                    width: '100%', background: C.s2, border: `1.5px solid ${joinErr ? '#E07070' : C.s3}`,
                    borderRadius: 16, padding: '14px 18px',
                    fontSize: 22, fontWeight: 900, color: C.t1,
                    fontFamily: 'monospace', letterSpacing: '0.06em',
                    textTransform: 'uppercase', outline: 'none',
                    textAlign: 'center', boxSizing: 'border-box',
                    transition: 'border-color 0.15s',
                  }}
                  onKeyDown={e => e.key === 'Enter' && handleJoin()}
                />
                {joinErr && (
                  <div style={{ fontSize: 12, color: '#C0392B', fontWeight: 600, marginTop: 6, textAlign: 'center' }}>
                    {joinErr}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                className="pressable"
                onClick={handleJoin}
                style={{
                  width: '100%', border: 'none', borderRadius: 20, padding: '15px',
                  background: code.trim()
                    ? `linear-gradient(135deg,${C.pink},${C.accentD})`
                    : C.s3,
                  color: '#fff', fontSize: 15, fontWeight: 800,
                  cursor: code.trim() ? 'pointer' : 'default',
                  fontFamily: FONT_DISPLAY,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  boxShadow: code.trim() ? `0 6px 22px ${C.pink}50` : 'none',
                  transition: 'background 0.2s, box-shadow 0.2s',
                }}
              >
                Unirse
              </button>
              <button
                onClick={handleContinueSolo}
                style={{
                  width: '100%', border: 'none', background: 'none',
                  padding: '10px', borderRadius: 16,
                  color: C.t3, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: FONT,
                }}
              >
                Continuar solo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
