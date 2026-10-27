"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { Toast, type ToastVariant } from "@/components/ui/Toast";

export type ContactDoctorOption = {
  id: string;
  slug: string;
  name: { ar: string; en: string };
};

export type ContactServiceOption = {
  slug: string;
  title: { ar: string; en: string };
};

type ContactFormProps = {
  locale: Locale;
  /** International format without + or spaces. Example: "971555449975" */
  whatsappNumber: string;
  doctors?: ContactDoctorOption[];
  services?: ContactServiceOption[];
  /** Prefill doctor when coming from /doctors → "Book with doctor" */
  initialDoctorSlug?: string;
  /** Prefill service when coming from a service page */
  initialServiceSlug?: string;
};

type RequestType = "inquiry" | "booking";

type FormState = {
  name: string;
  phone: string;
  email: string;
  message: string;
  scheduledAt: string;
  doctorSlug: string;
  serviceSlug: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export function ContactForm({
  locale,
  whatsappNumber,
  doctors = [],
  services = [],
  initialDoctorSlug,
  initialServiceSlug,
}: ContactFormProps) {
  const isArabic = locale === "ar";

  const [type, setType] = useState<RequestType>(
    initialDoctorSlug || initialServiceSlug ? "booking" : "inquiry"
  );

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    message: "",
    scheduledAt: "",
    doctorSlug: initialDoctorSlug ?? "",
    serviceSlug: initialServiceSlug ?? "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    variant: ToastVariant;
    message: string;
  } | null>(null);

  // Keep prefill in sync if URL changes via client-side navigation
  useEffect(() => {
    if (initialDoctorSlug) {
      setForm((f) => ({ ...f, doctorSlug: initialDoctorSlug }));
      setType("booking");
    }
    if (initialServiceSlug) {
      setForm((f) => ({ ...f, serviceSlug: initialServiceSlug }));
      setType("booking");
    }
  }, [initialDoctorSlug, initialServiceSlug]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const switchType = (next: RequestType) => {
    setType(next);
    setErrors({});
  };

  /* ─────────────── Validation ─────────────── */

  function validate(): FormErrors {
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
    } else if (!/^[+0-9\s()\-]{7,}$/.test(form.phone.trim())) {
      nextErrors.phone = isArabic
        ? "رقم الهاتف غير صحيح."
        : "Please enter a valid phone number.";
    }

    if (type === "inquiry") {
      if (form.message.trim().length < 12) {
        nextErrors.message = isArabic
          ? "يرجى كتابة رسالة واضحة."
          : "Please describe your enquiry in a little more detail.";
      }
    } else {
      if (!form.scheduledAt) {
        nextErrors.scheduledAt = isArabic
          ? "يرجى تحديد التاريخ والوقت."
          : "Please choose a date and time.";
      } else if (new Date(form.scheduledAt).getTime() < Date.now() - 60_000) {
        nextErrors.scheduledAt = isArabic
          ? "لا يمكن اختيار وقت في الماضي."
          : "The selected time is in the past.";
      }
    }

    return nextErrors;
  }

  /* ─────────────── Submit ─────────────── */

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setToast(null);

    try {
      if (type === "inquiry") {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim() || "",
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
                : "Your message could not be sent. Please try again.")
          );
        }

        setToast({
          variant: "success",
          message: isArabic
            ? "تم استلام استفسارك بنجاح. سنعاود التواصل معك قريبًا."
            : "Your inquiry was received. We'll get back to you soon.",
        });
      } else {
        const selectedDoctor = doctors.find(
          (d) => d.slug === form.doctorSlug
        );

        const response = await fetch("/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientName: form.name.trim(),
            patientPhone: form.phone.trim(),
            patientEmail: form.email.trim() || undefined,
            scheduledAt: new Date(form.scheduledAt).toISOString(),
            doctorId: selectedDoctor?.id || undefined,
            serviceSlug: form.serviceSlug || undefined,
            notes: form.message.trim() || undefined,
            locale: isArabic ? "ar" : "en",
          }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.message ||
              (isArabic
                ? "تعذر إرسال طلب الحجز. حاول مرة أخرى."
                : "Your booking could not be sent. Please try again.")
          );
        }

        setToast({
          variant: "success",
          message: isArabic
            ? "تم استلام طلب الحجز بنجاح. سنؤكد الموعد ونبلغك قريبًا."
            : "Your booking request was received. We'll confirm shortly.",
        });
      }

      // Reset form (keep prefilled doctor/service)
      setForm({
        name: "",
        phone: "",
        email: "",
        message: "",
        scheduledAt: "",
        doctorSlug: initialDoctorSlug ?? "",
        serviceSlug: initialServiceSlug ?? "",
      });
      setErrors({});
    } catch (err) {
      setToast({
        variant: "error",
        message:
          err instanceof Error
            ? err.message
            : isArabic
            ? "تعذر إرسال الطلب. حاول مرة أخرى."
            : "Unable to send. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─────────────── UI helpers ─────────────── */

  const inputBase =
    "h-12 w-full rounded-2xl border bg-background-soft px-4 text-base text-foreground outline-none transition focus:ring-2 focus:ring-mint-dark";
  const inputOk = "border-border-light focus:border-teal";
  const inputErr = "border-red-300 focus:border-red-400";

  const labelClass =
    "mb-2 block text-sm font-semibold text-foreground";

  const minDateTime = (() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  })();

  const submitLabel = isSubmitting
    ? isArabic
      ? "جارٍ الإرسال..."
      : "Sending..."
    : type === "inquiry"
    ? isArabic
      ? "إرسال الاستفسار"
      : "Send inquiry"
    : isArabic
    ? "طلب الحجز"
    : "Request booking";

  return (
    <>
      {toast && (
        <Toast
          variant={toast.variant}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_18px_45px_rgba(122,28,81,0.06)] sm:p-8 lg:p-10">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal">
            {isArabic ? "اتصل بنا" : "Get in touch"}
          </p>
          <h3 className="mt-2 text-2xl font-black text-primary">
            {isArabic ? "كيف يمكننا مساعدتك؟" : "How can we help you?"}
          </h3>
          <p className="mt-2 text-sm leading-7 text-foreground-muted">
            {isArabic
              ? "اختر نوع الطلب: استفسار عام أو حجز موعد مع طبيب."
              : "Choose your request type: general inquiry or a doctor appointment."}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {/* ═══ Type selector ═══ */}
          <div>
            <p className="mb-2 block text-sm font-semibold text-foreground">
              {isArabic ? "نوع الطلب" : "Request type"}
            </p>
            <div className="grid grid-cols-2 gap-1.5 rounded-2xl border border-border-light bg-background-soft p-1.5">
              <button
                type="button"
                onClick={() => switchType("inquiry")}
                aria-pressed={type === "inquiry"}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  type === "inquiry"
                    ? "bg-primary text-white shadow-[0_6px_18px_rgba(122,28,81,0.25)]"
                    : "text-foreground-muted hover:text-primary"
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                {isArabic ? "استفسار" : "Inquiry"}
              </button>
              <button
                type="button"
                onClick={() => switchType("booking")}
                aria-pressed={type === "booking"}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  type === "booking"
                    ? "bg-primary text-white shadow-[0_6px_18px_rgba(122,28,81,0.25)]"
                    : "text-foreground-muted hover:text-primary"
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {isArabic ? "حجز موعد" : "Booking"}
              </button>
            </div>
          </div>

          {/* ═══ Name ═══ */}
          <div>
            <label htmlFor="contact-name" className={labelClass}>
              {isArabic ? "الاسم الكامل" : "Full Name"}
            </label>
            <input
              id="contact-name"
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              aria-invalid={Boolean(errors.name)}
              className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
              placeholder={isArabic ? "اسمك الكامل" : "Your full name"}
              autoComplete="name"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-error">{errors.name}</p>
            )}
          </div>

          {/* ═══ Phone + Email ═══ */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-phone" className={labelClass}>
                {isArabic ? "رقم الهاتف" : "Phone Number"}
              </label>
              <input
                id="contact-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                aria-invalid={Boolean(errors.phone)}
                className={`${inputBase} ${errors.phone ? inputErr : inputOk}`}
                placeholder="+963 9xx xxx xxx"
                autoComplete="tel"
                dir="ltr"
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-error">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="contact-email" className={labelClass}>
                {isArabic ? "البريد الإلكتروني (اختياري)" : "Email (optional)"}
              </label>
              <input
                id="contact-email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`${inputBase} ${inputOk}`}
                placeholder="example@mail.com"
                autoComplete="email"
                dir="ltr"
              />
            </div>
          </div>

          {/* ═══ Booking-only fields ═══ */}
          {type === "booking" && (
            <div
              className="rounded-2xl border border-dashed p-4 space-y-4"
              style={{
                borderColor: "rgba(94,156,141,0.5)",
                backgroundColor: "rgba(216,240,228,0.4)",
                animation: "fadeIn 0.2s ease-out",
              }}
            >
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-teal">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {isArabic ? "تفاصيل الموعد" : "Appointment details"}
              </p>

              <div>
                <label htmlFor="contact-date" className={labelClass}>
                  {isArabic ? "التاريخ والوقت المفضل" : "Preferred date & time"}
                </label>
                <input
                  id="contact-date"
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => handleChange("scheduledAt", e.target.value)}
                  min={minDateTime}
                  aria-invalid={Boolean(errors.scheduledAt)}
                  className={`${inputBase} ${errors.scheduledAt ? inputErr : inputOk}`}
                  dir="ltr"
                />
                {errors.scheduledAt && (
                  <p className="mt-2 text-sm text-error">{errors.scheduledAt}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-doctor" className={labelClass}>
                    {isArabic ? "الطبيب (اختياري)" : "Doctor (optional)"}
                  </label>
                  <select
                    id="contact-doctor"
                    value={form.doctorSlug}
                    onChange={(e) => handleChange("doctorSlug", e.target.value)}
                    className={`${inputBase} ${inputOk}`}
                    disabled={doctors.length === 0}
                  >
                    <option value="">
                      {doctors.length === 0
                        ? isArabic
                          ? "لا يوجد أطباء متاحون حاليًا"
                          : "No doctors available"
                        : isArabic
                        ? "أي طبيب متاح"
                        : "Any available doctor"}
                    </option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.slug}>
                        {d.name[locale]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-service" className={labelClass}>
                    {isArabic ? "الخدمة (اختياري)" : "Service (optional)"}
                  </label>
                  <select
                    id="contact-service"
                    value={form.serviceSlug}
                    onChange={(e) => handleChange("serviceSlug", e.target.value)}
                    className={`${inputBase} ${inputOk}`}
                    disabled={services.length === 0}
                  >
                    <option value="">
                      {services.length === 0
                        ? isArabic
                          ? "لا توجد خدمات متاحة حاليًا"
                          : "No services available"
                        : isArabic
                        ? "أي خدمة"
                        : "Any service"}
                    </option>
                    {services.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.title[locale]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ═══ Message ═══ */}
          <div>
            <label htmlFor="contact-message" className={labelClass}>
              {type === "inquiry"
                ? isArabic
                  ? "الرسالة"
                  : "Message"
                : isArabic
                ? "ملاحظات إضافية (اختياري)"
                : "Additional notes (optional)"}
            </label>
            <textarea
              id="contact-message"
              value={form.message}
              onChange={(e) => handleChange("message", e.target.value)}
              aria-invalid={Boolean(errors.message)}
              className={`min-h-32 w-full resize-none rounded-2xl border bg-background-soft px-4 py-3 text-base text-foreground outline-none transition focus:ring-2 focus:ring-mint-dark ${
                errors.message ? inputErr : inputOk
              }`}
              placeholder={
                isArabic
                  ? "أخبرنا كيف يمكننا مساعدتك؟"
                  : "Tell us how we can help."
              }
            />
            {errors.message && (
              <p className="mt-2 text-sm text-error">{errors.message}</p>
            )}
          </div>

          {/* ═══ Submit ═══ */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-spin"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            )}
            {submitLabel}
          </button>
        </form>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}