import type { APIRoute } from 'astro';

export const prerender = true;

const rutas = ['', 'keiji/', 'personajes/', 'capitulos/', 'galeria/', 'videos/'];

export const GET: APIRoute = () => {
  // import.meta.env.SITE es el dominio configurado en astro.config.mjs (sin
  // slash final); BASE_URL es el prefijo de ruta (p. ej. "/Keiji", sin slash
  // final). Se normalizan ambos para evitar dobles o faltantes slashes.
  const sitio = import.meta.env.SITE?.replace(/\/$/, '') ?? '';
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const raiz = `${sitio}${base}/`;
  const urls = rutas
    .map((ruta) => `  <url>\n    <loc>${raiz}${ruta}</loc>\n  </url>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
