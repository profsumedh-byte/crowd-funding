/** @type {import('next').NextConfig} */
const nextConfig = {
  // devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com', 
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', 
      }
    ],
  },
};

export default nextConfig;
