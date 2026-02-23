import AdminNav from "./AdminNav";
import AdminMain from "./AdminMain";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AdminNav />
      <AdminMain>{children}</AdminMain>
    </div>
  );
}
