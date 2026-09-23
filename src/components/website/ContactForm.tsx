"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";

type ContactFormProps = {
  locale: Locale;
  /** International format without + or spaces. Example: "971555449975" */
  whatsappNumber: string;
};

type FormState = {
  name: string;
  phone: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export function ContactForm({ locale, whatsappNumber }: ContactFormProps) {
  const isArabic = locale === "ar";

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (submitted) setSubmitted(false);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = isArabic
        ? "يرجى إدخال الاسم الكامل."
        : "Please enter your full name.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = isArabic
        ? "يرجى إدخال رقم الهاتف."
        : "Please enter your phone number.";
    } else if (!/^[+0-9\s()-]{7,}$/.test(form.phone.trim())) {
      nextErrors.phone = isArabic
        ? "رقم الهاتف غير صحيح."
        : "Please enter a valid phone number.";
    }

    if (form.message.trim().length < 12) {
      nextErrors.message = isArabic
        ? "يرجى كتابة رسالة واضحة."
        : "Please describe your enquiry in a little more detail.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitted(false);
      return;
    }

    // Build WhatsApp message
    const lines = isArabic
      ? [
          "مرحباً، أرغب بالتواصل معكم.",
          "",
          `الاسم: ${form.name}`,
          `رقم الهاتف: ${form.phone}`,
          "",
          "الرسالة:",
          form.message,
        ]
      : [
          "Hello, I would like to get in touch.",
          "",
          `Name: ${form.name}`,
          `Phone: ${form.phone}`,
          "",
          "Message:",
          form.message,
        ];

    const message = lines.join("\n");
    const href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message,
    )}`;

    window.open(href, "_blank", "noopener,noreferrer");

    setSubmitted(true);
    setErrors({});
    setForm({ name: "", phone: "", message: "" });
  };

  return (
    <div className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_18px_45px_rgba(122,28,81,0.06)] sm:p-8 lg:p-10">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal">
          {isArabic ? "اتصل بنا" : "Get in touch"}
        </p>
        <h3 className="mt-2 text-2xl font-black text-primary">
          {isArabic ? "أرسل لنا رسالتك" : "Send us a message"}
        </h3>
        <p className="mt-2 text-sm leading-7 text-foreground-muted">
          {isArabic
            ? "سيتم إرسال رسالتك مباشرة عبر واتساب."
            : "Your message will be sent directly via WhatsApp."}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block text-sm font-semibold text-foreground"
          >
            {isArabic ? "الاسم الكامل" : "Full Name"}
          </label>
          <input
            id="contact-name"
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
            className="h-12 w-full rounded-2xl border border-border-light bg-background-soft px-4 text-base text-foreground outline-none transition focus:border-teal focus:ring-2 focus:ring-mint-dark"
            placeholder={isArabic ? "اسمك الكامل" : "Your full name"}
          />
          {errors.name ? (
            <p className="mt-2 text-sm text-error">{errors.name}</p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="contact-phone"
            className="mb-2 block text-sm font-semibold text-foreground"
          >
            {isArabic ? "رقم الهاتف" : "Phone Number"}
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            className="h-12 w-full rounded-2xl border border-border-light bg-background-soft px-4 text-base text-foreground outline-none transition focus:border-teal focus:ring-2 focus:ring-mint-dark"
            placeholder="+963 9xx xxx xxx"
          />
          {errors.phone ? (
            <p className="mt-2 text-sm text-error">{errors.phone}</p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="mb-2 block text-sm font-semibold text-foreground"
          >
            {isArabic ? "الرسالة" : "Message"}
          </label>
          <textarea
            id="contact-message"
            value={form.message}
            onChange={(e) => handleChange("message", e.target.value)}
            aria-invalid={Boolean(errors.message)}
            className="min-h-32 w-full resize-none rounded-2xl border border-border-light bg-background-soft px-4 py-3 text-base text-foreground outline-none transition focus:border-teal focus:ring-2 focus:ring-mint-dark"
            placeholder={
              isArabic
                ? "أخبرنا كيف يمكننا مساعدتك؟"
                : "Tell us how we can help."
            }
          />
          {errors.message ? (
            <p className="mt-2 text-sm text-error">{errors.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white transition hover:brightness-95"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            {isArabic ? "إرسال عبر واتساب" : "Send via WhatsApp"}
          </button>

          {submitted ? (
            <p className="text-sm font-medium text-teal" role="status">
              {isArabic
                ? "تم فتح واتساب. أكمل الإرسال هناك."
                : "WhatsApp opened. Complete sending there."}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}