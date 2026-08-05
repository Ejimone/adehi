import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Existing portrait host, until the image is moved into Supabase Storage.
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      {
        protocol: 'https',
        hostname: 'gcjlvuidohmcmyvkirxt.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
