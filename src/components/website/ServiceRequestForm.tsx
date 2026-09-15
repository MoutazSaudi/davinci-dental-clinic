"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";

type FormState = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

type ServiceRequestFormProps = {
  locale: Locale;
};

export function ServiceRequestForm({ locale }: ServiceRequestFormProps) {
  const isArabic = locale === "ar";

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = isArabic ? "يرجى إدخال الاسم." : "Please enter your name.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = isArabic ? "يرجى إدخال الهاتف." : "Please enter your phone number.";
    }

    if (!form.email.trim()) {
      nextErrors.email = isArabic ? "يرجى إدخال البريد الإلكتروني." : "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = isArabic ? "البريد الإلكتروني غير صحيح." : "Please enter a valid email address.";
    }

    if (form.message.trim().length < 12) {
      nextErrors.message = isArabic ? "يرجى كتابة رسالة مفصلة." : "Please give a bit more detail about your request.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitted(false);
      return;
    }

    setSubmitted(true);
    setErrors({});
    setForm({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <div className="rounded-[28px] border border-[#e5eeeb] bg-white p-6 shadow-[0_18px_45px_rgba(11,59,90,0.06)] sm:p-8">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2b7a78]">
          {isArabic ? "طلب تفاصيل" : "Request details"}
        </p>
        <h3 className="mt-2 text-2xl font-black text-[#0b3b5a]">
          {isArabic ? "اطلب معلومات أكثر عن الخدمة" : "Ask for more information"}
        </h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="service-name" className="mb-2 block text-sm font-semibold text-slate-700">
            {isArabic ? "الاسم الكامل" : "Full Name"}
          </label>
          <input
            id="service-name"
            value={form.name}
            onChange={(event) => handleChange("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            className="h-12 w-full rounded-2xl border border-[#dfe9e6] bg-[#f9fbfb] px-4 text-base text-slate-800 outline-none transition focus:border-[#2b7a78] focus:ring-2 focus:ring-[#a8d5c6]"
          />
          {errors.name ? <p className="mt-2 text-sm text-red-600">{errors.name}</p> : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="service-phone" className="mb-2 block text-sm font-semibold text-slate-700">
              {isArabic ? "رقم الهاتف" : "Mobile Number"}
            </label>
            <input
              id="service-phone"
              type="tel"
              value={form.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
              aria-invalid={Boolean(errors.phone)}
              className="h-12 w-full rounded-2xl border border-[#dfe9e6] bg-[#f9fbfb] px-4 text-base text-slate-800 outline-none transition focus:border-[#2b7a78] focus:ring-2 focus:ring-[#a8d5c6]"
            />
            {errors.phone ? <p className="mt-2 text-sm text-red-600">{errors.phone}</p> : null}
          </div>

          <div>
            <label htmlFor="service-email" className="mb-2 block text-sm font-semibold text-slate-700">
              {isArabic ? "البريد الإلكتروني" : "Email"}
            </label>
            <input
              id="service-email"
              type="email"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              aria-invalid={Boolean(errors.email)}
              className="h-12 w-full rounded-2xl border border-[#dfe9e6] bg-[#f9fbfb] px-4 text-base text-slate-800 outline-none transition focus:border-[#2b7a78] focus:ring-2 focus:ring-[#a8d5c6]"
            />
            {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email}</p> : null}
          </div>
        </div>

        <div>
          <label htmlFor="service-message" className="mb-2 block text-sm font-semibold text-slate-700">
            {isArabic ? "الرسالة" : "Message"}
          </label>
          <textarea
            id="service-message"
            value={form.message}
            onChange={(event) => handleChange("message", event.target.value)}
            aria-invalid={Boolean(errors.message)}
            className="min-h-32 w-full rounded-2xl border border-[#dfe9e6] bg-[#f9fbfb] px-4 py-3 text-base text-slate-800 outline-none transition focus:border-[#2b7a78] focus:ring-2 focus:ring-[#a8d5c6]"
            placeholder={isArabic ? "أخبرنا عن احتياجك" : "Tell us what you need"}
          />
          {errors.message ? <p className="mt-2 text-sm text-red-600">{errors.message}</p> : null}
        </div>

        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center rounded-full bg-[#0b3b5a] px-6 text-sm font-semibold text-white transition hover:bg-[#194a69]"
        >
          {isArabic ? "إرسال الطلب" : "Send request"}
        </button>

        {submitted ? (
          <p className="text-sm font-medium text-[#2b7a78]" role="status">
            {isArabic ? "تم إرسال طلبك. سنعاود التواصل معك قريبًا." : "Your request has been sent. We will contact you soon."}
          </p>
        ) : null}
      </form>
    </div>
  );
}
