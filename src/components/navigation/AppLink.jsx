'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AppLink({ to, href, className, children, ...props }) {
  const pathname = usePathname();
  const target = (href || to || '/').trim();
  const normalizedTarget = target === '/' ? '/' : target.replace(/\/$/, '').toLowerCase();
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '').toLowerCase();
  const isActive =
    normalizedTarget === '/'
      ? normalizedPath === '/'
      : normalizedPath === normalizedTarget || normalizedPath.startsWith(`${normalizedTarget}/`);
  const resolvedClassName =
    typeof className === 'function' ? className({ isActive }) : className;

  return (
    <Link href={target} className={resolvedClassName} {...props}>
      {children}
    </Link>
  );
}
