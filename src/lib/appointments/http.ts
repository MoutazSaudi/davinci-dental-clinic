import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppointmentError } from "./server";

export function appointmentResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "private, no-store" } });
}
export function appointmentFailure(error: unknown) {
  if (error instanceof ZodError) return appointmentResponse({ success: false, error: "invalidInput", message: "Please check the form values.", errors: error.flatten().fieldErrors }, 400);
  if (error instanceof SyntaxError) return appointmentResponse({ success: false, error: "invalidInput", message: "Invalid request body." }, 400);
  if (error instanceof AppointmentError) return appointmentResponse({ success: false, error: error.code, message: error.code }, error.status);
  return appointmentResponse({ success: false, error: "requestFailed", message: "Unable to process appointment request." }, 500);
}
