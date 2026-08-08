import AdminNav from '@/components/admin/AdminNav';
import { requireAdminPage } from '@/lib/auth';

export default async function AdminLayout({ children }) {
  const user = await requireAdminPage();
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 lg:flex">
      <AdminNav user={user} />
      <main className="min-w-0 flex-1 p-5 lg:p-10">{children}</main>
    </div>
  );
}
