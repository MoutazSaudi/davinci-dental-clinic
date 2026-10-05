"use client";
import React, { useState } from "react";
import AdminInput from "./AdminInput";
import type { ServiceItem } from "../../data/mock/services";

type Props = {
  initial?: ServiceItem | null;
  onCancel?: () => void;
  onSubmit: (data: ServiceItem) => Promise<void> | void;
};

function ensureHighlights(input?: string | string[]): string[] {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  return input.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
}

function getHighlightString(val: any): string {
  if (Array.isArray(val)) return val.join("\n");
  if (typeof val === "string") return val;
  return "";
}

export function AdminForm({ initial, onCancel, onSubmit }: Props) {
  const blank: ServiceItem = initial ?? {
    slug: "",
    category: { ar: "", en: "" },
    title: { ar: "", en: "" },
    shortDescription: { ar: "", en: "" },
    description: { ar: "", en: "" },
    image: "",
    sourceUrl: "",
    sourceUrlEn: "",
    highlight: { ar: [], en: [] },
  };

  const [data, setData] = useState<ServiceItem>(blank);

  function setField(path: string, value: string) {
    const parts = path.split(".");
    setData((d) => {
      const copy: any = JSON.parse(JSON.stringify(d));
      if (parts.length === 1) copy[parts[0]] = value;
      else if (parts.length === 2) copy[parts[0]][parts[1]] = value;
      return copy;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const out: ServiceItem = {
      ...data,
      highlight: {
        ar: ensureHighlights(data.highlight?.ar),
        en: ensureHighlights(data.highlight?.en),
      },
    };

    await onSubmit(out);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AdminInput label="Slug" name="slug" value={data.slug} onChange={setField} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminInput label="Category (AR)" name="category.ar" value={data.category?.ar || ""} onChange={setField} />
        <AdminInput label="Category (EN)" name="category.en" value={data.category?.en || ""} onChange={setField} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminInput label="Title (AR)" name="title.ar" value={data.title?.ar || ""} onChange={setField} />
        <AdminInput label="Title (EN)" name="title.en" value={data.title?.en || ""} onChange={setField} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <AdminInput label="Short Description (AR)" name="shortDescription.ar" value={data.shortDescription?.ar || ""} onChange={setField} textarea rows={3} />
        <AdminInput label="Short Description (EN)" name="shortDescription.en" value={data.shortDescription?.en || ""} onChange={setField} textarea rows={3} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <AdminInput label="Description (AR)" name="description.ar" value={data.description?.ar || ""} onChange={setField} textarea rows={5} />
        <AdminInput label="Description (EN)" name="description.en" value={data.description?.en || ""} onChange={setField} textarea rows={5} />
      </div>

      <AdminInput label="Image URL" name="image" value={data.image || ""} onChange={setField} />

      <div className="grid md:grid-cols-2 gap-4">
        <AdminInput label="Source URL (AR)" name="sourceUrl" value={data.sourceUrl || ""} onChange={setField} />
        <AdminInput label="Source URL (EN)" name="sourceUrlEn" value={data.sourceUrlEn || ""} onChange={setField} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <AdminInput label="Highlights (AR) - one per line" name="highlight.ar" value={getHighlightString(data.highlight?.ar)} onChange={setField} textarea rows={4} />
        <AdminInput label="Highlights (EN) - one per line" name="highlight.en" value={getHighlightString(data.highlight?.en)} onChange={setField} textarea rows={4} />
      </div>

      <div className="flex items-center gap-3 mt-2">
        <button type="submit" className="py-2 px-4 bg-primary text-white rounded">Save</button>
        <button type="button" onClick={onCancel} className="py-2 px-4 border rounded">Cancel</button>
      </div>
    </form>
  );
}

export default AdminForm;