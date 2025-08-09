'use client';
import React, { useMemo, useState } from 'react';

type Unit = {
  id: string;
  block: string;
  size: number;
  price: number;
  status: 'Available'|'On Hold'|'Booked'|'Sold';
  facing: 'East'|'West'|'North'|'South';
};

const sampleUnits: Unit[] = Array.from({length: 36}).map((_,i)=> ({
  id: `P-${i+101}`,
  block: ['A','B','C'][i%3],
  size: 800 + (i%6)*100,
  price: 1200000 + (i%6)*150000,
  status: (['Available','On Hold','Booked','Sold'])[i%4] as any,
  facing: (['East','West','North','South'])[i%4] as any,
}));

export default function InventoryGrid({ onPick }:{ onPick:(u:Unit)=>void }) {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<string>('All');

  const list = useMemo(()=> {
    return sampleUnits.filter(u => {
      const passStatus = status==='All' || u.status===status;
      const passQ = q==='' || u.id.includes(q) || u.block.includes(q);
      return passStatus && passQ;
    });
  }, [q,status]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by Plot ID or Block"
          className="w-full rounded-xl px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-sm"/>
        <select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-xl px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-sm">
          {['All','Available','On Hold','Booked','Sold'].map(s=><option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {list.map(u=> (
          <button key={u.id} className="card p-3 text-left hover:scale-[1.01] transition"
            onClick={()=>onPick(u)}>
            <div className="flex items-center justify-between">
              <div className="font-semibold">{u.id}</div>
              <span className="badge"
                style={{background: u.status==='Available' ? 'var(--color-primary)' :
                                 u.status==='On Hold' ? '#f59e0b' :
                                 u.status==='Booked' ? '#3b82f6' : '#6b7280'}}>
                {u.status}
              </span>
            </div>
            <div className="text-xs text-neutral-400 mt-1">Block {u.block} • {u.facing}-facing</div>
            <div className="text-sm mt-2">{u.size} sq ft</div>
            <div className="text-sm font-semibold mt-1">₹ {(u.price/100000).toFixed(2)} Lakh</div>
          </button>
        ))}
      </div>
    </div>
  );
}
