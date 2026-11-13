import { requireAdminRoleServer } from "@/lib/auth";
import VideoManagement from "@/components/admin/VideoManagement";
import { getActiveVideo } from "@/lib/services/video.service";
import type { ActiveVideo } from "@/types/video";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function VideosAdminPage() {
  await requireAdminRoleServer();
  let active: ActiveVideo | null = null;
  try { active = await getActiveVideo(); }
  catch { console.error("Could not load active showcase video"); }
  return <div className="container mx-auto"><VideoManagement initialActive={active} /></div>;
}
