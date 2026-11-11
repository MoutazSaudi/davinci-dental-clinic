"use client";
import { useEffect, useRef, useState } from "react";
import { useAdminT } from "@/app/hooks/useAdminT";
import { appointmentText, appointmentMessage } from "@/lib/i18n/appointments";
import { clinicDateInput, clinicTimeToIso } from "@/lib/appointments/time";
import { adminAppointmentSchema, appointmentPatchSchema } from "@/lib/validations/appointment";
import type { AppointmentAdmin, AppointmentData } from "./types";

const fieldClass = "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-sm text-[var(--color-foreground)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]";
export default function AppointmentForm({ item, data, onClose, onSave }: {
  item: AppointmentAdmin | null; data: AppointmentData; onClose: () => void;
  onSave: (body: Record<string, unknown>) => Promise<void>;
}) {
  const { t, locale, dir } = useAdminT();
  const text = appointmentText[locale];
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { dialog.current?.showModal(); }, []);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(item ? clinicDateInput(new Date(item.scheduledAt)) : "");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body: Record<string, unknown> = {
      patientName: String(form.get("patientName")),
      durationMinutes: Number(form.get("durationMinutes")),
      notes: String(form.get("notes") ?? ""), clinicalNotes: String(form.get("clinicalNotes") ?? ""),
    };
    if (!item || (item.serviceSlug ?? "") !== form.get("serviceSlug")) body.serviceSlug = String(form.get("serviceSlug"));
    if (!item || scheduledAt !== clinicDateInput(new Date(item.scheduledAt))) body.scheduledAt = clinicTimeToIso(scheduledAt);
    if (!item || item.capabilities.contact) {
      body.patientPhone = String(form.get("patientPhone")); body.patientEmail = String(form.get("patientEmail") ?? "");
      // Send consent changes only when changed, so unrelated edits never recreate a successful reminder.
      if (!item || item.emailReminderConsent !== form.has("emailReminderConsent")) body.emailReminderConsent = form.has("emailReminderConsent");
      if (!item || item.whatsappReminderConsent !== form.has("whatsappReminderConsent")) body.whatsappReminderConsent = form.has("whatsappReminderConsent");
    }
    if (!item) {
      body.locale = locale;
      if (data.capabilities.assign) body.doctorId = String(form.get("doctorId") ?? "") || null;
      body.status = String(form.get("status") ?? "PENDING");
      delete body.clinicalNotes; // Clinical notes can be added later by an authorized treating doctor.
    }
    const result = (item ? appointmentPatchSchema : adminAppointmentSchema).safeParse(body);
    if (!result.success) {
      const issue = result.error.issues[0];
      setError(appointmentMessage(issue.path[0] === "scheduledAt" ? "futureDate" : String(issue.path[0]), locale)); return;
    }
    setBusy(true); setError("");
    try { await onSave(result.data); onClose(); }
    catch (err) { setError(appointmentMessage(err instanceof Error ? err.message : "failed", locale)); }
    finally { setBusy(false); }
  }
  return <dialog ref={dialog} onCancel={onClose} aria-labelledby="appointment-form-title" dir={dir} className="m-auto max-h-[90dvh] w-[min(95vw,42rem)] overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-[var(--color-foreground)] shadow-xl backdrop:bg-black/50">
    <h2 id="appointment-form-title" className="mb-4 text-xl font-bold">{item ? text.edit : text.create}</h2>
    <p className="mb-4 text-sm text-[var(--color-foreground-muted)]">{text.timezone}</p>
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label>{t.appointments.patient}<input name="patientName" required defaultValue={item?.patientName} className={fieldClass} /></label>
        <label>{text.duration}<input name="durationMinutes" type="number" min={5} max={480} required defaultValue={item?.durationMinutes ?? 30} className={fieldClass} /></label>
        {(!item || item.capabilities.contact) && <>
          <label>{t.appointments.phone}<input name="patientPhone" type="tel" required dir="ltr" defaultValue={item?.patientPhone ?? ""} className={fieldClass} /></label>
          <label>{t.appointments.email}<input name="patientEmail" type="email" dir="ltr" defaultValue={item?.patientEmail ?? ""} className={fieldClass} /></label>
        </>}
        <label>{t.appointments.scheduled}<input type="datetime-local" required value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} className={fieldClass} dir="ltr" /></label>
        <label>{t.appointments.service}<select name="serviceSlug" required={!item || !!item.serviceSlug} defaultValue={item?.serviceSlug ?? ""} className={fieldClass}>
          <option value="">{text.selectService}</option>
          {data.services.map(s => <option key={s.slug} value={s.slug}>{s.title[locale]}</option>)}
          {item?.serviceSlug && !data.services.some(s => s.slug === item.serviceSlug) && <option value={item.serviceSlug}>{item.serviceSlug}</option>}
        </select></label>
        {!item && data.capabilities.assign && <label>{t.appointments.doctor}<select name="doctorId" className={fieldClass}><option value="">{t.appointments.unassignedShort}</option>{data.doctors.map(d => <option key={d.id} value={d.id}>{d.name[locale]}</option>)}</select></label>}
        {!item && data.capabilities.status && <label>{t.common.status}<select name="status" className={fieldClass}><option value="PENDING">{t.status.PENDING}</option><option value="CONFIRMED">{t.status.CONFIRMED}</option></select></label>}
      </div>
      <label className="block">{text.adminNotes}<textarea name="notes" defaultValue={item?.notes ?? ""} maxLength={5000} className={fieldClass} /></label>
      {item && <label className="block">{text.clinicalNotes}<textarea name="clinicalNotes" defaultValue={item.clinicalNotes ?? ""} maxLength={10000} className={fieldClass} /></label>}
      {(!item || item.capabilities.contact) && <fieldset className="space-y-2"><legend className="text-sm">{text.consentHint}</legend>
        <label className="flex items-start gap-2"><input name="emailReminderConsent" type="checkbox" defaultChecked={item?.emailReminderConsent} />{text.emailConsent}</label>
        <label className="flex items-start gap-2"><input name="whatsappReminderConsent" type="checkbox" defaultChecked={item?.whatsappReminderConsent} />{text.whatsappConsent}</label>
      </fieldset>}
      {error && <p role="alert" className="text-sm text-red-600 dark:text-red-300">{error}</p>}
      <div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-lg border px-4 py-2">{t.common.close}</button><button disabled={busy} className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-white disabled:opacity-50">{busy ? t.common.saving : text.save}</button></div>
    </form>
  </dialog>;
}
