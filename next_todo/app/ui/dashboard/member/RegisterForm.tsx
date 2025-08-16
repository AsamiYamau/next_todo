"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // 招待トークンがある場合はメールアドレスを取得
  useEffect(() => {
    const fetchInvite = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await fetch(`/api/invite/verify?token=${token}`);
      const data = await res.json();
      if (!data.success) {
        setError("招待リンクが無効または期限切れです");
      } else {
        setForm((prev) => ({ ...prev, email: data.email }));
      }
      setLoading(false);
    }; 
    fetchInvite();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ ...form, token }), // tokenも送信
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.error || "登録に失敗しました");
    }
  };

  if (loading) return <p className="text-center mt-10">読み込み中...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">新規登録</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        className="w-full p-2 border mb-2"
        placeholder="Name"
      />
      <input
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
        className="w-full p-2 border mb-2"
        placeholder="Email"
        disabled={!!token} // 招待リンクの場合は編集不可
      />
      <input
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
        className="w-full p-2 border mb-4"
        placeholder="Password"
      />
      <button className="w-full bg-green-500 text-white p-2 rounded">
        登録
      </button>
    </form>
  );
}
