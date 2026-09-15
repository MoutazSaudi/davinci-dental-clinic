import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  message: z.string().min(5),
});

export type ContactInput = z.infer<typeof contactSchema>;
