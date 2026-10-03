import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Housie Control Platform | Live Event Conductor',
  description: 'Production-ready digital Housie & Tambola game-control platform for live events, weddings, kitty parties, and corporate celebrations.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Housie',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0B0D14' },
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-[100dvh] bg-background text-foreground antialiased selection:bg-brand-500 selection:text-white pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
        {children}
      </body>
    </html>
  );
}
