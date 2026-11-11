import type { AdminPermission, AdminUserPublic } from "@/lib/auth";

export const APPOINTMENT_PERMISSIONS = [
  "APPOINTMENTS_VIEW_ALL", "APPOINTMENTS_CREATE", "APPOINTMENTS_UPDATE_OWN",
  "APPOINTMENTS_UPDATE_ANY", "APPOINTMENTS_ASSIGN", "APPOINTMENTS_CANCEL",
  "APPOINTMENTS_STATUS", "APPOINTMENTS_CONTACT", "APPOINTMENTS_REMIND",
] as const;

export function can(user: Pick<AdminUserPublic, "role" | "permissions">, permission: AdminPermission) {
  return user.role === "ADMIN" || user.permissions.includes(permission);
}

export function canViewSchedule(user: AdminUserPublic) {
  return can(user, "APPOINTMENTS_VIEW_ALL") || !!user.doctorId;
}

export function canEditAppointment(user: AdminUserPublic, doctorId: string | null) {
  return can(user, "APPOINTMENTS_UPDATE_ANY") ||
    (!!doctorId && user.doctorId === doctorId && can(user, "APPOINTMENTS_UPDATE_OWN"));
}

export const TRANSITIONS = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PENDING", "CANCELLED", "COMPLETED", "NO_SHOW"],
  CANCELLED: ["PENDING"],
  COMPLETED: [],
  NO_SHOW: ["PENDING"],
} as const;

export function validTransition(from: keyof typeof TRANSITIONS, to: string) {
  return from === to || (TRANSITIONS[from] as readonly string[]).includes(to);
}
