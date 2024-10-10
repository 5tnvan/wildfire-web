// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "daisyui.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "media1.tenor.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "poalybuqvwrnukxylhad.supabase.co",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "wildfire.b-cdn.net",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "api.producthunt.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "vod-cdn.lp-playback.studio",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
