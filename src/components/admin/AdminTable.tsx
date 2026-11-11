"use client";

import { useAdminT } from "@/app/hooks/useAdminT";
import { useState } from "react";

interface AdminTableProps<T> {
  items: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
  headers?: React.ReactNode;
  pageSize?: number;

  page?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;

  emptyMessage?: string;
}

export function AdminTable<T>({
  items,
  renderRow,
  headers,
  pageSize = 10,
  page: externalPage,
  totalItems: externalTotal,
  onPageChange,
  emptyMessage,
}: AdminTableProps<T>) {
  const { t } = useAdminT();
  const [internalPage, setInternalPage] = useState(1);

  const isServerSide = externalTotal !== undefined && onPageChange !== undefined;

  const currentPage = isServerSide ? externalPage || 1 : internalPage;
  const totalCount = isServerSide ? externalTotal : items.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const displayedItems = isServerSide
    ? items
    : items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    if (isServerSide && onPageChange) {
      onPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  const resolvedEmpty = emptyMessage ?? t.table.empty;

  return (
    <div className="w-full space-y-4">
      <div
        className="overflow-x-auto rounded-lg shadow-sm"
        style={{
          border: "1px solid var(--color-border)",
          backgroundColor: "var(--color-surface)",
        }}
      >
        <table className="min-w-full text-sm text-start">
          {headers && (
            <thead
              style={{
                backgroundColor: "var(--color-background-soft)",
                color: "var(--color-primary)",
                borderBottom: "1px solid var(--color-border)",
              }}
              className="font-semibold"
            >
              {headers}
            </thead>
          )}
          <tbody
            className="divide-y"
            style={{ borderColor: "var(--color-border)" }}
          >
            {displayedItems.length > 0 ? (
              displayedItems.map((item, idx) => (
                <tr
                  key={idx}
                  className="transition-colors hover:bg-[var(--color-background-soft)]"
                >
                  {renderRow(item, idx)}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={100}
                  className="py-8 text-center"
                  style={{ color: "var(--color-foreground-muted)" }}
                >
                  {resolvedEmpty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs px-1"
          style={{ color: "var(--color-foreground-muted)" }}
        >
          <div>
            {t.table.showing}{" "}
            <span
              className="font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              {Math.min((currentPage - 1) * pageSize + 1, totalCount)}
            </span>{" "}
            {t.table.to}{" "}
            <span
              className="font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              {Math.min(currentPage * pageSize, totalCount)}
            </span>{" "}
            {t.table.of}{" "}
            <span
              className="font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              {totalCount}
            </span>{" "}
            {t.table.entries}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-md border transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-background-soft)]"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-surface)",
                color: "var(--color-foreground)",
              }}
            >
              {t.table.previous}
            </button>

            <span
              className="px-3 py-1.5 font-medium"
              style={{ color: "var(--color-primary)" }}
            >
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-md border transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-background-soft)]"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-surface)",
                color: "var(--color-foreground)",
              }}
            >
              {t.table.next}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTable;