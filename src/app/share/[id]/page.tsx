import { SharePageView } from "@/components/share-page-view";
import { shareStore } from "@/lib/share-store";

export const dynamic = "force-dynamic";

export default async function SharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const payload = shareStore.get(id) ?? null;

  return <SharePageView payload={payload} />;
}
