"use client";

import { useEffect, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";

export type MessageItem = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  status: "NEW" | "READ" | "REPLIED" | "ARCHIVED";
  createdAt: string;
};

export default function MessagesAdminClient({ initial }: { initial: MessageItem[] }) {
  const [items, setItems] = useState<MessageItem[]>(initial || []);

  useEffect(() => {
    setItems(initial || []);
  }, [initial]);

  async function refresh() {
    const response = await fetch("/api/admin/contact");
    const data = await response.json();
    setItems(Array.isArray(data) ? data : []);
  }

  async function updateStatus(id: string, status: MessageItem["status"]) {
    await fetch(`/api/admin/contact?id=${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this contact message?")) return;
    await fetch(`/api/admin/contact?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    await refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-primary)" }}>
          Contact Messages
        </h2>
        <p className="text-sm" style={{ color: "var(--color-foreground-muted)" }}>
          Total messages: {items.length}
        </p>
      </div>

      <AdminTable<MessageItem>
        items={items}
        pageSize={8}
        emptyMessage="No contact messages found."
        headers={
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Contact</th>
            <th className="p-3 text-left">Message</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        }
        renderRow={(item) => (
          <>
            <td className="p-3 align-middle font-medium" style={{ color: "var(--color-foreground)" }}>
              {item.name}
            </td>
            <td className="p-3 align-middle text-xs" style={{ color: "var(--color-foreground-muted)" }}>
              <div>{item.email || "—"}</div>
              <div>{item.phone || "—"}</div>
            </td>
            <td className="p-3 align-middle max-w-md text-xs" style={{ color: "var(--color-foreground-muted)" }}>
              {item.message}
            </td>
            <td className="p-3 align-middle">
              <select
                value={item.status}
                onChange={(e) => updateStatus(item.id, e.target.value as MessageItem["status"])}
                className="py-1 px-2 border rounded-md text-xs outline-none"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-background)",
                  color: "var(--color-foreground)",
                }}
              >
                <option value="NEW">New</option>
                <option value="READ">Read</option>
                <option value="REPLIED">Replied</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </td>
            <td className="p-3 align-middle">
              <button
                onClick={() => handleDelete(item.id)}
                className="py-1 px-2 text-red-600 border border-red-200 rounded-md text-xs hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </td>
          </>
        )}
      />
    </div>
  );
}
