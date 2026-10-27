import LabSwitch from "@/components/v3/lab/LabSwitch";

// Phòng thí nghiệm nguyên mẫu hero WebGL (xem trước, noindex kế thừa từ /v3 layout).
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ id: "ribbon" }, { id: "prism" }, { id: "nebula" }];
}

export default function LabPage({ params }: { params: { id: string } }) {
  return <LabSwitch id={params.id} />;
}
