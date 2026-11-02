/**
 * Analytics and Conversion Tracking utility for Averqon
 * Supports Google Analytics 4 (GA4) with fallback when offline or ad-blocked
 */

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-AVERQON';

/**
 * Send custom event to Google Analytics 4
 * @param {string} action - Event name (e.g. 'generate_lead', 'click_whatsapp')
 * @param {object} params - Event parameters
 */
export const trackEvent = (action, params = {}) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', action, params);
    } catch (err) {
      console.debug('Analytics error:', err);
    }
  }
};

/**
 * Track lead enquiry / quote request submission
 * @param {object} leadData
 */
export const trackLeadSubmission = (leadData) => {
  trackEvent('generate_lead', {
    event_category: 'Lead Generation',
    event_label: leadData.productName || leadData.serviceName || 'General Enquiry',
    value: 1,
    currency: 'INR',
    customer_city: leadData.city || 'India',
  });
};

/**
 * Track WhatsApp chat clicks
 * @param {string} source - where the click originated (e.g. 'hero_cta', 'product_page', 'floating_widget')
 */
export const trackWhatsAppClick = (source = 'direct') => {
  trackEvent('contact', {
    event_category: 'WhatsApp',
    event_label: source,
    method: 'WhatsApp',
  });
};

/**
 * Track phone call clicks
 * @param {string} source
 */
export const trackPhoneCall = (source = 'direct') => {
  trackEvent('contact', {
    event_category: 'Phone',
    event_label: source,
    method: 'Phone Call',
  });
};

