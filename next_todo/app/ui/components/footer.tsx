import Link from "next/link";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export default async function Footer() {
  const session = await getServerSession(authOptions);
  return (
    <footer className="bg-gray-100 text-center p-4 mt-4">
      <div className="">
        <ul className="flex justify-center space-x-2 md:space-x-4 mb-2 flex-wrap">
          <li>
            <Link href="/terms" className="text-sm text-gray-600 hover:underline mx-2">
              利用規約
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="text-sm text-gray-600 hover:underline mx-2">
              プライバシーポリシー
            </Link>
          </li>
          <li>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSeIr2T0AQm_lmRI27JgqCLTJiB6Eus4Xtf0F8uBKQOUsAeArQ/viewform?usp=header" target="_blank" className="text-sm text-gray-600 hover:underline mx-2">
              お問い合わせ
            </a>
          </li>
          {session && (
            <li>
              <Link href="/dashboard/account/delete" className="text-sm text-gray-600 hover:underline mx-2">
                退会
              </Link>
            </li>
          )}
        </ul>
      </div>
      <p className="text-sm text-gray-600">&copy; 2025 Done Quest. All rights reserved.</p>
    </footer>
  );
}