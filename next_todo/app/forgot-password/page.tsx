"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    // ここでAPIにリクエストを送る処理を実装
    // 例: /api/forgot-password へPOST
    try {
      await fetch("/api/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });
      // 仮の成功メッセージ
      setMessage("パスワードリセット用のメールを送信しました。");
    } catch (err) {
      setError("送信に失敗しました。メールアドレスをご確認ください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 md:p-12 max-w-sm mx-auto mt-20">
      <h1 className="text-xl font-bold mb-4">パスワード再設定</h1>
      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border mb-4 rounded"
          placeholder="登録済みメールアドレス"
        />
        <button
          type="submit"
          className="w-full bg-sky-900 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "送信中..." : "送信"}
        </button>
      </form>
    </main>
  );
}
