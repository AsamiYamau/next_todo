import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import Image from "next/image";
import SignOut from "@/app/ui/dashboard/sign-out";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

import AccountPanel from "@/app/ui/components/AccountPanel";

export default async function Header() {
  const session = await getServerSession(authOptions);
  return (
    <header className="flex h-full p-2 justify-between items-center shadow relative">
      <h1>
        <Link
          className="mb-2 flex items-end justify-start"
          href="/"
        >
          <div className="w-full text-white md:w-full">
            <Image
              src="/logo2.png"
              alt="Logo"
              width={120}
              height={100}
              className=""
            />
          </div>
        </Link>
      </h1>
      {session && (
        <div className="flex items-center gap-4">
          <p className="text-sm">30日を過ぎると自動で退会となり、全てのデータが削除されます。</p>
          <Link 
          href={"/subscription-start"} 
          className="mb-2 p-2 rounded hover:bg-orange-500 cursor-pointer bg-orange-700 font-bold text-white">
          本契約はコチラ
          </Link>

          <AccountPanel
            user={{
              name: session.user?.name ?? undefined,
              email: session.user?.email ?? undefined,
              role: (session.user as any)?.role ?? undefined,
            }}
          />
        </div>
      )}
    </header>
  );
}
