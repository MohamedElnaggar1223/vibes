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
        // serverComponentsExternalPackages: ['chrome-aws-lambda', 'puppeteer-core']
    }
};

export default nextConfig;
