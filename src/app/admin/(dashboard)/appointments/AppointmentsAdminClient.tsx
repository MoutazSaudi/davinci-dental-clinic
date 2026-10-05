"use client";

import React, { useEffect, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";
import { DynamicForm, FormFieldConfig } from "@/components/admin/DynamicForm";
import { z } from "zod";

// 1. Validation Schema for Appointments
export const appointmentSchema = z.object({
  patientName: z.string().min(2, "Patient name is required"),
  phone: z.string().min(6, "Phone number is required"),
  service: z.string().min(2, "Service is required"),
  date: z.string().min(1, "Date and time are required"),
  status: z.enum(["pending", "confirmed", "cancelled"], {
    required_error: "Status is required",
  }),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export interface AppointmentItem extends AppointmentFormValues {
  id: string;
}

// 2. Field Configuration for DynamicForm
const appointmentFields: FormFieldConfig<AppointmentFormValues>[] = [
  { name: "patientName", label: "Patient Name", type: "text", placeholder: "Enter patient name" },
  { name: "phone", label: "Phone Number", type: "text", placeholder: "e.g. +963..." },
  { name: "service", label: "Service", type: "text", placeholder: "e.g. Orthodontics" },
  { name: "date", label: "Date & Time", type: "text", placeholder: "e.g. Oct 1, 2026 - 10:00 AM" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Pending", value: "pending" },
      { label: "Confirmed", value: "confirmed" },
      { label: "Cancelled", value: "cancelled" },
    ],
  },
];

export default function AppointmentsAdminClient({ initial }: { initial: AppointmentItem[] }) {
  const [items, setItems] = useState<AppointmentItem[]>(initial || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AppointmentItem | null>(null);

  useEffect(() => {
    setItems(initial || []);
  }, [initial]);

  async function refresh() {
    const res = await fetch("/api/admin/appointments");
    const data = await res.json();
    setItems(data || []);
  }

  async function handleStatusChange(id: string, newStatus: AppointmentItem["status"]) {
    await fetch(`/api/admin/appointments?id=${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
      headers: { "Content-Type": "application/json" },
    });
    await refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this appointment?")) return;
    await fetch(`/api/admin/appointments?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    await refresh();
  }

  async function handleSubmitForm(data: AppointmentFormValues) {
    if (editingItem) {
      await fetch(`/api/admin/appointments?id=${encodeURIComponent(editingItem.id)}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    } else {
      await fetch("/api/admin/appointments", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    }

    setIsModalOpen(false);
    setEditingItem(null);
    await refresh();
  }

  function openCreateModal() {
    setEditingItem(null);
    setIsModalOpen(true);
  }

  function openEditModal(item: AppointmentItem) {
    setEditingItem(item);
    setIsModalOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: "var(--color-primary)" }}>
            Appointments
          </h2>
          <p className="text-sm" style={{ color: "var(--color-foreground-muted)" }}>
            Total appointments: {items.length}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
        >
          + Add Appointment
        </button>
      </div>

      <AdminTable<AppointmentItem>
        items={items}
        pageSize={8}
        emptyMessage="No appointments found."
        headers={
          <tr>
            <th className="p-3 text-left">Patient Name</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Service</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        }
        renderRow={(item) => (
          <>
            <td className="p-3 align-middle font-medium" style={{ color: "var(--color-foreground)" }}>
              {item.patientName}
            </td>
            <td className="p-3 align-middle" style={{ color: "var(--color-foreground-muted)" }}>
              {item.phone}
            </td>
            <td className="p-3 align-middle" style={{ color: "var(--color-foreground)" }}>
              {item.service}
            </td>
            <td className="p-3 align-middle text-xs" style={{ color: "var(--color-foreground-muted)" }}>
              {item.date}
            </td>
            <td className="p-3 align-middle">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                  item.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : item.status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.status}
              </span>
            </td>
            <td className="p-3 align-middle">
              <div className="flex items-center gap-2">
                <select
                  value={item.status}
                  onChange={(e) =>
                    handleStatusChange(item.id, e.target.value as AppointmentItem["status"])
                  }
                  className="py-1 px-2 border rounded-md text-xs outline-none"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-background)",
                    color: "var(--color-foreground)",
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  onClick={() => openEditModal(item)}
                  className="py-1 px-2 text-blue-600 border border-blue-200 rounded-md text-xs hover:bg-blue-50 transition-colors"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="py-1 px-2 text-red-600 border border-red-200 rounded-md text-xs hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </td>
          </>
        )}
      />

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">
                {editingItem ? "Edit Appointment" : "Add New Appointment"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <DynamicForm<AppointmentFormValues>
              schema={appointmentSchema}
              fields={appointmentFields}
              defaultValues={
                editingItem
                  ? {
                      patientName: editingItem.patientName,
                      phone: editingItem.phone,
                      service: editingItem.service,
                      date: editingItem.date,
                      status: editingItem.status,
                    }
                  : {
                      patientName: "",
                      phone: "",
                      service: "",
                      date: "",
                      status: "pending",
                    }
              }
              onSubmit={handleSubmitForm}
              submitLabel={editingItem ? "Save Changes" : "Add Appointment"}
            />
          </div>
        </div>
      )}
    </div>
  );
}