import type { APIRoute } from 'astro';
import { isDraft } from '../data/portfolio';
export const GET: APIRoute = ({ site }) => {
  const location = site && !isDraft ? new URL(import.meta.env.BASE_URL, site).href.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;') : null;
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${location ? `<url><loc>${location}</loc></url>` : ''}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
