'use client';
import React, { useMemo, useState } from 'react';
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
const REAL_ESTATE_PROBLEMS = [
  'Plot blocking & booking', 'Site visit scheduling', 'Payments & invoicing', 'CRM for leads'
];

export default function ChatFlow() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState<Answers>({});

  const go = (n:number)=> setStep(n);

  const onFinish = async () => {
    // Create Requirement Sheet PDF (simple 1-pager)
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
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url; a.download = 'Requirement-Sheet.pdf'; a.click();
  };

  return (
    <div>
      {/* Trigger button */}
      <button
        className="fixed bottom-6 right-6 btn btn-primary shadow-soft"
        onClick={()=>setOpen(v=>!v)}
        aria-label="Open chat builder"
      >
        {open ? 'Close Builder' : 'Start in Chat'}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 w-[360px] max-h-[75vh] card p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Conversational Builder</h3>

          {step===0 && (
            <div className="space-y-3">
              <p className="text-sm text-neutral-300">Which industry are you in?</p>
              <div className="grid grid-cols-2 gap-2">
                {INDUSTRIES.map(i=> (
                  <button key={i} className="btn bg-[#1a1a1a] hover:bg-[#222] rounded-xl"
                    onClick={()=>{ setAns({...ans, industry:i}); go(1);}}>{i}</button>
                ))}
              </div>
            </div>
          )}

          {step===1 && (
            <div className="space-y-3">
              <p className="text-sm text-neutral-300">What do you need?</p>
              {(ans.industry==='Real Estate' ? REAL_ESTATE_PROBLEMS : ['Describe your need']).map(p=> (
                <button key={p} className="btn bg-[#1a1a1a] hover:bg-[#222] rounded-xl w-full text-left"
                  onClick={()=>{ setAns({...ans, problem:p}); go(2);}}>{p}</button>
              ))}
              {ans.industry!=='Real Estate' && (
                <input className="w-full rounded-xl px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-sm"
                  placeholder="Type your need…"
                  onKeyDown={(e:any)=>{ if(e.key==='Enter'){ setAns({...ans, problem:e.target.value}); go(2);} }}
                />
              )}
            </div>
          )}

          {step===2 && (
            <div className="space-y-3">
              <p className="text-sm text-neutral-300">Select a solution pattern</p>
              {(ans.problem==='Plot blocking & booking'
                ? ['Plot Booking Flow Demo']
                : ['Standard Prototype']).map(s=> (
                <button key={s} className="btn bg-[#1a1a1a] hover:bg-[#222] rounded-xl w-full text-left"
                  onClick={()=>{ setAns({...ans, solution:s}); go(3);}}>{s}</button>
              ))}
              <div className="text-xs text-neutral-400">You can preview the demo after theming.</div>
            </div>
          )}

          {step===3 && (
            <div className="space-y-3">
              <BrandThemeExtractor onTheme={(t)=> setAns({...ans, themeTokens:t})} />
              <div className="flex items-center justify-between">
                <button className="btn bg-[#1a1a1a]" onClick={()=>go(2)}>Back</button>
                <button className="btn btn-primary" onClick={()=>go(4)}>Next</button>
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
                <button className="btn btn-primary" onClick={()=>go(5)}>Next</button>
              </div>
            </div>
          )}

          {step===5 && (
            <div className="space-y-3">
              <p className="text-sm text-neutral-300">Generate outputs</p>
              <button className="btn btn-primary w-full" onClick={onFinish}>Download Requirement Sheet (PDF)</button>
              <form action="/api/intake" method="post">
                <input type="hidden" name="payload" value="" />
                <button className="btn bg-[#1a1a1a] w-full mt-2">Send to Boolean & Beyond</button>
              </form>
              <p className="text-xs text-neutral-500">We’ll reach out within 1 business day.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
