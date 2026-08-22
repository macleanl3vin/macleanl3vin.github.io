import type { NextConfig } from "next";

/**
 * This site is deployed to GitHub Pages, which serves plain static files, so
 * `next build` always produces a fully exported `out/` directory. The stock
 * Pages workflow in .github/workflows/nextjs.yml runs a bare `next build` and
 * then uploads `out/`, so the export must not be conditional on an env var —
 * otherwise the upload step has nothing to publish.
 *
 * The site has no server-side features (no route handlers, no server actions,
 * no dynamic rendering), so nothing is lost by exporting statically.
 *
 * The repository is `macleanl3vin.github.io`, i.e. a user site served from the
 * domain root, so no `basePath` or `assetPrefix` is needed. If this is ever
 * moved into a project repo (served from `/<repo>/`), both would have to be set
 * to that sub-path.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: {
    // Pages cannot run the image optimizer; no remote images are used anyway.
    unoptimized: true,
  },
  // Trailing slashes make a static host resolve nested routes as directories.
  trailingSlash: true,
};

export default nextConfig;
