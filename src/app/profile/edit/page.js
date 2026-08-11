import ProfileEditor from "@/components/profile/ProfileEditor";
import { requireUserPage } from "@/lib/auth";

export default async function EditProfilePage() {
  await requireUserPage("/profile/edit");
  return (
    <main className="min-h-screen bg-slate-50 px-5 pb-16 pt-32 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl">
        <ProfileEditor />
      </div>
    </main>
  );
}
