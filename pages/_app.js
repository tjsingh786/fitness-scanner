// pages/_app.js
import '../styles/globals.css';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="FitnessPro" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FitnessPro" />
        <meta name="description" content="Transform handwritten workouts into digital routines with AI OCR scanning" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#7c3aed" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#7c3aed" />

        {/* Viewport and responsive */}
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />

        {/* Icons */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#7c3aed" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Performance hints */}
        <link rel="preconnect" href="https://unpkg.com" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        
        {/* Preload critical resources */}
        <link 
          rel="preload" 
          href="https://unpkg.com/tesseract.js@v4.1.1/dist/tesseract.min.js" 
          as="script"
          crossOrigin="anonymous"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="FitnessPro - AI Workout Scanner" />
        <meta property="og:description" content="Transform handwritten workouts into digital routines with AI OCR scanning" />
        <meta property="og:image" content="/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FitnessPro - AI Workout Scanner" />
        <meta name="twitter:description" content="Transform handwritten workouts into digital routines with AI OCR scanning" />
        <meta name="twitter:image" content="/twitter-image.png" />

        {/* Permissions Policy */}
        <meta httpEquiv="Permissions-Policy" content="camera=*, microphone=*, geolocation=()" />
      </Head>
      
      <Component {...pageProps} />
    </>
  );
}
