import { Fragment } from "react";

// Hiện chữ theo từng từ bằng CSS thuần (SSR sẵn, không cần JS → không bao giờ bị ẩn).
// Mỗi từ được bọc trong khung overflow:hidden, chữ trượt từ dưới lên.

export default function RevealWords({
  text,
  delay = 0,
  step = 0.07,
  className = "",
}: {
  text: string;
  delay?: number;
  step?: number;
  className?: string;
}) {
  const words = text.split(" ").filter(Boolean);
  return (
    <span className={`rw ${className}`}>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          {i > 0 ? " " : null}
          <span className="rw-w">
            <span style={{ animationDelay: `${(delay + i * step).toFixed(2)}s` }}>{w}</span>
          </span>
        </Fragment>
      ))}
    </span>
  );
}
