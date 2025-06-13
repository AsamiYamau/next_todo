'use client';


import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard'},
  // { name: '提出前チェックリスト', href: '/dashboard/check-list' },
  { name: '案件一覧', href: '/dashboard/project' },
  { name: '案件新規追加', href: '/dashboard/project/create' },
  { name: 'デフォルトチェックリスト設定', href: '/dashboard/default' },


];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <p className="hidden md:block">{link.name}</p>
            </Link>
        );
      })}
    </>
  );
}
