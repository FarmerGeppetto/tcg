/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com'
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io'
      },
      {
        protocol: 'https',
        hostname: 'i.seadn.io'
      },
      {
        protocol: 'https',
        hostname: 'euc.li'
      },
      {
        protocol: 'https',
        hostname: 'elementals-images.azuki.com'
      }
    ]
  }
}

module.exports = nextConfig 