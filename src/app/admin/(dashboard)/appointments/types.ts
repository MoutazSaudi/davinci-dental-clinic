export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW";

export type AppointmentAdmin = {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string | null;
  scheduledAt: string;
  status: AppointmentStatus;
  notes: string | null;
  serviceSlug: string | null;
  createdAt: string;
  updatedAt: string;
  doctor: {
    id: string;
    slug: string;
    name: { en: string; ar: string };
  } | null;
};

export type DoctorOption = {
  id: string;
  slug: string;
  name: { en: string; ar: string };
};

export const STATUS_LABEL: Record<AppointmentStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  NO_SHOW: "No-show",
};

export const STATUS_STYLES: Record<AppointmentStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-green-100 text-green-700",
  NO_SHOW: "bg-gray-200 text-gray-700",
};

export function formatDateTime(iso: string, locale: "ar" | "en"): string {
  try {
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-SY" : "en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}