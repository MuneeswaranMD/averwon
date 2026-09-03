import { useEffect } from 'react';

/**
 * useSEO — lightweight hook to set per-page <head> metadata.
 *
 * @param {object} config
 * @param {string} config.title          — <title> tag value
 * @param {string} config.description    — meta description
 * @param {string} config.canonical      — canonical URL (full, e.g. https://averqon.in/about)
 * @param {string} [config.ogType]       — Open Graph type, defaults to "website"
 * @param {string} [config.ogImage]      — Open Graph image URL
 * @param {object} [config.schema]       — JSON-LD schema object
 */
const useSEO = ({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = 'https://averqon.in/averqon_logo.png',
  schema,
} = {}) => {
  useEffect(() => {
    // ── Title ──────────────────────────────────────────────────────
    if (title) document.title = title;

    // ── Helper to upsert a <meta> tag ──────────────────────────────
    const setMeta = (selector, attr, value) => {
      if (!value) return;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [attrName, attrVal] = attr.split('=').map(s => s.replace(/"/g, ''));
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

    // ── Meta description ───────────────────────────────────────────
    setMeta('meta[name="description"]', 'name="description"', description);

    // ── Canonical ──────────────────────────────────────────────────
    setLink('canonical', canonical);

    // ── Open Graph ─────────────────────────────────────────────────
    setMeta('meta[property="og:title"]', 'property="og:title"', title);
    setMeta('meta[property="og:description"]', 'property="og:description"', description);
    setMeta('meta[property="og:type"]', 'property="og:type"', ogType);
    setMeta('meta[property="og:url"]', 'property="og:url"', canonical);
    setMeta('meta[property="og:image"]', 'property="og:image"', ogImage);
    setMeta('meta[property="og:site_name"]', 'property="og:site_name"', 'Averqon');

    // ── Twitter Card ───────────────────────────────────────────────
    setMeta('meta[name="twitter:card"]', 'name="twitter:card"', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name="twitter:title"', title);
    setMeta('meta[name="twitter:description"]', 'name="twitter:description"', description);
    setMeta('meta[name="twitter:image"]', 'name="twitter:image"', ogImage);

    // ── JSON-LD Schema ─────────────────────────────────────────────
    const SCRIPT_ID = 'page-jsonld-schema';
    if (schema) {
      let scriptEl = document.getElementById(SCRIPT_ID);
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = SCRIPT_ID;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(schema);
    }

    // Cleanup: remove JSON-LD on unmount so it doesn't bleed across pages
    return () => {
      const scriptEl = document.getElementById(SCRIPT_ID);
      if (scriptEl) scriptEl.remove();
    };
  }, [title, description, canonical, ogType, ogImage, schema]);
};

export default useSEO;
