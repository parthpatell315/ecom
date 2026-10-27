import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.whitelayer.in',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      // 301 Redirect: Core Reactor desk light removing incorrect wireless-charger slug and trademark
      {
        source: '/product/marvel-iron-man-arc-reactor-wireless-charger',
        destination: '/product/core-reactor-desk-light',
        permanent: true,
      },
      // 301 Redirect: Neon City Lightbox
      {
        source: '/product/gta-6-vi-lightbox',
        destination: '/product/neon-city-lightbox',
        permanent: true,
      },
      // 301 Redirect: Hero Series LED Lightbox
      {
        source: '/product/marvel-inspired-led-lightbox',
        destination: '/product/hero-series-led-lightbox',
        permanent: true,
      },
      // 301 Redirect: Hero Emblem LED Lamp
      {
        source: '/product/marvel-led-lamp-premium-room-lighting-with-iconic-design',
        destination: '/product/hero-emblem-led-lamp',
        permanent: true,
      },
      // 301 Redirect: Anti-Hero Controller Stand
      {
        source: '/product/universal-controller-stand-inspired-marvels-by-deadpool',
        destination: '/product/anti-hero-controller-stand',
        permanent: true,
      },
      // 301 Redirect: Claw Hero Controller Stand
      {
        source: '/product/ps5-controller-inspired-by-marvels-wolverine',
        destination: '/product/claw-hero-controller-stand',
        permanent: true,
      },
      // 301 Redirect: Web Slinger Chibi Keychain
      {
        source: '/product/spiderman-chibi-toy-keychain',
        destination: '/product/web-slinger-chibi-keychain',
        permanent: true,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
