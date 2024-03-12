/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com'
            }
        ]
    },
    experimental: {
        serverComponentsExternalPackages: ['@sparticuz/chromium', 'puppeteer-core']
    }
};

export default nextConfig;
