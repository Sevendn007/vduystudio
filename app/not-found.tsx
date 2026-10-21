import Link from "next/link";
import LogoSwayVideo from "@/components/brand/LogoSwayVideo";

export default function NotFound() {
  return (
    <main className="holo nf">
      <LogoSwayVideo className="nf-logo" />
      <p className="nf-code">404</p>
      <h1 className="nf-title">Trang này chưa được xác minh.</h1>
      <p className="nf-sub">Đường dẫn không tồn tại hoặc đã được di chuyển.</p>
      <Link href="/" className="btn btn-primary">
        Về trang chủ →
      </Link>
    </main>
  );
}
