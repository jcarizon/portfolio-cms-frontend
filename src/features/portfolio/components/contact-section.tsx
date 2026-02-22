'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { settingsApi } from '@/shared/lib/api';
import type { ContactSettings } from '@/shared/types';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const COOLDOWN_KEY = 'contact_last_sent';
const COOLDOWN_SECONDS = 60;

function getRemainingCooldown(): number {
  if (typeof window === 'undefined') return 0;
  const last = parseInt(localStorage.getItem(COOLDOWN_KEY) || '0', 10);
  const elapsed = Math.floor((Date.now() - last) / 1000);
  return Math.max(0, COOLDOWN_SECONDS - elapsed);
}

export function ContactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [cooldown, setCooldown] = useState(0);
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const sectionRef = useRef<HTMLElement>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsApi.getContact();
        setSettings(response.data);
      } catch {
        console.error('Failed to fetch contact settings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();

    const remaining = getRemainingCooldown();
    if (remaining > 0) {
      setCooldown(remaining);
      startCooldownTimer();
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => { if (cooldownRef.current) clearInterval(cooldownRef.current); };
  }, []);

  const startCooldownTimer = () => {
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      const remaining = getRemainingCooldown();
      setCooldown(remaining);
      if (remaining === 0 && cooldownRef.current) clearInterval(cooldownRef.current);
    }, 1000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setGlobalError(null);
  };

  const validate = (showSubjectField: boolean, requireSubject: boolean): boolean => {
    const errors: FieldErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim()) errors.name = 'Name is required.';
    else if (form.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';

    if (!form.email.trim()) errors.email = 'Email is required.';
    else if (!emailRegex.test(form.email.trim())) errors.email = 'Please enter a valid email address.';

    if (showSubjectField && requireSubject && !form.subject.trim()) {
      errors.subject = 'Subject is required.';
    }

    if (!form.message.trim()) errors.message = 'Message is required.';
    else if (form.message.trim().length < 10) errors.message = 'Message must be at least 10 characters.';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Honeypot — bots fill this, humans don't
    const honeypot = (e.currentTarget.elements.namedItem('_gotcha') as HTMLInputElement)?.value;
    if (honeypot) return;

    if (getRemainingCooldown() > 0) {
      setGlobalError(`Please wait ${getRemainingCooldown()} seconds before sending another message.`);
      return;
    }

    if (!validate(showSubjectField, requireSubject)) return;

    setIsSending(true);
    setGlobalError(null);

    try {
      await settingsApi.submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: showSubjectField && form.subject.trim() ? form.subject.trim() : undefined,
        message: form.message.trim(),
      });

      localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
      setCooldown(COOLDOWN_SECONDS);
      startCooldownTimer();
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setFieldErrors({});
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 429) {
        setGlobalError('Too many messages sent. Please wait before trying again.');
      } else if (status === 400) {
        const msg = err?.response?.data?.message;
        setGlobalError(Array.isArray(msg) ? msg.join(' ') : msg || 'Invalid input. Please check your fields.');
      } else if (status >= 500) {
        setGlobalError('Server error. Please try again later.');
      } else {
        setGlobalError('Failed to send message. Please check your connection and try again.');
      }
    } finally {
      setIsSending(false);
    }
  };

  const heading = settings?.heading || 'Get In Touch';
  const description = settings?.description || "I'm always open to discussing new opportunities, interesting projects, or potential collaborations.";
  const buttonText = settings?.buttonText || 'Send Message';
  const showSubjectField = settings?.showSubjectField ?? true;
  const requireSubject = settings?.requireSubject ?? false;

  return (
    <section id="contact" ref={sectionRef} className="section bg-white">
      <div className="container mx-auto px-5 max-w-2xl text-center">
        <h2 className="section-title">{heading}</h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
          </div>
        ) : submitted ? (
          <div
            className={cn(
              'flex flex-col items-center gap-4 py-12 transition-all duration-700',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
          >
            <CheckCircle className="w-16 h-16 text-green-500" />
            <h3 className="text-xl font-semibold text-neutral-800">Message sent!</h3>
            <p className="text-neutral-500">Thanks for reaching out. I'll get back to you soon.</p>
            {cooldown > 0 ? (
              <p className="text-sm text-neutral-400">You can send another message in {cooldown}s.</p>
            ) : (
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-primary-600 hover:underline text-sm"
              >
                Send another message
              </button>
            )}
          </div>
        ) : (
          <div
            className={cn(
              'transition-all duration-700',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
          >
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">{description}</p>

            <form onSubmit={handleSubmit} className="text-left space-y-4" noValidate>
              {/* Honeypot — hidden from real users, bots fill it */}
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors',
                      fieldErrors.name
                        ? 'border-red-400 focus:border-red-500 bg-red-50'
                        : 'border-neutral-200 focus:border-primary-500'
                    )}
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      {fieldErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors',
                      fieldErrors.email
                        ? 'border-red-400 focus:border-red-500 bg-red-50'
                        : 'border-neutral-200 focus:border-primary-500'
                    )}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
              </div>

              {showSubjectField && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Subject {requireSubject && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors',
                      fieldErrors.subject
                        ? 'border-red-400 focus:border-red-500 bg-red-50'
                        : 'border-neutral-200 focus:border-primary-500'
                    )}
                  />
                  {fieldErrors.subject && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      {fieldErrors.subject}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your message... (minimum 10 characters)"
                  rows={5}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors resize-none',
                    fieldErrors.message
                      ? 'border-red-400 focus:border-red-500 bg-red-50'
                      : 'border-neutral-200 focus:border-primary-500'
                  )}
                />
                {fieldErrors.message && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {fieldErrors.message}
                  </p>
                )}
              </div>

              {globalError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {globalError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSending || cooldown > 0}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : cooldown > 0 ? (
                  `Wait ${cooldown}s`
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {buttonText}
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
