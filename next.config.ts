import type { NextConfig } from "next";

/**
 * The site is intentionally free of server-side features (no route handlers,
 * no server actions, no dynamic rendering), so it can be deployed either as a
 * normal Next.js app (Vercel) or exported to fully static HTML.
 *
 * To publish on GitHub Pages, build with:
 *   NEXT_STATIC_EXPORT=1 npm run build
 * ...and serve the generated `out/` directory.
 */
const isStaticExport = process.env.NEXT_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" as const } : {}),
  images: {
    // No remote images are used; keeps static export unblocked.
    unoptimized: isStaticExport,
  },
  // Trailing slashes make static hosts (GitHub Pages) resolve nested routes.
  trailingSlash: isStaticExport,
};

export default nextConfig;
