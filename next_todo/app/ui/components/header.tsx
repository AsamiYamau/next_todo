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
    <div className="flex h-full p-2 justify-between items-center">
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
        <AccountPanel
          user={{
            name: session.user?.name ?? undefined,
            email: session.user?.email ?? undefined,
          }}
        />
      )}
    </div>
  );
}
