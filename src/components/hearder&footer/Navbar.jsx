'use client';

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import NavLink from "../navigation/AppLink"
import profile from "../../assets/profile.png"
import Button from "../button/Button"
import logo from "@/assets/logo.png"
import Image from "next/image";
import { useTranslations } from "next-intl"
import ThemeToggle from "@/components/ThemeToggle"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { UserButton, useUser } from "@clerk/nextjs"
import { FiCalendar, FiEdit3, FiFileText, FiHome, FiShield, FiShoppingBag } from "react-icons/fi"
import { hasClerkPublishableKey } from "@/lib/clerk-config"

const activeCls = "block py-2 px-3 text-primary-Blue rounded bg-neutral-tertiary md:bg-transparent md:hover:text-fg-brand md:p-0"
const inactiveCls = "block py-2 px-3 text-secondary-gray-700 rounded hover:bg-slate-100 dark:hover:bg-slate-800 md:hover:bg-transparent md:dark:hover:bg-transparent md:hover:text-primary-Blue md:p-0"

const Bar = ({ open, rotate, fade }) => (
  <span
    style={{
      display: "block",
      width: "22px",
      height: "2px",
      borderRadius: "2px",
      transition: "all 0.3s ease",
      transform: open ? rotate : "none",
      opacity: fade && open ? 0 : 1,
    }}
    className="bg-slate-700 dark:bg-slate-200"
  />
)

function ClerkNavbar() {
  const { isLoaded, isSignedIn } = useUser()

  return <NavbarContent clerkAuth={{ isLoaded, isSignedIn }} />
}

function ClerkUserMenu({ isAdmin, t }) {
  return (
    <UserButton userProfileMode="modal" appearance={{ elements: { avatarBox: "h-9 w-9" } }}>
      <UserButton.MenuItems>
        <UserButton.Action label="manageAccount" />
        <UserButton.Link label={t("editResortProfile")} labelIcon={<FiEdit3 />} href="/profile/edit" />
        <UserButton.Link label={t("profile")} labelIcon={<FiHome />} href="/profile" />
        <UserButton.Link label={t("bookings")} labelIcon={<FiCalendar />} href="/my-bookings" />
        <UserButton.Link label={t("orders")} labelIcon={<FiShoppingBag />} href="/my-orders" />
        <UserButton.Link label={t("receipts")} labelIcon={<FiFileText />} href="/my-receipts" />
        {isAdmin && <UserButton.Link label={t("admin")} labelIcon={<FiShield />} href="/admin" />}
        <UserButton.Action label="signOut" />
      </UserButton.MenuItems>
    </UserButton>
  )
}

function NavbarContent({ clerkAuth = null }) {
  const router = useRouter()
  const t = useTranslations("Navigation")
  const isLoaded = clerkAuth?.isLoaded ?? true
  const isSignedIn = clerkAuth?.isSignedIn ?? false
  const usesClerk = Boolean(clerkAuth)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const authenticated = Boolean(loggedInUser || isSignedIn)
  const navLinks = [
    { to: "/", label: t("home") },
    { to: "/booking", label: t("rooms") },
    { to: "/restaurant", label: t("restaurant") },
    { to: "/activities", label: t("activities") },
    { to: "/promotion", label: t("promotions") },
    { to: "/about", label: t("about") },
  ]

  useEffect(() => {
    async function updateLoginStatus() {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" })
        const session = await response.json()
        setLoggedInUser(session.user)
        setAvatarUrl(session.profile?.avatarUrl || null)
      } catch {
        setLoggedInUser(null)
        setAvatarUrl(null)
      }
    }

    if (!usesClerk || isLoaded) {
      updateLoginStatus()
    }
    window.addEventListener("sessionChanged", updateLoginStatus)

    return () => {
      window.removeEventListener("sessionChanged", updateLoginStatus)
    }
  }, [usesClerk, isLoaded, isSignedIn])

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    setLoggedInUser(null)
    setAvatarUrl(null)
    setProfileOpen(false)
    router.replace("/")
    router.refresh()
  }

  return (
    <nav className="fixed top-0 z-20 w-full border-b border-slate-200 bg-background/95 backdrop-blur dark:border-slate-800">
      <div className="flex items-center justify-between mx-4 md:mx-10 p-4">
        <NavLink to="/" className="flex items-center space-x-3">
          <Image src={logo} className="h-16 w-16" alt={t("logoAlt")} />
          {/* <img src="/assets/logo.png " className="h-16 w-16" alt="Sea Breeze Logo" /> */}
          <span className="text-xl text-heading font-semibold whitespace-nowrap">
            {t("home") === "Home" ? "Sea Breeze" : "ស៊ី ប្រ៊ីស"}
          </span>
        </NavLink>

        {/* Desktop navigation links */}
        <ul className="hidden md:flex font-medium flex-row space-x-5">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  isActive ? activeCls : inactiveCls
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {/* Show Login and Sign Up only when no user is logged in. */}
          {!authenticated && (
            <div className="hidden md:flex gap-2">
              <NavLink to="/login">
                <Button bg="bg-primary-Blue" text={t("login")} />
              </NavLink>

              <NavLink to="/signup">
                <Button bg="bg-primary-Blue" text={t("signup")} />
              </NavLink>
            </div>
          )}

          <div className="hidden items-center gap-2 lg:flex">
            <LanguageSwitcher compact />
            <ThemeToggle />
          </div>

          <div className="relative">
            {clerkAuth && !isLoaded ? (
              <span className="block h-9 w-9 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" aria-label={t("loadingAccount")} />
            ) : isSignedIn ? (
              <ClerkUserMenu isAdmin={loggedInUser?.role?.type === "admin"} t={t} />
            ) : (
              <button
                type="button"
                onClick={() => authenticated ? setProfileOpen(!profileOpen) : router.push("/login")}
                aria-label={authenticated ? t("openProfile") : t("login")}
              >
                <img className="h-9 w-9 cursor-pointer rounded-full object-cover ring-2 ring-transparent hover:ring-primary-Blue" src={avatarUrl || profile.src} alt={t("profile")} />
              </button>
            )}
            {!isSignedIn && authenticated && profileOpen && (
              <div className="absolute right-0 mt-3 w-60 rounded-xl border border-slate-200 bg-white p-2 text-slate-900 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                {loggedInUser?.role?.type === "admin" && <NavLink to="/admin" className="block rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">{t("admin")}</NavLink>}
                <NavLink to="/profile" className="block rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">{t("profile")}</NavLink>
                <NavLink to="/profile/edit" className="block rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">{t("editResortProfile")}</NavLink>
                <NavLink to="/my-bookings" className="block rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">{t("bookings")}</NavLink>
                <NavLink to="/my-orders" className="block rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">{t("orders")}</NavLink>
                <NavLink to="/my-receipts" className="block rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">{t("receipts")}</NavLink>
                <button type="button" onClick={logout} className="w-full rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40">{t("logout")}</button>
              </div>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={t("openMenu")}
            className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-none bg-transparent p-2 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
          >
            <Bar open={menuOpen} rotate="translateY(7px) rotate(45deg)" />
            <Bar open={menuOpen} fade />
            <Bar open={menuOpen} rotate="translateY(-7px) rotate(-45deg)" />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-background px-4 pb-4 dark:border-slate-800 md:hidden">
          <div className="mt-4 flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <ul className="flex flex-col gap-1 mt-3">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive ? activeCls : inactiveCls
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Hide mobile Login and Sign Up after a successful login. */}
          {!authenticated && (
            <div className="flex gap-2 mt-4 pt-4 border-t border-default">
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1"
              >
                <Button bg="bg-primary-Blue" text={t("login")} />
              </NavLink>

              <NavLink
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="flex-1"
              >
                <Button bg="bg-primary-Blue" text={t("signup")} />
              </NavLink>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

function Navbar() {
  return hasClerkPublishableKey() ? <ClerkNavbar /> : <NavbarContent />
}

export default Navbar


