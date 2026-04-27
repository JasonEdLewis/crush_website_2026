/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export -> deploy the `out/` folder to Namecheap shared hosting.
  output: 'export',
  // Required when output: 'export' is used (no Image Optimization server).
  images: { unoptimized: true },
  // Emit clean URLs (folder/index.html) so links work on Apache without rewrites.
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
