import SubHeaderLayout from "@/components/v3/SubHeaderLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SubHeaderLayout current="services">{children}</SubHeaderLayout>;
}
