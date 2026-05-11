import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import AudioToggle from '@/components/AudioToggle';

export const metadata: Metadata = {
  title: 'Merrick Robert Media / Crushfilms — Brand films that move people',
  description:
    'Crushfilms is a production studio building bold commercial, brand, and documentary work for ambitious teams. We turn ideas into films people remember.',
  metadataBase: new URL('https://merrickrobertmedia.com'),
  openGraph: {
    title: 'Merrick Robert Media / Crushfilms — Brand films that move people',
    description:
      'A production studio building bold commercial, brand, and documentary work for ambitious teams.',
    type: 'website',
  },
  // Favicon + apple-touch-icon — both are SVG. Modern browsers (98%+) handle
  // SVG favicons natively; older Safari falls back to the apple-touch-icon.
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-touch-icon.svg' }],
  },
  themeColor: '#0a0a0a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts loaded via <link> tags so the static export works on any host
            and does not require network access at build time. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Tight:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* No-JS fallback: reveal-on-scroll content is otherwise opacity:0. */}
        <noscript>
          <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </head>
      <body className="font-sans bg-ink-900 text-ink-50 antialiased">
        <SmoothScroll />
        <Nav />
        <main>{children}</main>
        <Footer />
        <AudioToggle />
      </body>
    </html>
  );
}
