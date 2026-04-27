import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata: Metadata = {
  title: 'Crush Films — Brand films that move people | Merrick Robert Media',
  description:
    'Crush Films is a production studio building bold commercial, brand, and documentary work for ambitious teams. We turn ideas into films people remember.',
  metadataBase: new URL('https://merrickrobertmedia.com'),
  openGraph: {
    title: 'Crush Films — Brand films that move people',
    description:
      'A production studio building bold commercial, brand, and documentary work for ambitious teams.',
    type: 'website',
  },
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
      </body>
    </html>
  );
}
