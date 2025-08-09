'use client';
import React, { useState } from 'react';
import ColorThief from 'colorthief';

type ThemeTokens = {
  primary: string;
  secondary: string;
  neutral: string;
  accent: string;
  text: string;
};

function luminance(hex: string) {
  const c = hex.replace('#','');
  const r = parseInt(c.slice(0,2),16)/255;
  const g = parseInt(c.slice(2,4),16)/255;
  const b = parseInt(c.slice(4,6),16)/255;
  const srgb = [r,g,b].map(v=> (v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055, 2.4)));
  return 0.2126*srgb[0] + 0.7152*srgb[1] + 0.0722*srgb[2];
}
function contrast(hex1: string, hex2: string) {
  const L1 = luminance(hex1), L2 = luminance(hex2);
  const [hi, lo] = L1>=L2 ? [L1,L2] : [L2,L1];
  return (hi + 0.05) / (lo + 0.05);
}
const toHex = (rgb: number[]) => '#' + rgb.map(c => c.toString(16).padStart(2,'0')).join('');

export default function BrandThemeExtractor({ onTheme }: { onTheme: (t: ThemeTokens)=>void }) {
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [ratio, setRatio] = useState<number|null>(null);

  const applyTheme = (palette: number[][]) => {
    const [p, s, n, a] = [
      toHex(palette?.[0] || [226,30,43]),
      toHex(palette?.[1] || [17,17,17]),
      toHex(palette?.[2] || [246,246,246]),
      toHex(palette?.[3] || [138,138,138]),
    ];
    const t: ThemeTokens = { primary: p, secondary: s, neutral: n, accent: a, text: '#ffffff' };
    const root = document.documentElement;
    root.style.setProperty('--color-primary', t.primary);
    root.style.setProperty('--color-secondary', t.secondary);
    root.style.setProperty('--color-neutral', t.neutral);
    root.style.setProperty('--color-accent', t.accent);
    setRatio(contrast(t.primary, '#ffffff'));
    onTheme(t);
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({event:'theme_applied', theme:t});
    console.log('[metrics] theme_applied', t);
  };

  const handleLogoFile = async (file: File) => {
    setBusy(true);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = reader.result as string;
      img.onload = () => {
        try {
          const thief = new ColorThief();
          const palette = thief.getPalette(img, 6) as any;
          applyTheme(palette);
        } catch {
          applyTheme([] as any);
        } finally {
          setBusy(false);
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const handleWebsite = async () => {
    if (!url) return;
    setBusy(true);
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url; // expects direct logo image URL
    img.onload = () => {
      try {
        const thief = new ColorThief();
        const palette = thief.getPalette(img, 6) as any;
        applyTheme(palette);
      } catch {
        applyTheme([] as any);
      } finally {
        setBusy(false);
      }
    };
    img.onerror = () => { setBusy(false); alert('Could not load image. Paste a direct logo image URL.'); };
  };

  return (
    <div className="card p-4 space-y-3">
      <h3 className="text-lg font-semibold">Theme from your brand</h3>
      <p className="text-sm text-neutral-300">Upload a logo or paste a direct logo image URL. We’ll extract colors.</p>
      <div className="flex items-center gap-2">
        <input type="file" accept="image/*" onChange={e => e.target.files && handleLogoFile(e.target.files[0])} className="text-sm"/>
      </div>
      <div className="flex items-center gap-2">
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://your-site.com/logo.png"
          className="w-full rounded-xl px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-sm" />
        <button className="btn btn-primary" onClick={handleWebsite} disabled={busy}>Use URL</button>
      </div>
      <div className="flex gap-2 text-xs text-neutral-400">
        <span className="badge" style={{background:'var(--color-primary)'}}>Primary</span>
        <span className="badge" style={{background:'var(--color-secondary)'}}>Secondary</span>
        <span className="badge" style={{background:'var(--color-accent)'}}>Accent</span>
      </div>
      {ratio && (
        <p className="text-xs">
          Contrast (primary on white): <b>{ratio.toFixed(2)}:1</b> — {ratio>=4.5 ? 'Pass AA' : 'Adjust for AA'}
        </p>
      )}
      {busy && <p className="text-xs text-neutral-400">Extracting palette…</p>}
    </div>
  );
}
