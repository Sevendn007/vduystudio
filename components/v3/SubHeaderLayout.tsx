import "../../app/styles/v3-tokens.css";
import "../../app/styles/v3.css";
import { v3FontVars } from "@/lib/v3/fonts";
import { fetchSettings } from "@/lib/v3/data.server";
import SubHeaderClient from "./SubHeaderClient";

// Layout route cho các trang con: thêm header của trang chủ phía trên, KHÔNG đổi giao diện nội dung.
export default async function SubHeaderLayout({ current, children }: { current?: string; children: React.ReactNode }) {
  const settings = await fetchSettings();
  return (
    <div className={v3FontVars}>
      <SubHeaderClient settings={settings} current={current} />
      <div style={{ paddingTop: 84 }}>{children}</div>
    </div>
  );
}
