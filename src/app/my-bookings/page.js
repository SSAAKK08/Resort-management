import UserHistory from '@/components/profile/UserHistory';
import { requireUserPage } from '@/lib/auth';
export default async function Page() { await requireUserPage('/my-bookings'); return <main className="min-h-screen bg-slate-50 px-5 pb-16 pt-32 dark:bg-slate-950"><div className="mx-auto max-w-5xl"><UserHistory type="bookings" /></div></main>; }
