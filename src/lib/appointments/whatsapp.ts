import { formatClinicTime, normalizePhone } from "./time";

export function whatsappReminderUrl(phone: string, scheduledAt: Date | string): string | null {
  const normalized = normalizePhone(phone);
  if (!normalized) return null;
  const message = `تذكير بموعدكم بتاريخ ${formatClinicTime(scheduledAt)} بتوقيت دمشق. يرجى التواصل مع العيادة عند الحاجة لتغيير الموعد.`;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
