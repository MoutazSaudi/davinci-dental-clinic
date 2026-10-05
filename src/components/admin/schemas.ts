import { z } from 'zod';

// مخطط الأطباء
export const doctorSchema = z.object({
  nameAr: z.string().min(2, 'الاسم بالعربية مطلوب'),
  nameEn: z.string().min(2, 'الاسم بالإنجليزية مطلوب'),
  specialtyAr: z.string().min(2, 'التخصص مطلوب'),
  specialtyEn: z.string().min(2, 'التخصص مطلوب'),
  bioAr: z.string().min(10, 'يرجى كتابة نبذة لا تقل عن 10 أحرف'),
  facebookUrl: z.string().url('يجب أن يكون رابطاً صالحاً').optional().or(z.literal('')),
});
export type DoctorFormValues = z.infer<typeof doctorSchema>;

// مخطط الخدمات
export const serviceSchema = z.object({
  titleAr: z.string().min(2, 'عنوان الخدمة مطلوب'),
  titleEn: z.string().min(2, 'عنوان الخدمة مطلوب'),
  category: z.enum(['orthodontics', 'cosmetic', 'surgery'], {
    required_error: 'يرجى اختيار تصنيف الخدمة',
  }),
  shortDescriptionAr: z.string().min(10, 'الوصف القصير مطلوب'),
});
export type ServiceFormValues = z.infer<typeof serviceSchema>;

// مخطط المواعيد
export const appointmentSchema = z.object({
  patientName: z.string(), // عادة تكون للقراءة فقط
  status: z.enum(['Pending', 'Confirmed', 'Cancelled'], {
    required_error: 'يرجى تحديد حالة الموعد',
  }),
  adminNotes: z.string().optional(),
});
export type AppointmentFormValues = z.infer<typeof appointmentSchema>;