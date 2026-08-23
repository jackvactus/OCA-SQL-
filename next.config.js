/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Toutes les illustrations sont locales (public/art/*.svg) : aucune
    // origine distante n'est autorisée, ce qui supprime la dépendance réseau,
    // le transfert d'IP visiteur vers un tiers et permet une CSP stricte.
    unoptimized: true,
    remotePatterns: [],
  },
};

module.exports = nextConfig;
