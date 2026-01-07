import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FFXI GP Calculator',
  description: 'A tool to track Guild Points items and patterns for Final Fantasy XI.',
  keywords: ['FFXI', 'Final Fantasy XI', 'Guild Points', 'GP Calculator', 'Crafting'],
  openGraph: {
    title: 'FFXI GP Calculator',
    description: 'Track Guild Points items and patterns for Final Fantasy XI.',
    url: 'https://ffxi-gp.vercel.app', // Placeholder, but good to have
    siteName: 'FFXI GP Calculator',
    images: [
      {
        url: '/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'FFXI GP Calculator Icon',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'FFXI GP Calculator',
    description: 'Track Guild Points items and patterns for Final Fantasy XI.',
    images: ['/icons/icon-512x512.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full overflow-hidden`}
      >
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
