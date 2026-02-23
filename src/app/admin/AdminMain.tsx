"use client";

import { usePathname } from "next/navigation";

export default function AdminMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";
  return (
    <main className={isLogin ? "" : "pt-20"}>
      {children}
    </main>
  );
}
