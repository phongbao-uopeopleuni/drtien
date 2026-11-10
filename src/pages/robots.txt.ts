import type { APIRoute } from 'astro';
import { isDraft } from '../data/portfolio';
export const GET: APIRoute = ({ site }) => new Response(
  isDraft ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n${site ? `Sitemap: ${new URL(`${import.meta.env.BASE_URL}sitemap.xml`, site).href}\n` : ''}`,
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
