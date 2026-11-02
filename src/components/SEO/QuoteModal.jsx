import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Phone, Mail, Building, User, MapPin } from 'lucide-react';
import API_BASE_URL from '../../api-config';
import { trackLeadSubmission } from '../../utils/analytics';

export default function QuoteModal({ isOpen, onClose, defaultItemName = 'Software Solutions', isProduct = false }) {
  const [formData, setFormData] = useState({
    customerName: '',
    shopName: '',
    email: '',
    phone: '',
    city: '',
    operationType: isProduct ? 'Retail / Enterprise' : 'Custom Project',
    countersCount: '1 Counter',
    gstin: '',
    address: '',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const endpoint = `${API_BASE_URL || ''}/api/products/enquiry`;
      const payload = {
        productName: defaultItemName,
        customerName: formData.customerName,
        shopName: formData.shopName || formData.customerName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        operationType: formData.operationType,
        countersCount: formData.countersCount,
        gstin: formData.gstin,
        address: formData.address,
        notes: formData.notes,
      };

      let res;
      try {
        res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        // Fallback relative route
        res = await fetch('/api/products/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        trackLeadSubmission({ productName: defaultItemName, city: formData.city });
      } else {
        setErrorMessage(data.error || 'Submission failed. Please check your details.');
      }
    } catch (err) {
      console.error('Quote submit error:', err);
      setErrorMessage('Network error. You can also reach our team directly at +91 91764 77943.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-[#004080] p-6 text-white relative">
            <button
              onClick={onClose}
              type="button"
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
            <p className="text-secondary text-xs font-bold uppercase tracking-wider">Averqon Business Enquiry</p>
            <h3 className="text-xl sm:text-2xl font-bold font-poppins mt-1">
              {isProduct ? 'Request Demo & Pricing' : 'Get Free Consultation'}
            </h3>
            <p className="text-slate-200 text-xs sm:text-sm mt-1">
              Inquiring for: <strong className="text-white">{defaultItemName}</strong>
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h4 className="text-2xl font-bold text-slate-800">Enquiry Received!</h4>
                <p className="text-slate-600 max-w-md mx-auto text-sm leading-relaxed">
                  Thank you for reaching out to Averqon. Our technical consultant will review your requirements and get back to you within 2-4 business hours.
                </p>
                <div className="pt-4 flex justify-center">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-primary text-white font-semibold rounded-full hover:bg-opacity-95 transition-all text-sm"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 text-xs bg-red-50 text-red-700 rounded-xl border border-red-200">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Company / Shop Name
                    </label>
                    <div className="relative">
                      <Building size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Averqon Retail"
                        value={formData.shopName}
                        onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="email"
                        placeholder="contact@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City / Location
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Chennai / Bengaluru / Mumbai"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Estimated Timeline / Scale
                    </label>
                    <select
                      value={formData.operationType}
                      onChange={(e) => setFormData({ ...formData, operationType: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                    >
                      <option value="Immediate (< 2 Weeks)">Immediate (&lt; 2 Weeks)</option>
                      <option value="Within 1 Month">Within 1 Month</option>
                      <option value="Evaluating Options">Evaluating Options</option>
                      <option value="Enterprise / Multi-location">Enterprise / Multi-location</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specific Requirements or Questions
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your business requirements, desired integrations, or target launch date..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 bg-primary hover:bg-secondary text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {submitting ? (
                      'Submitting Request...'
                    ) : (
                      <>
                        <span>Submit Enquiry</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-slate-400 mt-2">
                    🔒 Confidential. We respect your privacy and never share your data.
                  </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

