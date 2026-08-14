import ProfileView from "@/components/profile/ProfileView";
import { requireUserPage } from "@/lib/auth";

export default async function ProfilePage() {
  await requireUserPage("/profile");
  return (
    <main className="min-h-screen bg-slate-50 px-5 pb-16 pt-32 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl">
        <ProfileView />
      </div>
    </main>
  );
}
