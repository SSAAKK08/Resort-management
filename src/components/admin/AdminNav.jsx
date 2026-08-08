"use client";

import { usePathname, useRouter } from "next/navigation";
import AppLink from "@/components/navigation/AppLink";
import { useClerk } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { hasClerkPublishableKey } from "@/lib/clerk-config";

function ClerkAdminNav(props) {
  const { signOut } = useClerk();
  return <AdminNavContent {...props} clerkSignOut={signOut} />;
}

function AdminNavContent({ user, clerkSignOut = null }) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Admin");
  const nav = useTranslations("Navigation");
  const links = [
    [t("dashboard"), "/admin"],
    [t("rooms"), "/admin/rooms"],
    [t("food"), "/admin/food"],
    [t("bookings"), "/admin/bookings"],
    [t("orders"), "/admin/orders"],
    [t("payments"), "/admin/payments"],
    [t("receipts"), "/admin/receipts"],
    [t("users"), "/admin/users"],
    [t("messages"), "/admin/messages"],
  ];

  async function logout() {
    if (clerkSignOut) await clerkSignOut({ redirectUrl: "/login" });
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="w-full lg:w-72 bg-slate-950 text-white lg:min-h-screen p-6">
      <AppLink to="/" className="text-2xl font-bold">
        Sea Breeze
      </AppLink>
      <p className="mt-1 text-sm text-slate-400">{t("administration")}</p>
      <div className="mt-5 flex gap-2">
        <LanguageSwitcher compact />
        <ThemeToggle />
      </div>
      <nav
        className="mt-8 flex lg:flex-col gap-2 overflow-x-auto"
        aria-label="Admin navigation"
      >
        {links.map(([label, href]) => {
          const active =
            href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <AppLink
              key={href}
              to={href}
              className={`whitespace-nowrap rounded-lg px-4 py-3 text-sm font-medium ${active ? "bg-primary-Blue" : "text-slate-300 hover:bg-slate-800"}`}
            >
              {label}
            </AppLink>
          );
        })}
      </nav>
      <div className="mt-8 border-t border-slate-800 pt-5">
        <p className="text-sm text-slate-300">{user.email}</p>
        <button
          onClick={logout}
          className="mt-3 w-full rounded-lg border border-slate-600 px-4 py-2 text-left hover:bg-slate-800"
        >
          {nav("logout")}
        </button>
      </div>
    </aside>
  );
}

export default function AdminNav(props) {
  return hasClerkPublishableKey() ? (
    <ClerkAdminNav {...props} />
  ) : (
    <AdminNavContent {...props} />
  );
}
