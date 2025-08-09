'use client';
import React, { useMemo, useState } from 'react';
import InventoryGrid from '@/components/InventoryGrid';

export default function PlotBookingDemo() {
  const [unit, setUnit] = useState<any>(null);
  const [holdUntil, setHoldUntil] = useState<number|null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const now = Date.now();
  const remaining = holdUntil ? Math.max(0, Math.floor((holdUntil - now)/1000)) : 0;

  const hold = () => {
    setHoldUntil(Date.now() + 5*60*1000); // 5 minutes
  };

  const book = () => {
    alert('Booked in test mode! (No real payment processed.)');
  };

  return (
    <main className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Plot Booking Demo</h1>
        <a href="/" className="btn btn-secondary">Back to Home</a>
      </div>

      <InventoryGrid onPick={setUnit} />

      {unit && (
        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold">Unit {unit.id}</h3>
              <p className="text-sm text-neutral-400">Block {unit.block} • {unit.facing}-facing • {unit.size} sq ft</p>
              <p className="mt-2 font-semibold">₹ {(unit.price/100000).toFixed(2)} Lakh</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-neutral-400">Status: {unit.status}</div>
              {holdUntil && (
                <div className="text-sm mt-2">
                  On Hold: <span className="font-mono">{remaining}s</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button className="btn bg-[#1a1a1a]" onClick={hold}>Hold for 5 min</button>
            <button className="btn btn-primary" onClick={book}>Book Now (Test)</button>
            <button className="btn bg-[#1a1a1a]" onClick={()=>setUnit(null)}>Close</button>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <input className="rounded-xl px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-sm"
              placeholder="Buyer name" value={name} onChange={e=>setName(e.target.value)} />
            <input className="rounded-xl px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-sm"
              placeholder="Buyer email" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <p className="text-xs text-neutral-500 mt-2">Payments are disabled in this demo (test mode only).</p>
        </div>
      )}
    </main>
  );
}
