"use client";

import { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQAccordionProps = {
  items: FAQItem[];
  locale: "en" | "ar";
};

export function FAQAccordion({ items, locale }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const isArabic = locale === "ar";

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <div key={`${item.question}-${index}`} className="overflow-hidden rounded-[22px] border border-border bg-surface shadow-[0_8px_22px_rgba(122,28,81,0.03)]">
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-background-soft sm:px-6"
            >
              <span className="text-base font-semibold text-primary sm:text-lg">
                {item.question}
              </span>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full bg-mint text-xl text-teal transition-transform ${
                  isOpen ? "rotate-45" : "rotate-0"
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <div
              id={panelId}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 pt-1 text-sm leading-7 text-foreground-muted sm:px-6 sm:text-base" dir={isArabic ? "rtl" : "ltr"}>
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}