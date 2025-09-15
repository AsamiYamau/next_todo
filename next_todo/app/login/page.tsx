"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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
    <div className="mt-20">
      <div className="flex items-start">
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-30">
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border mb-4"
            placeholder="Password"
          />
          <button className="w-full bg-blue-500 text-white p-2 rounded">
            ログイン
          </button>
          <div className="text-right mt-2">
            <Link
              href="/forgot-password"
              className="text-blue-500 hover:underline text-sm"
            >
              パスワードを忘れた方はこちら
            </Link>
          </div>
        </form>
        <Link href="/register">
          <span className="bg-blue-500 text-white p-2 rounded mt-10 mr-20">
            新規登録はこちら
          </span>
        </Link>
      </div>
    </div>
  );
}
