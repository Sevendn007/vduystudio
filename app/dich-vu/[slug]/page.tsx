import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { platforms, getPlatform } from "@/lib/services";
import ServiceDetail from "@/components/ServiceDetail";

export function generateStaticParams() {
  return platforms.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const platform = getPlatform(params.slug);
  if (!platform) return {};
  return {
    title: `Dịch vụ ${platform.name} — VDuyStudio`,
    description: platform.tagline,
    openGraph: {
      title: `Dịch vụ ${platform.name} — VDuyStudio`,
      description: platform.tagline,
    },
  };
}

export default function ServicePage({
  params,
}: {
  params: { slug: string };
}) {
  const platform = getPlatform(params.slug);
  if (!platform) notFound();
  return <ServiceDetail slug={params.slug} />;
}
