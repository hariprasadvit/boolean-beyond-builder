'use client';
import React, { useEffect, useState } from 'react';
import BrandThemeExtractor from './BrandThemeExtractor';
import { jsPDF } from 'jspdf';

type Answers = {
  industry?: string;
  problem?: string;
  solution?: string;
  company?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  multiProject?: string;
  unitTypes?: string;
  pricingVisibility?: string;
  payment?: string;
  holdLogic?: string;
  roles?: string;
  integrations?: string;
  goLive?: string;
  themeTokens?: any;
};

const INDUSTRIES = ['Real Estate','FinTech','EdTech','Healthcare','Retail','Logistics','Other'];
const REAL_ESTATE_PROBLEMS = ['Plot blocking & booking','Site visit scheduling','Payments & invoicing','CRM for leads'];

export default function ChatFlow() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState<Answers>({});
  const [sent, setSent] = useState(false);

  const go = (n:number)=> setStep(n);

  // expose prefill so industry cards can jump into the flow
  useEffect(()=>{
    (window as any).openChat = ()=> setOpen(true);
    (window as any).prefillIndustry = (i:string)=> { setOpen(true); setAns(a=>({...a, industry:i})); setStep(1); };
  },[]);

  const validateStep4 = () => {
    if (!ans.company || !ans.contactName || !ans.email) return false;
    return true;
  };

  const buildPayload = () => ({
    ...ans,
    answers: ans,
    demoUrl: '/demos/real-estate/plot-booking',
    timestamp: new Date().toISOString()
  });

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Requirement Sheet — Boolean & Beyond', 14, 18);
    doc.setFontSize(11);
    const lines = [
      `Industry: ${ans.industry||''}`,
      `Problem: ${ans.problem||''}`,
      `Solution: ${ans.solution||''}`,
      `Company: ${ans.company||''}`,
      `Contact: ${ans.contactName||''}`,
      `Email: ${ans.email||''}  Phone: ${ans.phone||''}`,
      `Multi-Project: ${ans.multiProject||''}`,
      `Unit Types: ${ans.unitTypes||''}`,
      `Pricing Visibility: ${ans.pricingVisibility||''}`,
      `Payment: ${ans.payment||''}`,
      `Hold Logic: ${ans.holdLogic||''}`,
      `Roles: ${ans.roles||''}`,
      `Integrations: ${ans.integrations||''}`,
      `Go-live: ${ans.goLive||''}`
    ];
    let y = 30;
    lines.forEach(l=> { doc.text(l, 14, y); y+=8; });
    doc.save('Requirement-Sheet.pdf');
  };

  const sendToUs = async () => {
    const res = await fetch('/api/intake', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(buildPayload())
    });
    const ok = res.ok;
    setSent(ok);
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({event:'lead_submitted', ok});
    console.log('[metrics] lead_submitted', ok);
  };

  return (
    <div>
      {/* Trigger button */}
      <button
        className="fixed bottom-6 right-6 btn btn-primary shadow-soft"
        onClick={()=>{ setOpen(v=>!v); if (!open) console.log('[metrics] chat_started'); }}
        aria-label="Open chat builder"
      >
        {open ? 'Close Builder' : 'Start in Chat'}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 w-[380px] max-h-[75vh] card p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Conversational Builder</h3>

          {step===0 && (
            <div className="space-y-3">
              <p className="text-sm text-neutral-300">Which industry are you in?</p>
              <div className="grid grid-cols-2 gap-2">
                {INDUSTRIES.map(i=> (
                  <button key={i} className="btn bg-[#1a1a1a] hover:bg-[#222] rounded-xl"
                    onClick={()=>{ setAns({...ans, industry:i}); setStep(1); console.log('[metrics] industry_selected', i); }}>{i}</button>
                ))}
              </div>
            </div>
          )}

          {step===1 && (
            <div className="space-y-3">
              <p className="text-sm text-neutral-300">What do you need?</p>
              {(ans.industry==='Real Estate' ? REAL_ESTATE_PROBLEMS : ['Describe your need']).map(p=> (
                <button key={p} className="btn bg-[#1a1a1a] hover:bg-[#222] rounded-xl w-full text-left"
                  onClick={()=>{ setAns({...ans, problem:p}); setStep(2); console.log('[metrics] solution_selected', p); }}>{p}</button>
              ))}
              {ans.industry!=='Real Estate' && (
                <input className="w-full rounded-xl px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-sm"
                  placeholder="Type your need…"
                  onKeyDown={(e:any)=>{ if(e.key==='Enter'){ setAns({...ans, problem:e.target.value}); setStep(2);} }}
                />
              )}
            </div>
          )}

          {step===2 && (
            <div className="space-y-3">
              <p className="text-sm text-neutral-300">Select a solution pattern</p>
              {(ans.problem==='Plot blocking & booking' ? ['Plot Booking Flow Demo'] : ['Standard Prototype']).map(s=> (
                <button key={s} className="btn bg-[#1a1a1a] hover:bg-[#222] rounded-xl w-full text-left"
                  onClick={()=>{ setAns({...ans, solution:s}); setStep(3); }}>{s}</button>
              ))}
              <div className="text-xs text-neutral-400">You can preview the demo after theming.</div>
            </div>
          )}

          {step===3 && (
            <div className="space-y-3">
              <BrandThemeExtractor onTheme={(t)=> setAns({...ans, themeTokens:t})} />
              <div className="flex items-center justify-between">
                <button className="btn bg-[#1a1a1a]" onClick={()=>setStep(2)}>Back</button>
                <button className="btn btn-primary" onClick={()=>setStep(4)}>Next</button>
              </div>
            </div>
          )}

          {step===4 && (
            <div className="space-y-2">
              <p className="text-sm text-neutral-300">Key details</p>
              {['company','contactName','email','phone','multiProject','unitTypes','pricingVisibility','payment','holdLogic','roles','integrations','goLive'].map((k)=> (
                <input key={k}
                  className="w-full rounded-xl px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-sm"
                  placeholder={k.replace(/([A-Z])/g,' $1').replace(/^./,c=>c.toUpperCase())}
                  onChange={(e)=> setAns(a=>({...a, [k]: e.target.value}))}
                />
              ))}
              <div className="flex items-center justify-between mt-2">
                <a href="/demos/real-estate/plot-booking" className="btn btn-secondary">Open Prototype</a>
                <button className="btn btn-primary disabled:opacity-50" disabled={!validateStep4()} onClick={()=>setStep(5)}>Next</button>
              </div>
              {!validateStep4() && <p className="text-xs text-amber-400 mt-1">Company, Contact and Email are required.</p>}
            </div>
          )}

          {step===5 && !sent && (
            <div className="space-y-3">
              <p className="text-sm text-neutral-300">Generate outputs</p>
              <button className="btn btn-primary w-full" onClick={downloadPDF}>Download Requirement Sheet (PDF)</button>
              <button className="btn bg-[#1a1a1a] w-full mt-2" onClick={sendToUs}>Send to Boolean & Beyond</button>
              <p className="text-xs text-neutral-500">We’ll reach out within 1 business day.</p>
            </div>
          )}

          {step===5 && sent && (
            <div className="space-y-3">
              <p className="text-sm">✅ Thanks! We received your details.</p>
              <button className="btn btn-secondary w-full" onClick={()=>setOpen(false)}>Close</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
