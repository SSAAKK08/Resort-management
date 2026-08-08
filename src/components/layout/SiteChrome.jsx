'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/hearder&footer/Footer';
import Navbar from '@/components/hearder&footer/Navbar';

const pagesWithoutSiteChrome = new Set(['/login', '/signup']);

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const hideSiteChrome = pathname.startsWith('/admin') || pagesWithoutSiteChrome.has(pathname);

  if (hideSiteChrome) return children;

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
