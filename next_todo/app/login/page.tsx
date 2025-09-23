"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Image from "next/image";
import EyeOpen from "@/public/ico/eye-open.svg";
import EyeClose from "@/public/ico/eye-close.svg";

//sessionの取得
import { useSession } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [eyeIcon, setEyeIcon] = useState(EyeClose);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(
        "ログイン失敗：メールアドレスまたはパスワードが正しくありません"
      );
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <main className="p-6 md:p-12 mt-20">
      <div className="">
        <div className="text-right">
          <Link href="/register">
            <span className="bg-sky-900 text-white p-2 rounded mt-10 mr-20">
              新規登録はこちら
            </span>
          </Link>
        </div>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-30">
          <h1 className="text-xl font-bold mb-4">ログイン</h1>
          {error && <p className="text-red-500">{error}</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border mb-2"
            placeholder="Email"
          />
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
              tabIndex={-1}
            >
              <Image
                src={showPassword ? EyeOpen : EyeClose}
                alt="Toggle Password Visibility"
                width={20}
                height={20}
              />
            </button>
          </div>
          <button className="w-full bg-sky-900 text-white p-2 rounded mt-4">
            ログイン
          </button>
          <div className="text-right mt-2">
            <Link
              href="/forgot-password"
              className="text-sky-900 hover:underline text-sm"
            >
              パスワードを忘れた方はこちら
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
