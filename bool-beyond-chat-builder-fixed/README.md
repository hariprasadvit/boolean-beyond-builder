# Boolean & Beyond — Conversational Prototype Builder (MVP)

A minimal Next.js 14 + Tailwind CSS app with:
- Chat-driven requirement capture
- Brand theme extractor (from logo image URL or file)
- Real Estate Plot Booking demo (hold + booking flow in test mode)
- Requirement Sheet PDF export (client-side jsPDF)

## Local (optional)
```bash
npm install
npm run dev
```

## One-click Deploy (Vercel)
1) Go to https://vercel.com and sign in.
2) Create a **New Project** → "Import from GitHub" (after pushing this repo), or use "Deploy from CLI" if preferred.
3) Vercel auto-detects Next.js; click **Deploy**.
4) Open your new URL: `https://your-project-name.vercel.app`

> If you don't want to use Git, you can upload the zip in Vercel: New Project → "Import" → "Add New..." → "Upload".

## Routes
- `/` — Homepage + floating chat builder
- `/demos/real-estate/plot-booking` — Plot booking demo
- `/api/intake` — Mock form endpoint (logs payload)

## Notes
- The logo/URL color extraction uses ColorThief. Direct logo image URLs work best.
- The PDF is generated client-side and downloaded.
- Payments are **not** processed; demo only.
