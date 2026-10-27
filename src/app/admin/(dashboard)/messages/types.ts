export type MessageStatus = "NEW" | "READ" | "REPLIED" | "ARCHIVED";

export type MessageAdmin = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  source: "CONTACT_FORM" | "SERVICE_REQUEST";
  serviceSlug: string | null;
  locale: string;
  status: MessageStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export const MESSAGE_STATUS_LABEL: Record<MessageStatus, string> = {
  NEW: "New",
  READ: "Read",
  REPLIED: "Replied",
  ARCHIVED: "Archived",
};

export const MESSAGE_STATUS_STYLES: Record<MessageStatus, string> = {
  NEW: "bg-teal-100 text-teal-800",
  READ: "bg-blue-100 text-blue-800",
  REPLIED: "bg-green-100 text-green-700",
  ARCHIVED: "bg-gray-200 text-gray-700",
};