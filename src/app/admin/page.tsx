// app/admin/page.tsx


import { Suspense } from "react";
import AdminPostPageClient from "../../components/components/AdminPostPageClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminPostPageClient />
    </Suspense>
  );
}






