import "server-only";
import type { Prisma } from "@prisma/client";

export class AppointmentError extends Error {
  constructor(public code: string, public status = 400) { super(code); }
}
export function demand(condition: boolean, code = "forbidden", status = 403): asserts condition {
  if (!condition) throw new AppointmentError(code, status);
}
export async function lockAppointment(tx: Prisma.TransactionClient, id: string) {
  await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${`appointment:${id}`}))::text`;
}

