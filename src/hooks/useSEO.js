import { useEffect } from 'react';

/**
 * useSEO — enhanced hook to set per-page <head> metadata, Open Graph, Twitter cards, and JSON-LD schema.
 *
 * @param {object} config
 * @param {string} config.title          — <title> tag value
 * @param {string} config.description    — meta description
 * @param {string} [config.canonical]    — canonical URL (e.g. https://www.averqon.in/website-development)
 * @param {string|array} [config.keywords] — meta keywords array or comma-separated string
 * @param {string} [config.ogType]       — Open Graph type, defaults to "website"
 * @param {string} [config.ogImage]      — Open Graph image URL
 * @param {string} [config.robots]       — robots directive, defaults to "index, follow"
 * @param {object|array} [config.schema] — JSON-LD schema object or array of schema objects
 * @param {array} [config.breadcrumbs]   — optional array of { name, path } to automatically generate BreadcrumbList schema
 */
const useSEO = ({
  title,
  description,
  keywords,
  canonical,
  ogType = 'website',
  ogImage = 'https://www.averqon.in/averqon_logo.png',
  robots = 'index, follow',
  schema,
  breadcrumbs,
} = {}) => {
  useEffect(() => {
    // ── Canonical URL fallback ─────────────────────────────────────
    const siteUrl = 'https://www.averqon.in';
    let fullCanonical = canonical;
    if (!fullCanonical && typeof window !== 'undefined') {
      const cleanPath = window.location.pathname.replace(/\/$/, '') || '/';
      fullCanonical = `${siteUrl}${cleanPath === '/' ? '' : cleanPath}`;
    }

    // ── Title ──────────────────────────────────────────────────────
    if (title) {
      document.title = title.includes('Averqon') ? title : `${title} | Averqon`;
    }

    // ── Helper to upsert a <meta> tag ──────────────────────────────
    const setMeta = (selector, attr, value) => {
      if (value === undefined || value === null) return;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [attrName, attrVal] = attr.split('=').map((s) => s.replace(/"/g, ''));
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    // ── Helper to upsert a <link> tag ──────────────────────────────
    const setLink = (rel, href) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // ── Primary Meta Tags ──────────────────────────────────────────
    setMeta('meta[name="description"]', 'name="description"', description);
    setMeta('meta[name="robots"]', 'name="robots"', robots);
    if (keywords) {
      const kwString = Array.isArray(keywords) ? keywords.join(', ') : keywords;
      setMeta('meta[name="keywords"]', 'name="keywords"', kwString);
    }
    setLink('canonical', fullCanonical);

    // ── Open Graph ─────────────────────────────────────────────────
    setMeta('meta[property="og:title"]', 'property="og:title"', title);
    setMeta('meta[property="og:description"]', 'property="og:description"', description);
    setMeta('meta[property="og:type"]', 'property="og:type"', ogType);
    setMeta('meta[property="og:url"]', 'property="og:url"', fullCanonical);
    setMeta('meta[property="og:image"]', 'property="og:image"', ogImage);
    setMeta('meta[property="og:site_name"]', 'property="og:site_name"', 'Averqon');
    setMeta('meta[property="og:locale"]', 'property="og:locale"', 'en_IN');

    // ── Twitter Card ───────────────────────────────────────────────
    setMeta('meta[name="twitter:card"]', 'name="twitter:card"', 'summary_large_image');
    setMeta('meta[name="twitter:site"]', 'name="twitter:site"', '@averqon');
    setMeta('meta[name="twitter:title"]', 'name="twitter:title"', title);
    setMeta('meta[name="twitter:description"]', 'name="twitter:description"', description);
    setMeta('meta[name="twitter:image"]', 'name="twitter:image"', ogImage);

    // ── JSON-LD Schemas ────────────────────────────────────────────
    const SCRIPT_ID = 'page-jsonld-schema';
    const schemasToInject = [];

    if (schema) {
      if (Array.isArray(schema)) {
        schemasToInject.push(...schema);
      } else {
        schemasToInject.push(schema);
      }
    }

    // Auto-generate BreadcrumbList schema if breadcrumbs are provided
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemasToInject.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: crumb.path.startsWith('http') ? crumb.path : `${siteUrl}${crumb.path}`,
        })),
      });
    }

    if (schemasToInject.length > 0) {
      let scriptEl = document.getElementById(SCRIPT_ID);
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = SCRIPT_ID;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(
        schemasToInject.length === 1 ? schemasToInject[0] : schemasToInject
      );
    }

    // Cleanup: remove JSON-LD on unmount so it doesn't bleed across page navigations
    return () => {
      const scriptEl = document.getElementById(SCRIPT_ID);
      if (scriptEl) scriptEl.remove();
    };
  }, [title, description, keywords, canonical, ogType, ogImage, robots, schema, breadcrumbs]);
};

export default useSEO;
