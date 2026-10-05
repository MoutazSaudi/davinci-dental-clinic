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
      setSubmitError(null);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          locale: isArabic ? "ar" : "en",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            (isArabic
              ? "تعذر إرسال طلبك. حاول مرة أخرى."
              : "Your request could not be sent. Please try again."),
        );
      }

      setSubmitted(true);
      setErrors({});
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      setSubmitted(false);
      setSubmitError(
        error instanceof Error
          ? error.message
          : isArabic
            ? "تعذر إرسال طلبك. حاول مرة أخرى."
            : "Unable to send your request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_18px_45px_rgba(122,28,81,0.06)] sm:p-8">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal">
          {isArabic ? "طلب تفاصيل" : "Request details"}
        </p>
        <h3 className="mt-2 text-2xl font-black text-primary">
          {isArabic ? "اطلب معلومات أكثر عن الخدمة" : "Ask for more information"}
        </h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="service-name" className="mb-2 block text-sm font-semibold text-foreground">
            {isArabic ? "الاسم الكامل" : "Full Name"}
          </label>
          <input
            id="service-name"
            value={form.name}
            onChange={(event) => handleChange("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            className="h-12 w-full rounded-2xl border border-border-light bg-background-soft px-4 text-base text-foreground outline-none transition focus:border-teal focus:ring-2 focus:ring-mint-dark"
          />
          {errors.name ? <p className="mt-2 text-sm text-error">{errors.name}</p> : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="service-phone" className="mb-2 block text-sm font-semibold text-foreground">
              {isArabic ? "رقم الهاتف" : "Mobile Number"}
            </label>
            <input
              id="service-phone"
              type="tel"
              value={form.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
              aria-invalid={Boolean(errors.phone)}
              className="h-12 w-full rounded-2xl border border-border-light bg-background-soft px-4 text-base text-foreground outline-none transition focus:border-teal focus:ring-2 focus:ring-mint-dark"
            />
            {errors.phone ? <p className="mt-2 text-sm text-error">{errors.phone}</p> : null}
          </div>

          <div>
            <label htmlFor="service-email" className="mb-2 block text-sm font-semibold text-foreground">
              {isArabic ? "البريد الإلكتروني" : "Email"}
            </label>
            <input
              id="service-email"
              type="email"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              aria-invalid={Boolean(errors.email)}
              className="h-12 w-full rounded-2xl border border-border-light bg-background-soft px-4 text-base text-foreground outline-none transition focus:border-teal focus:ring-2 focus:ring-mint-dark"
            />
            {errors.email ? <p className="mt-2 text-sm text-error">{errors.email}</p> : null}
          </div>
        </div>

        <div>
          <label htmlFor="service-message" className="mb-2 block text-sm font-semibold text-foreground">
            {isArabic ? "الرسالة" : "Message"}
          </label>
          <textarea
            id="service-message"
            value={form.message}
            onChange={(event) => handleChange("message", event.target.value)}
            aria-invalid={Boolean(errors.message)}
            className="min-h-32 w-full rounded-2xl border border-border-light bg-background-soft px-4 py-3 text-base text-foreground outline-none transition focus:border-teal focus:ring-2 focus:ring-mint-dark"
            placeholder={isArabic ? "أخبرنا عن احتياجك" : "Tell us what you need"}
          />
          {errors.message ? <p className="mt-2 text-sm text-error">{errors.message}</p> : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting
            ? isArabic
              ? "جارٍ الإرسال..."
              : "Sending..."
            : isArabic
              ? "إرسال الطلب"
              : "Send request"}
        </button>

        {submitted ? (
          <p className="text-sm font-medium text-teal" role="status">
            {isArabic ? "تم إرسال طلبك. سنعاود التواصل معك قريبًا." : "Your request has been sent. We will contact you soon."}
          </p>
        ) : null}

        {submitError ? (
          <p className="text-sm font-medium text-error" role="alert">
            {submitError}
          </p>
        ) : null}
      </form>
    </div>
  );
}