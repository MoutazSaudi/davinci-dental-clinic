export const CLINIC_TIMEZONE = "Asia/Damascus";
export const DAY_MS = 24 * 60 * 60 * 1000;

export function clinicDateInput(date: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: CLINIC_TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const part = (type: string) => parts.find(p => p.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}

// Resolve wall time through Intl so the host/browser timezone never determines booking time.
export function clinicTimeToIso(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return "";
  const wall = Date.parse(`${value}:00Z`);
  if (!Number.isFinite(wall)) return "";
  let date = new Date(wall);
  for (let i = 0; i < 3; i++) {
    const rendered = Date.parse(`${clinicDateInput(date)}:00Z`);
    date = new Date(date.getTime() + wall - rendered);
  }
  return clinicDateInput(date) === value ? date.toISOString() : "";
}

export function reminderTime(scheduledAt: Date, now: Date) {
  return new Date(Math.max(now.getTime(), scheduledAt.getTime() - DAY_MS));
}

export function formatClinicTime(date: Date | string, locale: "ar" | "en" = "ar") {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SY" : "en-GB", {
    timeZone: CLINIC_TIMEZONE, dateStyle: "medium", timeStyle: "short",
  }).format(new Date(date));
}

export function normalizePhone(raw: string): string | null {
  if (!/^[+\d\s().-]+$/.test(raw)) return null;
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = `963${digits.slice(1)}`;
  else if (!raw.trim().startsWith("+") && /^9\d{8}$/.test(digits)) digits = `963${digits}`;
  return /^[1-9]\d{7,14}$/.test(digits) ? digits : null;
}
