'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/hearder&footer/Footer';
import Navbar from '@/components/hearder&footer/Navbar';
import ChatBot from '@/components/chatbot/ChatBot';

const pagesWithoutSiteChrome = new Set(['/login', '/signup']);

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const hideSiteChrome = pathname.startsWith('/admin') || pagesWithoutSiteChrome.has(pathname);

  if (pathname.startsWith('/admin')) return children;

  if (hideSiteChrome) {
    return (
      <>
        {children}
        <ChatBot />
      </>
    );
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <ChatBot />
    </>
  );
}
