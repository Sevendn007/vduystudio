import V3Home from "@/components/v3/V3Home";
import { fetchProjects, fetchFeedbacks, fetchSettings, fetchAllPricing } from "@/lib/v3/data.server";

// ISR: HTML có dữ liệu thật (SEO) và tự làm mới mỗi 60s. Không dùng cookie →
// static + revalidate (không ép dynamic). Admin sửa → sau ≤60s hiện trên v3.
export const revalidate = 60;

const PRICING_SLUGS = ["tiktok", "facebook", "instagram-threads", "bao-chi", "website"];

export default async function V3Page() {
  const [projects, feedbacks, settings, pricing] = await Promise.all([
    fetchProjects(),
    fetchFeedbacks(),
    fetchSettings(),
    fetchAllPricing(PRICING_SLUGS),
  ]);

  return (
    <V3Home
      projects={projects}
      feedbacks={feedbacks}
      settings={settings}
      pricing={pricing}
    />
  );
}
