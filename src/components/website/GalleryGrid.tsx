"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { GalleryService } from "@/data/mock/gallery";

interface Props {
  services: GalleryService[];
  locale: "ar" | "en";
}

interface LightboxState {
  images: string[];
  index: number;
  title: string;
  category: string;
}

export function GalleryGrid({ services, locale }: Props) {
  const isArabic = locale === "ar";
  const [open, setOpen] = useState<LightboxState | null>(null);

  // فتح العرض
  const openAt = (service: GalleryService, index: number) => {
    setOpen({
      images: service.images,
      index,
      title: service.title[locale],
      category: service.category[locale],
    });
  };

  // إغلاق
  const close = useCallback(() => setOpen(null), []);

  // التالي / السابق
  const next = useCallback(() => {
    setOpen((curr) => {
      if (!curr) return curr;
      const i = (curr.index + 1) % curr.images.length;
      return { ...curr, index: i };
    });
  }, []);

  const prev = useCallback(() => {
    setOpen((curr) => {
      if (!curr) return curr;
      const i = (curr.index - 1 + curr.images.length) % curr.images.length;
      return { ...curr, index: i };
    });
  }, []);

  // التحكم بلوحة المفاتيح + قفل التمرير
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    document.addEventListener("keydown", onKey);
    document.body.classList.add("gallery-lock-scroll");

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("gallery-lock-scroll");
    };
  }, [open, close, next, prev]);

  return (
    <>
      {services.map((service) => (
        <section key={service.slug} className="gallery-service">
          <header className="gallery-service__header">
            <div>
              <p className="gallery-service__eyebrow">
                {service.category[locale]}
              </p>
              <h2 className="gallery-service__title">
                {service.title[locale]}
              </h2>
              <p className="gallery-service__description">
                {service.description[locale]}
              </p>
            </div>
            <span className="gallery-service__count">
              {service.images.length}{" "}
              {isArabic ? "صورة" : "images"}
            </span>
          </header>

          <div className="gallery-grid">
            {service.images.map((src, i) => (
              <button
                key={`${service.slug}-${i}`}
                type="button"
                className="gallery-item"
                onClick={() => openAt(service, i)}
                aria-label={`${isArabic ? "تكبير" : "Zoom"} ${service.title[locale]} ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`${service.title[locale]} ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="gallery-item__image"
                />
                <span className="gallery-item__overlay" aria-hidden="true">
                  <span className="gallery-item__zoom">+</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}

      {/* ===== Lightbox ===== */}
      <div
        className={`gallery-lightbox ${open ? "is-open" : ""}`}
        onClick={close}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
      >
        {open && (
          <div
            className="gallery-lightbox__stage"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="gallery-lightbox__close"
              onClick={close}
              aria-label={isArabic ? "إغلاق" : "Close"}
            >
              ✕
            </button>

            {open.images.length > 1 && (
              <>
                <button
                  type="button"
                  className="gallery-lightbox__nav prev"
                  onClick={prev}
                  aria-label={isArabic ? "السابق" : "Previous"}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="gallery-lightbox__nav next"
                  onClick={next}
                  aria-label={isArabic ? "التالي" : "Next"}
                >
                  ›
                </button>
              </>
            )}

            <div className="gallery-lightbox__image-wrap">
              <Image
                key={open.images[open.index]}
                src={open.images[open.index]}
                alt={`${open.title} ${open.index + 1}`}
                width={1400}
                height={1050}
                className="gallery-lightbox__image"
                priority
              />
            </div>

            <p className="gallery-lightbox__caption">
              {open.category} — {open.title}{" "}
              <span className="gallery-lightbox__index">
                ({open.index + 1}/{open.images.length})
              </span>
            </p>
          </div>
        )}
      </div>
    </>
  );
}