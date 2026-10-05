'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import type { FieldValues, DefaultValues, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodSchema } from 'zod';

export type FieldType = 'text' | 'textarea' | 'select' | 'checkbox' | 'readonly';

export interface FormFieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: FieldType;
  options?: { label: string; value: string | number }[];
  placeholder?: string;
  readOnly?: boolean;
}

interface DynamicFormProps<T extends FieldValues> {
  schema: ZodSchema<T>;
  fields: FormFieldConfig<T>[];
  onSubmit: (data: T) => void;
  defaultValues?: DefaultValues<T>;
  submitLabel?: string;
}

export function DynamicForm<T extends FieldValues>({
  schema,
  fields,
  onSubmit,
  defaultValues,
  submitLabel = 'حفظ البيانات',
}: DynamicFormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" dir="rtl">
      {fields.map((field) => (
        <div key={String(field.name)} className="flex flex-col gap-1.5">
          <label className="font-semibold text-gray-700">{field.label}</label>

          {field.type === 'text' && (
            <input
              type="text"
              {...register(field.name)}
              placeholder={field.placeholder}
              disabled={field.readOnly}
              className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          )}

          {field.type === 'textarea' && (
            <textarea
              {...register(field.name)}
              placeholder={field.placeholder}
              rows={4}
              className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          )}

          {field.type === 'select' && (
            <select
              {...register(field.name)}
              className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">اختر...</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {field.type === 'checkbox' && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register(field.name)}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-600">تفعيل</span>
            </div>
          )}

          {errors[field.name] && (
            <span className="text-red-500 text-sm font-medium">
              {errors[field.name]?.message as string}
            </span>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 mt-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? 'جاري المعالجة...' : submitLabel}
      </button>
    </form>
  );
}