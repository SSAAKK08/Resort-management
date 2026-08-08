import { SignIn } from '@clerk/nextjs';
import { getTranslations } from 'next-intl/server';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import signInImage from '@/assets/LoginSingup/signUp.jpg';
import { hasClerkPublishableKey, hasClerkSecretKey } from '@/lib/clerk-config';

export default async function LoginPage({ searchParams }) {
  const query = await searchParams;
  const requested = String(query?.next || '/');
  const nextPath = requested.startsWith('/') && !requested.startsWith('//') ? requested : '/';
  const t = await getTranslations('Auth');
  const clerkConfigured = hasClerkPublishableKey() && hasClerkSecretKey();

  return <main className="grid min-h-screen bg-slate-50 dark:bg-slate-950 lg:grid-cols-2"><section className="relative hidden bg-cover bg-center lg:block" style={{ backgroundImage: `url(${signInImage.src})` }}><div className="absolute inset-0 bg-slate-950/55" /><div className="absolute inset-x-10 bottom-12 text-white"><p className="font-bold uppercase tracking-widest text-cyan-200">{t('loginEyebrow')}</p><p className="mt-3 max-w-xl text-xl">{t('loginDescription')}</p></div></section><section className="relative flex items-center justify-center px-4 py-20"><div className="absolute right-5 top-5 flex gap-2"><LanguageSwitcher /><ThemeToggle /></div>{clerkConfigured ? <SignIn routing="hash" signUpUrl="/signup" fallbackRedirectUrl={nextPath} /> : <ClerkSetupNotice title={t('configurationTitle')} body={t('configurationBody')} />}</section></main>;
}

function ClerkSetupNotice({ title, body }) {
  return <div role="alert" className="w-full max-w-md rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-950 shadow-sm dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100"><h1 className="text-xl font-bold">{title}</h1><p className="mt-3 leading-7">{body}</p><div className="mt-4 space-y-2 rounded-xl bg-white/70 p-4 font-mono text-xs dark:bg-slate-950/50"><p>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...</p><p>CLERK_SECRET_KEY=sk_...</p><p>CLERK_STRAPI_SYNC_SECRET=...</p></div></div>;
}
