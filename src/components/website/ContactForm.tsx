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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (submitted) setSubmitted(false);
    if (submitError) setSubmitError(null);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
      setSubmitError(null);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: "",
          message: form.message.trim(),
          locale: isArabic ? "ar" : "en",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            (isArabic
              ? "تعذر إرسال رسالتك. حاول مرة أخرى."
              : "Your message could not be sent. Please try again."),
        );
      }

      setSubmitted(true);
      setErrors({});
      setForm({ name: "", phone: "", message: "" });
    } catch (error) {
      setSubmitted(false);
      setSubmitError(
        error instanceof Error
          ? error.message
          : isArabic
            ? "تعذر إرسال رسالتك. حاول مرة أخرى."
            : "Unable to send your message. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting
              ? isArabic
                ? "جارٍ الإرسال..."
                : "Sending..."
              : isArabic
                ? "إرسال الرسالة"
                : "Send message"}
          </button>

          {submitted ? (
            <p className="text-sm font-medium text-teal" role="status">
              {isArabic
                ? "تم إرسال رسالتك بنجاح. سنعاود التواصل معك قريبًا."
                : "Your message was sent successfully. We will get back to you soon."}
            </p>
          ) : null}

          {submitError ? (
            <p className="text-sm font-medium text-error" role="alert">
              {submitError}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}