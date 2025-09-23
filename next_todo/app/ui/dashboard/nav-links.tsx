'use client';


import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
//sesstionの取得
import { useSession } from 'next-auth/react';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.


export default function NavLinks() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  const userRole = (session?.user as any)?.role; // ユーザーのロールを取得

  let links = [
  { name: 'Home', href: '/dashboard'},
  // { name: '提出前チェックリスト', href: '/dashboard/check-list' },
  { name: '案件管理', href: '/dashboard/project' },
  // { name: '案件新規追加', href: '/dashboard/project/create' },
  { name: 'クライアント管理', href: '/dashboard/client' },
  { name: 'デフォルトチェックリスト設定', href: '/dashboard/default' },
  { name: 'メンバー管理', href: '/dashboard/member' },


];
  // ユーザーのロールが1（管理者）でない場合は
  if (userRole !== 1) {
    // メンバー管理のリンクを除外
    links = links.filter(link => link.name !== 'メンバー管理');
  }

  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-50 hover:text-sky-900 md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-sky-900': pathname === link.href,
              },
            )}
          >
            <p className="">{link.name}</p>
            </Link>
        );
      })}
    </>
  );
}
