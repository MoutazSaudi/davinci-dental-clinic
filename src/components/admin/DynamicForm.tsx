"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, DefaultValues, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodSchema } from "zod";
import { useAdminT } from "@/app/hooks/useAdminT";

export type FieldType = "text" | "textarea" | "select" | "checkbox" | "readonly";

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

const FIELD_CLASS =
  "p-2.5 border border-[var(--color-border)] rounded-lg outline-none transition-colors " +
  "bg-[var(--color-surface)] text-[var(--color-foreground)] " +
  "focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)] " +
  "disabled:opacity-60";

export function DynamicForm<T extends FieldValues>({
  schema,
  fields,
  onSubmit,
  defaultValues,
  submitLabel,
}: DynamicFormProps<T>) {
  const { t, isRtl } = useAdminT();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const resolvedSubmit = submitLabel ?? t.common.save;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {fields.map((field) => (
        <div key={String(field.name)} className="flex flex-col gap-1.5">
          <label className="font-semibold text-[var(--color-foreground)]">
            {field.label}
          </label>

          {field.type === "text" && (
            <input
              type="text"
              {...register(field.name)}
              placeholder={field.placeholder}
              disabled={field.readOnly}
              className={FIELD_CLASS}
            />
          )}

          {field.type === "textarea" && (
            <textarea
              {...register(field.name)}
              placeholder={field.placeholder}
              rows={4}
              className={FIELD_CLASS}
            />
          )}

          {field.type === "select" && (
            <select {...register(field.name)} className={FIELD_CLASS}>
              <option value="">{t.common.selectPlaceholder}</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {field.type === "checkbox" && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register(field.name)}
                className="w-5 h-5 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span className="text-[var(--color-foreground-muted)]">
                {t.common.activate}
              </span>
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
        className="w-full py-3 mt-4 text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        {isSubmitting ? t.common.processing : resolvedSubmit}
      </button>
    </form>
  );
}