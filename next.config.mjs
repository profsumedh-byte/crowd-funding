/** @type {import('next').NextConfig} */
const nextConfig = {
  // devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com', 
      },
    ],
  },
};

export default nextConfig;
