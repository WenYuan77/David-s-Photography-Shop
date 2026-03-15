"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export default function AdminMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = useLocale();
  const isLogin = pathname === `/${locale}/admin/login`;
  return (
    <main className={isLogin ? "" : "pt-20"}>
      {children}
    </main>
  );
}
