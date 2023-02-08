/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    output: 'standalone',
    compiler: {
        reactRemoveProperties: {
            properties: ['^data-\\w+$'],
        },
    },
};

module.exports = nextConfig;
