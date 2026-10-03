import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Housie Control Platform | Live Event Conductor',
  description: 'Production-ready digital Housie & Tambola game-control platform for live events, weddings, kitty parties, and corporate celebrations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
