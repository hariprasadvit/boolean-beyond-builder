import React from 'react';
import ChatFlow from '@/components/ChatFlow';

export default function HomePage() {
  return (
    <main>
      <header className="border-b border-[#1f1f1f]">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)]"></div>
            <div className="font-semibold">Boolean & Beyond</div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
            <a href="#solutions">Solutions</a>
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#work">Work</a>
            <a href="#contact">Contact</a>
            <a className="btn btn-primary" href="#builder">Build with AI</a>
          </nav>
        </div>
      </header>

      <section className="container py-14">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Describe your industry.<br/>We’ll assemble your app.
        </h1>
        <p className="mt-4 text-neutral-300 max-w-2xl">
          A chat-led builder that prototypes your flow and creates a requirement sheet—automatically.
        </p>
        <div className="mt-6 flex gap-3">
          <a href="#builder" className="btn btn-primary">Start in Chat</a>
          <a href="/demos/real-estate/plot-booking" className="btn btn-secondary">Try a Real Estate Demo</a>
        </div>
      </section>

      <section id="builder" className="container py-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold">Industry Shortcuts</h2>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {['Real Estate','FinTech','EdTech','Healthcare','Retail','Logistics','Other'].map(i=> (
                <div key={i} className="card p-4">
                  <div className="font-medium">{i}</div>
                  <div className="text-xs text-neutral-400 mt-1">Click from chat panel</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold">Highlights</h2>
            <ul className="list-disc list-inside text-neutral-300 mt-3">
              <li>Guided needs discovery</li>
              <li>Instant theme from your brand</li>
              <li>Clickable mini-prototype</li>
              <li>Auto-generated requirement sheet</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container py-6">
        <div className="card p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">See Plot Blocking & Booking Flow</h3>
            <p className="text-sm text-neutral-300">Preview a demo with holds, booking, and confirmation.</p>
          </div>
          <a className="btn btn-primary" href="/demos/real-estate/plot-booking">Open Demo</a>
        </div>
      </section>

      <section className="container py-16" id="contact">
        <div className="text-center text-neutral-400 text-sm">
          © {new Date().getFullYear()} Boolean & Beyond. All rights reserved.
        </div>
      </section>

      <ChatFlow />
    </main>
  );
}
