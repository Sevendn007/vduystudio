import { redirect } from "next/navigation";

// Hai bản demo đã gộp về một trang; giữ đường dẫn cũ cho link đã gửi đi.
export default function ClassicRedirect() {
  redirect("/sitetemplate/xekhach?style=classic");
}
