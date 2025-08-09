import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Boolean & Beyond — Chat-led Prototyping for Your Industry',
  description: 'Pick your industry, preview a tailored flow, and get an instant requirement sheet.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context":"https://schema.org",
            "@type":"Product",
            "name":"Conversational Prototype Builder",
            "brand":{"@type":"Organization","name":"Boolean & Beyond"},
            "description":"Chat-led builder that prototypes flows and generates requirement sheets."
          })}}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
