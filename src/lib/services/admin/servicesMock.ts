import { serviceCatalog, ServiceItem } from "@/data/mock/services";

// Helper to simulate asynchronous latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Normalizes slugs to handle URL-encoded non-ASCII strings (e.g., Arabic slugs)
function normalizeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

// In-memory store initialized with a shallow copy of the catalog
const store: ServiceItem[] = [...serviceCatalog];

export async function listServices(): Promise<ServiceItem[]> {
  await delay(150);
  return [...store];
}

export async function getService(slug: string): Promise<ServiceItem | null> {
  await delay(120);
  const target = normalizeSlug(slug);
  const item = store.find((s) => normalizeSlug(s.slug) === target);
  return item ? { ...item } : null;
}

export async function createService(data: ServiceItem): Promise<ServiceItem> {
  await delay(200);
  const target = normalizeSlug(data.slug);
  if (store.some((s) => normalizeSlug(s.slug) === target)) {
    throw new Error(`Service with slug "${data.slug}" already exists.`);
  }

  store.unshift(data);
  return { ...data };
}

export async function updateService(
  slug: string,
  data: Partial<ServiceItem>
): Promise<ServiceItem | null> {
  await delay(200);
  const target = normalizeSlug(slug);
  const idx = store.findIndex((s) => normalizeSlug(s.slug) === target);

  if (idx === -1) return null;

  store[idx] = { ...store[idx], ...data };
  return { ...store[idx] };
}

export async function deleteService(slug: string): Promise<boolean> {
  await delay(150);
  const target = normalizeSlug(slug);
  const idx = store.findIndex((s) => normalizeSlug(s.slug) === target);

  if (idx === -1) return false;

  store.splice(idx, 1);
  return true;
}

export default { listServices, getService, createService, updateService, deleteService };