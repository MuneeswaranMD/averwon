import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldX, 
  Send, 
  RefreshCw, 
  Upload, 
  Paperclip, 
  X, 
  Building2, 
  Briefcase, 
  User, 
  Mail, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { uploadImageToCloudinary } from '../utils/cloudinary';

const StarRating = ({ value, onChange, label, required = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-[#101A32]">
          {label} {required && <span className="text-[#2160FF]">*</span>}
        </label>
        <span className="text-xs font-semibold text-[#2160FF]">
          {(hover || value) ? `${hover || value} / 5` : 'Rate 1-5'}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= (hover || value);
          return (
            <button
              type="button"
              key={star}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="p-1 focus:outline-none focus:scale-110 transition-transform cursor-pointer"
              aria-label={`${star} star`}
            >
              <Star 
                className={`w-6 h-6 transition-colors duration-150 ${
                  isFilled 
                    ? 'text-amber-400 fill-amber-400' 
                    : 'text-slate-300 hover:text-amber-200'
                }`} 
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default function ClientFeedback() {
  const { token } = useParams();

  // Verification & Status States
  const [verifying, setVerifying] = useState(true);
  const [tokenError, setTokenError] = useState(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Form Fields
  const [form, setForm] = useState({
    clientName: '',
    companyName: '',
    email: '',
    project: '',
    rating: 5,
    qualityRating: 5,
    communicationRating: 5,
    deliveryRating: 5,
    feedbackText: '',
    publicationConsent: true,
    identityDisplayConsent: true,
    imageDisplayConsent: false,
    photoUrl: ''
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Verify token on mount
  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setTokenError({ title: 'Invalid Link', message: 'No feedback token provided in URL.' });
        setVerifying(false);
        return;
      }

      try {
        const res = await fetch(`/api/public/feedback/${token}`);
        const data = await res.json();

        if (res.ok && data.valid) {
          setForm(prev => ({
            ...prev,
            clientName: data.clientName || '',
            companyName: data.companyName || '',
            email: data.email || '',
            project: data.project || ''
          }));
          setVerifying(false);
        } else {
          setTokenError({
            title: res.status === 410 ? 'Link Expired' : (res.status === 409 ? 'Already Submitted' : 'Link Invalid'),
            message: data.error || 'This feedback link is not valid or has expired.'
          });
          setVerifying(false);
        }
      } catch (err) {
        setTokenError({
          title: 'Connection Error',
          message: 'Unable to reach the Averqon feedback server. Please check your network connection.'
        });
        setVerifying(false);
      }
    }

    verifyToken();
  }, [token]);

  // Handle Photo or Logo file selection with Cloudinary Upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP, GIF, SVG).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be under 10MB.');
      return;
    }

    setPhotoUploadError('');
    setUploadingPhoto(true);
    setPhotoPreview(URL.createObjectURL(file));

    try {
      const res = await uploadImageToCloudinary(file, { folder: 'averqon/testimonials' });
      if (res.success && res.url) {
        setForm(prev => ({ ...prev, photoUrl: res.url, imageDisplayConsent: true }));
      } else {
        setPhotoUploadError(res.error || 'Failed to upload image to Cloudinary.');
        setPhotoPreview(null);
      }
    } catch (err) {
      setPhotoUploadError('Upload failed: ' + (err.message || 'Network error'));
      setPhotoPreview(null);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoUploadError('');
    setForm(prev => ({ ...prev, photoUrl: '', imageDisplayConsent: false }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Submit Feedback Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!form.clientName.trim() || !form.email.trim() || !form.project.trim() || !form.feedbackText.trim()) {
      setSubmitError('Please complete all required fields.');
      return;
    }

    if (form.feedbackText.trim().length < 10) {
      setSubmitError('Please provide a little more detail in your feedback (at least 10 characters).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/public/feedback/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSubmittedSuccess(true);
      } else {
        setSubmitError(data.error || 'Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      setSubmitError('Network error while submitting feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // 1. Loading State
  if (verifying) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 max-w-md w-full text-center space-y-4 shadow-sm">
          <RefreshCw className="w-8 h-8 text-[#2160FF] animate-spin mx-auto" />
          <h2 className="text-lg font-bold text-[#101A32]">Verifying Secure Feedback Link...</h2>
          <p className="text-xs text-[#64748B]">Connecting to Averqon Client Portal</p>
        </div>
      </div>
    );
  }

  // 2. Token Error State (Expired, Revoked, or Invalid)
  if (tokenError) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 sm:p-10 max-w-md w-full text-center space-y-5 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
            <ShieldX className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-[#101A32]">{tokenError.title}</h2>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              {tokenError.message}
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2160FF] text-white text-xs font-semibold hover:bg-blue-600 transition-colors shadow-sm"
            >
              Visit Averqon Homepage <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Post-Submission Success State
  if (submittedSuccess) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-[20px] border border-[#E2E8F0] p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-[0_4px_24px_rgba(16,26,50,0.04)]"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-[#10B981]">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#101A32]">Thank You, {form.clientName}!</h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Your feedback for <strong>{form.project}</strong> has been received by our executive engineering team.
            </p>
          </div>

          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-left space-y-2 text-[#334155]">
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Overall Experience:</span>
              <span className="font-bold text-amber-500">{'★'.repeat(form.rating)} ({form.rating}/5)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Website Publication:</span>
              <span className={`font-semibold ${form.publicationConsent ? 'text-emerald-600' : 'text-slate-500'}`}>
                {form.publicationConsent ? '✓ Consented to Publish' : 'Private Only'}
              </span>
            </div>
            {form.publicationConsent && (
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Name & Company Display:</span>
                <span className="font-semibold text-slate-700">
                  {form.identityDisplayConsent ? 'Publicly Attributed' : 'Anonymous / Confidential'}
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-[#94A3B8]">
            We look forward to continuing our partnership and building next-generation digital solutions with you.
          </p>

          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2160FF] text-white text-xs sm:text-sm font-semibold hover:bg-blue-600 transition-colors shadow-sm"
            >
              Return to Averqon Website <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // 4. Main Feedback Form
  return (
    <div className="min-h-screen bg-[#F6F8FC] text-[#101A32] font-sans pt-28 sm:pt-32 pb-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 text-[#2160FF] border border-blue-100">
            <Sparkles className="w-3.5 h-3.5" /> Client Experience & Review
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#101A32]">
            Share Your Experience with Averqon
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-xl mx-auto leading-relaxed">
            Your honest feedback empowers our engineering team to continually elevate product quality and client success.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[18px] border border-[#E2E8F0] p-6 sm:p-10 shadow-[0_4px_24px_rgba(16,26,50,0.04)]">
          
          {submitError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs sm:text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* ── Section 1: Client & Project Details ── */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-[#101A32] pb-1 border-b border-[#E2E8F0] flex items-center gap-2">
                <User className="w-4 h-4 text-[#2160FF]" /> Client & Project Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fb-client-name" className="block text-xs font-medium text-[#101A32] mb-1.5">
                    Client Full Name <span className="text-[#2160FF]">*</span>
                  </label>
                  <input
                    id="fb-client-name"
                    required
                    type="text"
                    value={form.clientName}
                    onChange={e => setForm({ ...form, clientName: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full h-11 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 text-sm text-[#101A32] placeholder-slate-400 outline-none hover:border-slate-300 focus:bg-white focus:border-[#2160FF] focus:ring-2 focus:ring-[#2160FF]/15 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="fb-company-name" className="block text-xs font-medium text-[#101A32] mb-1.5">
                    Company Name <span className="text-[#64748B] font-normal">(Optional)</span>
                  </label>
                  <input
                    id="fb-company-name"
                    type="text"
                    value={form.companyName}
                    onChange={e => setForm({ ...form, companyName: e.target.value })}
                    placeholder="e.g. Apex Cloud Solutions"
                    className="w-full h-11 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 text-sm text-[#101A32] placeholder-slate-400 outline-none hover:border-slate-300 focus:bg-white focus:border-[#2160FF] focus:ring-2 focus:ring-[#2160FF]/15 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fb-email" className="block text-xs font-medium text-[#101A32] mb-1.5">
                    Email Address <span className="text-[#2160FF]">*</span>
                  </label>
                  <input
                    id="fb-email"
                    required
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full h-11 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 text-sm text-[#101A32] placeholder-slate-400 outline-none hover:border-slate-300 focus:bg-white focus:border-[#2160FF] focus:ring-2 focus:ring-[#2160FF]/15 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="fb-project" className="block text-xs font-medium text-[#101A32] mb-1.5">
                    Project or Service Delivered <span className="text-[#2160FF]">*</span>
                  </label>
                  <input
                    id="fb-project"
                    required
                    type="text"
                    value={form.project}
                    onChange={e => setForm({ ...form, project: e.target.value })}
                    placeholder="e.g. Enterprise SaaS Portal"
                    className="w-full h-11 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 text-sm text-[#101A32] placeholder-slate-400 outline-none hover:border-slate-300 focus:bg-white focus:border-[#2160FF] focus:ring-2 focus:ring-[#2160FF]/15 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* ── Section 2: Ratings ── */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-[#101A32] pb-1 border-b border-[#E2E8F0] flex items-center gap-2">
                <Star className="w-4 h-4 text-[#2160FF]" /> Rating & Evaluation
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5">
                <StarRating
                  label="Overall Experience"
                  required
                  value={form.rating}
                  onChange={v => setForm({ ...form, rating: v })}
                />
                <StarRating
                  label="Quality of Work & Engineering"
                  value={form.qualityRating}
                  onChange={v => setForm({ ...form, qualityRating: v })}
                />
                <StarRating
                  label="Communication & Responsiveness"
                  value={form.communicationRating}
                  onChange={v => setForm({ ...form, communicationRating: v })}
                />
                <StarRating
                  label="Project Delivery & Timelines"
                  value={form.deliveryRating}
                  onChange={v => setForm({ ...form, deliveryRating: v })}
                />
              </div>
            </div>

            {/* ── Section 3: Written Testimonial ── */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-[#101A32] pb-1 border-b border-[#E2E8F0] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#2160FF]" /> Written Feedback & Testimonial
              </h2>

              <div>
                <label htmlFor="fb-testimonial" className="block text-xs font-medium text-[#101A32] mb-1.5">
                  Your Review / Testimonial <span className="text-[#2160FF]">*</span>
                </label>
                <textarea
                  id="fb-testimonial"
                  required
                  rows={4}
                  value={form.feedbackText}
                  onChange={e => setForm({ ...form, feedbackText: e.target.value })}
                  placeholder="Share details about what went well, how the solution helped your business, and your experience working with our team..."
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 text-sm text-[#101A32] placeholder-slate-400 outline-none hover:border-slate-300 focus:bg-white focus:border-[#2160FF] focus:ring-2 focus:ring-[#2160FF]/15 transition-all leading-relaxed resize-y min-h-[110px]"
                />
                <p className="text-[11px] text-[#64748B] mt-1">Minimum 10 characters.</p>
              </div>

              {/* Photo or Company Logo Upload */}
              <div>
                <label className="block text-xs font-medium text-[#101A32] mb-1.5">
                  Profile Photo or Company Logo <span className="text-[#64748B] font-normal">(Optional)</span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="fb-photo-upload"
                />

                {uploadingPhoto ? (
                  <div className="flex items-center justify-between w-full h-11 px-3.5 bg-blue-50/50 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-2 text-xs text-[#2160FF] font-medium">
                      <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                      <span>Uploading to Cloudinary...</span>
                    </div>
                    <span className="text-[11px] text-[#64748B]">Please wait</span>
                  </div>
                ) : !photoPreview ? (
                  <label
                    htmlFor="fb-photo-upload"
                    className="flex items-center justify-between w-full h-11 px-3.5 bg-[#F8FAFC] border border-dashed border-[#CBD5E1] rounded-xl hover:bg-slate-100/70 hover:border-[#2160FF] cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-2 text-xs text-[#64748B] truncate">
                      <Paperclip className="w-4 h-4 text-[#64748B] group-hover:text-[#2160FF] transition-colors shrink-0" />
                      <span className="truncate">Upload your avatar or organization logo (Max 10MB)</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#2160FF] bg-blue-50 px-2.5 py-1 rounded-lg shrink-0 group-hover:bg-blue-100 transition-colors">
                      Browse Image
                    </span>
                  </label>
                ) : (
                  <div className="flex items-center justify-between w-full p-2.5 bg-blue-50/50 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={photoPreview} alt="Preview" className="w-9 h-9 rounded-full object-cover border border-blue-300 shrink-0 shadow-sm" />
                      <div className="truncate">
                        <span className="text-xs font-semibold text-[#101A32] block truncate">Photo Attached</span>
                        <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Ready via Cloudinary
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {photoUploadError && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" /> {photoUploadError}
                  </p>
                )}
              </div>
            </div>

            {/* ── Section 4: Explicit Publication Consents ── */}
            <div className="space-y-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5">
              <h3 className="text-xs font-bold text-[#101A32] uppercase tracking-wider">
                Publication & Privacy Consents
              </h3>

              {/* Consent 1: Website Publication */}
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.publicationConsent}
                  onChange={e => setForm({ ...form, publicationConsent: e.target.checked })}
                  className="mt-0.5 w-4 h-4 text-[#2160FF] rounded border-slate-300 focus:ring-[#2160FF]"
                />
                <span className="text-xs text-[#334155] leading-relaxed">
                  <strong>Permission to publish testimonial:</strong> I grant Averqon permission to feature this feedback in the testimonials section of the public website. (If unchecked, this feedback remains strictly confidential for internal review only.)
                </span>
              </label>

              {/* Consent 2: Identity Display */}
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.identityDisplayConsent}
                  disabled={!form.publicationConsent}
                  onChange={e => setForm({ ...form, identityDisplayConsent: e.target.checked })}
                  className="mt-0.5 w-4 h-4 text-[#2160FF] rounded border-slate-300 focus:ring-[#2160FF] disabled:opacity-40"
                />
                <span className={`text-xs leading-relaxed ${form.publicationConsent ? 'text-[#334155]' : 'text-[#94A3B8]'}`}>
                  <strong>Permission to display name & company:</strong> I consent to displaying my full name and company name alongside the testimonial. (If unchecked, your review will be attributed as a "Verified Client").
                </span>
              </label>

              {/* Consent 3: Photo / Logo Display */}
              {photoPreview && (
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.imageDisplayConsent}
                    disabled={!form.publicationConsent}
                    onChange={e => setForm({ ...form, imageDisplayConsent: e.target.checked })}
                    className="mt-0.5 w-4 h-4 text-[#2160FF] rounded border-slate-300 focus:ring-[#2160FF] disabled:opacity-40"
                  />
                  <span className={`text-xs leading-relaxed ${form.publicationConsent ? 'text-[#334155]' : 'text-[#94A3B8]'}`}>
                    <strong>Permission to display profile photo / company logo:</strong> I consent to showing my uploaded image next to the review on the website.
                  </span>
                </label>
              )}
            </div>

            {/* Footer & Submit Action */}
            <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[#64748B]">
                Your submission is secure and private to your authorized link.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-sm text-white bg-[#2160FF] hover:bg-blue-600 active:bg-blue-700 shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Submitting Feedback...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
