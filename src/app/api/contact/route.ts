import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  phone: z.string().trim().min(7, "Phone number is required.").optional().or(z.literal("")),
  email: z.string().trim().email().optional().or(z.literal("")),
  message: z.string().trim().min(3, "Message is too short."),
  locale: z.string().trim().default("ar"),
  serviceSlug: z.string().trim().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = contactSchema.parse(body);

    const created = await prisma.contactMessage.create({
      data: {
        name: payload.name,
        phone: payload.phone || "",
        email: payload.email || null,
        message: payload.message,
        serviceSlug: payload.serviceSlug ?? null,
        locale: payload.locale || "ar",
        status: "NEW",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message submitted successfully.",
        data: { id: created.id },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check the form values and try again.",
          errors: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit the message right now.",
      },
      { status: 500 },
    );
  }
}
