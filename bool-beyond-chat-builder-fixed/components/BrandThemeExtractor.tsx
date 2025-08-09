'use client';
import React, { useRef, useState } from 'react';
import ColorThief from 'colorthief';

type ThemeTokens = {
  primary: string;
  secondary: string;
  neutral: string;
  accent: string;
  text: string;
};

export default function BrandThemeExtractor({ onTheme }: { onTheme: (t: ThemeTokens)=>void }) {
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const imgRef = useRef<HTMLImageElement|null>(null);

  const applyTheme = (palette: number[][]) => {
    const toHex = (rgb: number[]) => '#' + rgb.map(c => c.toString(16).padStart(2,'0')).join('');
    const [p, s, n, a] = [
      toHex(palette[0] || [226,30,43]),
      toHex(palette[1] || [17,17,17]),
      toHex(palette[2] || [246,246,246]),
      toHex(palette[3] || [138,138,138]),
    ];
    const t: ThemeTokens = { primary: p, secondary: s, neutral: n, accent: a, text: '#ffffff' };
    // update CSS vars
    const root = document.documentElement;
    root.style.setProperty('--color-primary', t.primary);
    root.style.setProperty('--color-secondary', t.secondary);
    root.style.setProperty('--color-neutral', t.neutral);
    root.style.setProperty('--color-accent', t.accent);
    onTheme(t);
  };

  const handleLogoFile = async (file: File) => {
    setBusy(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = reader.result as string;
        img.onload = () => {
          const thief = new ColorThief();
          const palette = thief.getPalette(img, 6);
          applyTheme(palette as any);
          setBusy(false);
        };
      };
      reader.readAsDataURL(file);
    } catch (e) {
      setBusy(false);
      alert('Failed to extract colors. Using defaults.');
      applyTheme([] as any);
    }
  };

  const handleWebsite = async () => {
    // Simple heuristic: fetch favicon.ico (client cannot fetch cross-origin image reliably).
    // We prompt user to paste a direct logo URL if favicon fails.
    if (!url) return;
    setBusy(true);
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url; // expect direct logo URL
    img.onload = () => {
      const thief = new ColorThief();
      const palette = thief.getPalette(img, 6);
      applyTheme(palette as any);
      setBusy(false);
    };
    img.onerror = () => {
      setBusy(false);
      alert('Could not load image. Paste a direct logo/image URL.');
    };
  };

  return (
    <div className="card p-4 space-y-3">
      <h3 className="text-lg font-semibold">Theme from your brand</h3>
      <p className="text-sm text-neutral-300">Upload a logo or paste a direct logo image URL. We’ll extract colors.</p>
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={e => e.target.files && handleLogoFile(e.target.files[0])}
          className="text-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          value={url}
          onChange={e=>setUrl(e.target.value)}
          placeholder="https://your-site.com/logo.png"
          className="w-full rounded-xl px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-sm"
        />
        <button className="btn btn-primary" onClick={handleWebsite} disabled={busy}>Use URL</button>
      </div>
      <div className="flex gap-2 text-xs text-neutral-400">
        <span className="badge" style={{background:'var(--color-primary)'}}>Primary</span>
        <span className="badge" style={{background:'var(--color-secondary)'}}>Secondary</span>
        <span className="badge" style={{background:'var(--color-accent)'}}>Accent</span>
      </div>
      {busy && <p className="text-xs text-neutral-400">Extracting palette…</p>}
      <img ref={imgRef} alt="" style={{display:'none'}} />
    </div>
  );
}
