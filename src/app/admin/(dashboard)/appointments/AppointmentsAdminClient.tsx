"use client";
import { useEffect, useMemo, useState } from "react";
import { useAdminT } from "@/app/hooks/useAdminT";
import { appointmentText, appointmentMessage } from "@/lib/i18n/appointments";
import { clinicDateInput, clinicTimeToIso, formatClinicTime } from "@/lib/appointments/time";
import { whatsappReminderUrl } from "@/lib/appointments/whatsapp";
import { TRANSITIONS } from "@/lib/appointments/policy";
import type { AppointmentAdmin, AppointmentData, AppointmentStatus } from "./types";
import AppointmentForm from "./AppointmentForm";
import AdminTable from "@/components/admin/AdminTable";

const input = "min-w-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-sm text-[var(--color-foreground)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]";
const button = "rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm hover:bg-[var(--color-background-soft)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] disabled:opacity-50";
const statusStyle = { PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300", CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300", CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300", COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300", NO_SHOW: "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300" };
type View = "day" | "week" | "month" | "list";
function addDays(value: string, count: number) { const d = new Date(`${value}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + count); return d.toISOString().slice(0, 10); }
function viewDates(view: View, date: string) {
  if (view === "day") return [date];
  const start = view === "month" ? `${date.slice(0, 7)}-01` : addDays(date, -new Date(`${date}T12:00:00Z`).getUTCDay());
  const count = view === "month" ? new Date(Number(date.slice(0, 4)), Number(date.slice(5, 7)), 0).getDate() : 7;
  return Array.from({ length: count }, (_, i) => addDays(start, i));
}
export default function AppointmentsAdminClient() {
  const { t, locale, dir } = useAdminT();
  const text = appointmentText[locale];
  const [data, setData] = useState<AppointmentData | null>(null);
  const [view, setView] = useState<View>("list");
  const [date, setDate] = useState(clinicDateInput().slice(0, 10));
  const [doctor, setDoctor] = useState("");
  const [status, setStatus] = useState("");
  const [patient, setPatient] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [reminderPage, setReminderPage] = useState(1);
  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<AppointmentAdmin | "new" | null>(null);
  const [detail, setDetail] = useState<string | null>(null);
  const dates = useMemo(() => viewDates(view, date), [view, date]);
  const query = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), reminderPage: String(reminderPage), pageSize: view === "list" ? "20" : "100" });
    if (doctor) params.set("doctorId", doctor);
    if (status) params.set("status", status);
    if (patient) params.set("patient", patient);
    const start = view === "list" ? from : dates[0];
    const end = view === "list" ? (to ? addDays(to, 1) : "") : addDays(dates[dates.length - 1], 1);
    if (start) params.set("from", clinicTimeToIso(`${start}T00:00`));
    if (end) params.set("to", clinicTimeToIso(`${end}T00:00`));
    return params.toString();
  }, [page, reminderPage, view, doctor, status, patient, from, to, dates]);
  useEffect(() => {
    const controller = new AbortController();
    void fetch(`/api/admin/appointments?${query}`, { cache: "no-store", signal: controller.signal }).then(async res => {
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "failed");
      setData(payload);
    }).catch(err => { if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "failed"); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [query, version]);
  function filter(action: () => void) { setLoading(true); setError(""); action(); setPage(1); setDetail(null); }
  async function request(url: string, method: string, body: Record<string, unknown>) {
    setBusy(true); setError(""); setNotice("");
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "failed");
      setLoading(true); setVersion(v => v + 1); setNotice(text.saved);
    } finally { setBusy(false); }
  }
  async function change(a: AppointmentAdmin, body: Record<string, unknown>) {
    if (body.status === "CANCELLED" && !window.confirm(text.cancelConfirm)) return;
    try { await request(`/api/admin/appointments?id=${encodeURIComponent(a.id)}`, "PATCH", body); }
    catch (err) { setError(err instanceof Error ? err.message : "failed"); }
  }
  async function markReminder(id: string, retry = false) {
    if (!window.confirm(text.sentConfirm)) return;
    try { await request("/api/admin/appointments/reminders", "POST", { id, retry }); }
    catch (err) { setError(err instanceof Error ? err.message : "failed"); }
  }
  function actions(a: AppointmentAdmin) {
    const transitions = (TRANSITIONS[a.status] as readonly AppointmentStatus[]).filter(s => s === "CANCELLED" ? a.capabilities.cancel : a.capabilities.status);
    return <div className="flex flex-wrap gap-2">
      <button className={button} onClick={() => setDetail(detail === a.id ? null : a.id)}>{t.appointments.view}</button>
      {a.capabilities.edit && <button className={button} disabled={busy} onClick={() => setEditing(a)}>{text.edit}</button>}
      {transitions.map(s => <button key={s} className={button} disabled={busy} onClick={() => void change(a, { status: s })}>{s === "CANCELLED" ? text.cancel : t.status[s]}</button>)}
    </div>;
  }
  function doctorField(a: AppointmentAdmin) {
    return a.capabilities.assign ? <select aria-label={`${t.appointments.doctor}: ${a.patientName}`} className={input} value={a.doctor?.id ?? ""} disabled={busy} onChange={e => void change(a, { doctorId: e.target.value || null })}>
      <option value="">{t.appointments.unassignedShort}</option>{data?.doctors.map(d => <option key={d.id} value={d.id}>{d.name[locale]}</option>)}
      {a.doctor && !data?.doctors.some(d => d.id === a.doctor?.id) && <option value={a.doctor.id}>{a.doctor.name[locale]}</option>}
    </select> : <span>{a.doctor?.name[locale] || t.appointments.unassignedShort}</span>;
  }
  function patientInfo(a: AppointmentAdmin) { return <div><strong>{a.patientName}</strong>{a.patientPhone && <p dir="ltr" className="text-xs">{a.patientPhone}</p>}{a.patientEmail && <p className="break-all text-xs">{a.patientEmail}</p>}</div>; }
  const selected = data?.items.find(a => a.id === detail);
  return <div dir={dir} className="space-y-6 text-[var(--color-foreground)]">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-bold text-[var(--color-primary)]">{t.appointments.title}</h1><p className="mt-1 text-sm text-[var(--color-foreground-muted)]">{t.appointments.description} {text.timezone}</p></div>{data?.capabilities.create && <button className={`${button} bg-[var(--color-primary)] text-white`} onClick={() => setEditing("new")}>{text.create}</button>}</div>
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="mb-4 flex flex-wrap gap-2">{(["day", "week", "month", "list"] as const).map(v => <button key={v} className={`${button} ${view === v ? "bg-[var(--color-primary)] text-white" : ""}`} aria-pressed={view === v} onClick={() => filter(() => setView(v))}>{text[v]}</button>)}</div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm">{t.appointments.doctor}<select className={input} value={doctor} onChange={e => filter(() => setDoctor(e.target.value))}><option value="">{text.all}</option>{data?.doctors.map(d => <option key={d.id} value={d.id}>{d.name[locale]}</option>)}</select></label>
        <label className="flex flex-col gap-1 text-sm">{t.common.status}<select className={input} value={status} onChange={e => filter(() => setStatus(e.target.value))}><option value="">{text.all}</option>{Object.keys(statusStyle).map(s => <option key={s} value={s}>{t.status[s as AppointmentStatus]}</option>)}</select></label>
        <label className="flex flex-col gap-1 text-sm">{text.patient}<input type="search" className={input} value={patient} onChange={e => filter(() => setPatient(e.target.value))} /></label>
        {view !== "list" ? <label className="flex flex-col gap-1 text-sm">{text.date}<input type="date" className={input} value={date} required onChange={e => { if (e.target.value) filter(() => setDate(e.target.value)); }} /></label> : <div className="grid grid-cols-2 gap-2"><label className="flex flex-col gap-1 text-sm">{text.from}<input type="date" className={input} value={from} onChange={e => filter(() => setFrom(e.target.value))} /></label><label className="flex flex-col gap-1 text-sm">{text.to}<input type="date" className={input} value={to} onChange={e => filter(() => setTo(e.target.value))} /></label></div>}
      </div>
    </div>
    {error && <p role="alert" className="rounded-lg border border-red-300 p-3 text-red-600 dark:text-red-300">{appointmentMessage(error, locale)} <button className={button} onClick={() => { setLoading(true); setVersion(v => v + 1); }}>{text.refresh}</button></p>}
    {notice && <p role="status" className="text-sm text-[var(--color-primary)]">{notice}</p>}
    {loading ? <p role="status">{t.appointments.loading}</p> : data && <>
      <p className="text-sm text-[var(--color-foreground-muted)]">{t.appointments.statTotal}: {data.total}</p>
      {view === "list" ? <AdminTable<AppointmentAdmin>
        items={data.items}
        pageSize={data.pageSize}
        page={page}
        totalItems={data.total}
        onPageChange={nextPage => { setLoading(true); setPage(nextPage); }}
        emptyMessage={t.appointments.empty}
        headers={<tr>{[t.appointments.patient, t.appointments.scheduled, t.appointments.doctor, t.appointments.service, t.common.status, t.common.actions].map(h => <th key={h} className="p-3 text-start">{h}</th>)}</tr>}
        renderRow={a => <>
          <td className="p-3">{patientInfo(a)}</td>
          <td className="p-3">{formatClinicTime(a.scheduledAt, locale)}<p className="text-xs">{a.durationMinutes} {text.minutes}</p></td>
          <td className="p-3">{doctorField(a)}</td>
          <td className="p-3">{data.services.find(s => s.slug === a.serviceSlug)?.title[locale] || a.serviceSlug || "—"}</td>
          <td className="p-3"><span className={`rounded-full px-2 py-1 text-xs ${statusStyle[a.status]}`}>{t.status[a.status]}</span></td>
          <td className="p-3">{actions(a)}</td>
        </>}
      /> : <div className={`grid gap-3 ${view === "day" ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-7"}`}>
        {dates.map(d => <section key={d} className="min-w-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3"><h2 className="mb-3 text-sm font-bold">{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`))}</h2><div className="space-y-3">{data.items.filter(a => clinicDateInput(new Date(a.scheduledAt)).startsWith(d)).map(a => <article key={a.id} className="space-y-2 rounded-lg border border-[var(--color-border)] p-2 text-xs">{patientInfo(a)}<p>{formatClinicTime(a.scheduledAt, locale)}</p>{doctorField(a)}<p className={`rounded px-2 py-1 ${statusStyle[a.status]}`}>{t.status[a.status]}</p>{actions(a)}</article>)}</div></section>)}
      </div>}
      {view !== "list" && <div className="flex flex-wrap items-center justify-between gap-2"><button className={button} disabled={page <= 1} onClick={() => { setLoading(true); setPage(p => p - 1); }}>{text.previous}</button><span className="text-sm">{text.page} {page} / {Math.max(1, Math.ceil(data.total / data.pageSize))}</span><button className={button} disabled={page * data.pageSize >= data.total} onClick={() => { setLoading(true); setPage(p => p + 1); }}>{text.next}</button></div>}
      {data.capabilities.reminders && <section className="space-y-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"><h2 className="text-xl font-bold">{text.reminders}</h2>{!data.needingReminders.length && <p className="text-sm">{t.appointments.empty}</p>}{data.needingReminders.map(a => <article key={a.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-3"><div><strong>{a.patientName}</strong><p className="text-sm">{formatClinicTime(a.scheduledAt, locale)}</p></div><div className="flex flex-wrap gap-2"><a className={button} href={a.whatsappUrl} target="_blank" rel="noopener noreferrer">{text.openWhatsApp}</a><button className={button} disabled={busy} onClick={() => void markReminder(a.id)}>{text.markSent}</button></div></article>)}
        <div className="flex justify-between gap-2">
          <button className={button} disabled={data.reminderPage <= 1} onClick={() => { setLoading(true); setReminderPage(p => p - 1); }}>{text.previous}</button>
          <span>{text.page} {data.reminderPage}</span>
          <button className={button} disabled={!data.reminderNextPage} onClick={() => { setLoading(true); setReminderPage(p => p + 1); }}>{text.next}</button>
        </div>
      </section>}
    </>}
    {selected && <section className="space-y-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4" aria-label={t.appointments.detailsTitle}>
      <div className="flex justify-between gap-3"><h2 className="text-xl font-bold">{selected.patientName}</h2><button className={button} onClick={() => setDetail(null)}>{t.common.close}</button></div>
      {selected.capabilities.edit && <><h3 className="font-semibold">{text.adminNotes}</h3><p className="whitespace-pre-wrap">{selected.notes || "—"}</p><h3 className="font-semibold">{text.clinicalNotes}</h3><p className="whitespace-pre-wrap">{selected.clinicalNotes || "—"}</p></>}
      <h3 className="font-semibold">{text.reminderHistory}</h3>
      {selected.reminders.map(r => <div key={r.id} className="flex flex-wrap items-center gap-3 border-t border-[var(--color-border)] py-2 text-sm"><span>{text[r.channel]} · {r.channel === "WHATSAPP" && r.status === "SENT" ? text.manualSent : text[r.status]} · {r.attempts}</span><span>{formatClinicTime(r.sentAt || r.scheduledAt, locale)}</span>{r.staffId && <span>{r.staffId}</span>}{r.error && <span className="text-red-600 dark:text-red-300">{appointmentMessage(r.error, locale)}</span>}{r.channel === "WHATSAPP" && r.sentAt && r.revision === selected.reminderRevision && selected.capabilities.remind && whatsappReminderUrl(selected.patientPhone ?? "", selected.scheduledAt) && <><a className={button} href={whatsappReminderUrl(selected.patientPhone ?? "", selected.scheduledAt) ?? undefined} target="_blank" rel="noopener noreferrer">{text.openWhatsApp}</a><button className={button} disabled={busy} onClick={() => void markReminder(selected.id, true)}>{text.retry}</button></>}</div>)}
      <h3 className="font-semibold">{text.history}</h3>{selected.events.map(e => <div key={e.id} className="border-t border-[var(--color-border)] py-2 text-sm"><p>{appointmentMessage(e.action, locale)} · {formatClinicTime(e.createdAt, locale)} · {e.actor || "—"}</p>{e.changes?.fromStatus && e.changes?.toStatus && <p>{t.status[e.changes.fromStatus]} → {t.status[e.changes.toStatus]}</p>}{e.changes?.fromTime && e.changes?.toTime && <p>{formatClinicTime(e.changes.fromTime, locale)} → {formatClinicTime(e.changes.toTime, locale)}</p>}</div>)}
    </section>}
    {editing && data && <AppointmentForm item={editing === "new" ? null : editing} data={data} onClose={() => setEditing(null)} onSave={body => request(editing === "new" ? "/api/admin/appointments" : `/api/admin/appointments?id=${encodeURIComponent(editing.id)}`, editing === "new" ? "POST" : "PATCH", body)} />}
  </div>;
}
