"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("トークンが無効です。メールのリンクを再度ご確認ください。");
      return;
    }
    if (password !== confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage("パスワードが再設定されました。ログイン画面に移動します。");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.error || "パスワードの再設定に失敗しました。");
      }
    } catch (err) {
      setError("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20">
      <h1 className="text-xl font-bold mb-4">パスワード再設定</h1>
      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border mb-2 rounded"
          placeholder="新しいパスワード"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-2 border mb-4 rounded"
          placeholder="新しいパスワード（確認）"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "送信中..." : "再設定"}
        </button>
      </form>
    </div>
  );
}
