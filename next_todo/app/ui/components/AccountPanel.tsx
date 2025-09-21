"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SignOut from '@/app/ui/dashboard/sign-out';

export default function AccountPanel({ user }: { user: { name?: string; email?: string } }) {
  const [show, setShow] = useState(false);

  return (
    <>
      {/* ユーザーアイコン（パネル開閉トグル） */}
      <div className="relative cursor-pointer" onClick={() => setShow((prev) => !prev)}>
        <Image
          src="/ico/user.svg"
          alt="account Image"
          width={24}
          height={24}
        />
      </div>
      {/* スライドパネル */}
      <div
        className={`
          fixed top-20 right-0 h-full w-80 bg-white shadow-lg z-50
          transition-transform duration-300
          ${show ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-6 space-y-4 mt-10">
          <div className="space-y-1">
            <p className=""><span className="font-bold">{user.name}</span>さん</p>
            <p>{user.email}</p>
            <Link href="/dashboard/account" className="text-blue-500 underline">アカウント設定はこちら</Link>
          </div>
          <div className="mt-2 space-y-1">
            <p className="font-bold">プラン</p>
            <p>スタンダードプラン</p>
            <a href="" className="text-blue-500 underline">プランの変更はこちら</a>
          </div>
          <SignOut />
        </div>
      </div>
    </>
  );
}