/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    domains: [
      'perceptive-wildebeest-776.convex.cloud',
      'img.clerk.com'
    ],
  }
};

export default nextConfig;
