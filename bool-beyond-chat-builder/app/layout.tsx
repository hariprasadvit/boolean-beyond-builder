import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Boolean & Beyond — Conversational Prototype Builder',
  description: 'Pick your industry, preview a tailored flow, and get an instant requirement sheet.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
