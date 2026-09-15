"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";

type ContactFormProps = {
  locale: Locale;
};

type FormState = {
  name: string;
  phone: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export function ContactForm({ locale }: ContactFormProps) {
  const isArabic = locale === "ar";

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = isArabic ? "يرجى إدخال الاسم الكامل." : "Please enter your full name.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = isArabic ? "يرجى إدخال رقم الهاتف." : "Please enter your phone number.";
    } else if (!/^[+0-9\s()-]{7,}$/.test(form.phone.trim())) {
      nextErrors.phone = isArabic ? "رقم الهاتف غير صحيح." : "Please enter a valid phone number.";
    }

    if (form.message.trim().length < 12) {
      nextErrors.message = isArabic ? "يرجى كتابة رسالة واضحة." : "Please describe your enquiry in a little more detail.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitted(false);
      return;
    }

    setIsSubmitting(true);
    await Promise.resolve();
    setSubmitted(true);
    setIsSubmitting(false);
    setErrors({});
    setForm({ name: "", phone: "", message: "" });
  };

  return (
    <div className="rounded-[28px] border border-[#e5eeeb] bg-white p-6 shadow-[0_18px_45px_rgba(11,59,90,0.06)] sm:p-8 lg:p-10">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2b7a78]">
          {isArabic ? "اتصل بنا" : "Get in touch"}
        </p>
        <h3 className="mt-2 text-2xl font-black text-[#0b3b5a]">
          {isArabic ? "أرسل لنا رسالتك" : "Send us a message"}
        </h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-slate-700">
            {isArabic ? "الاسم الكامل" : "Full Name"}
          </label>
          <input
            id="contact-name"
            type="text"
            value={form.name}
            onChange={(event) => handleChange("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            className="h-12 w-full rounded-2xl border border-[#dfe9e6] bg-[#f9fbfb] px-4 text-base text-slate-800 outline-none transition focus:border-[#2b7a78] focus:ring-2 focus:ring-[#a8d5c6]"
            placeholder={isArabic ? "اسمك الكامل" : "Your full name"}
          />
          {errors.name ? <p className="mt-2 text-sm text-red-600">{errors.name}</p> : null}
        </div>

        <div>
          <label htmlFor="contact-phone" className="mb-2 block text-sm font-semibold text-slate-700">
            {isArabic ? "رقم الهاتف" : "Phone Number"}
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={form.phone}
            onChange={(event) => handleChange("phone", event.target.value)}
            aria-invalid={Boolean(errors.phone)}
            className="h-12 w-full rounded-2xl border border-[#dfe9e6] bg-[#f9fbfb] px-4 text-base text-slate-800 outline-none transition focus:border-[#2b7a78] focus:ring-2 focus:ring-[#a8d5c6]"
            placeholder={isArabic ? "+966 5xx xxx xxx" : "+966 5xx xxx xxx"}
          />
          {errors.phone ? <p className="mt-2 text-sm text-red-600">{errors.phone}</p> : null}
        </div>

        <div>
          <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-slate-700">
            {isArabic ? "الرسالة" : "Message"}
          </label>
          <textarea
            id="contact-message"
            value={form.message}
            onChange={(event) => handleChange("message", event.target.value)}
            aria-invalid={Boolean(errors.message)}
            className="min-h-32 w-full rounded-2xl border border-[#dfe9e6] bg-[#f9fbfb] px-4 py-3 text-base text-slate-800 outline-none transition focus:border-[#2b7a78] focus:ring-2 focus:ring-[#a8d5c6]"
            placeholder={isArabic ? "أخبرنا كيف يمكننا مساعدتك؟" : "Tell us how we can help."}
          />
          {errors.message ? <p className="mt-2 text-sm text-red-600">{errors.message}</p> : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#0b3b5a] px-6 text-sm font-semibold text-white transition hover:bg-[#194a69] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (isArabic ? "جارٍ الإرسال..." : "Sending...") : isArabic ? "إرسال الرسالة" : "Send message"}
          </button>

          {submitted ? (
            <p className="text-sm font-medium text-[#2b7a78]" role="status">
              {isArabic ? "تم استلام رسالتك بنجاح. سنعاود الاتصال بك قريباً." : "Your message has been received. We will be in touch shortly."}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
