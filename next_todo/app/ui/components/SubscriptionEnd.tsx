"use client";
import { useState } from "react";

export default function CancelSubscriptionButton({ subscriptionId }: { subscriptionId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleCancel = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/subscription-end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "退会に失敗しました");
      } else {
        setMessage("退会手続きが完了しました");
        //ユーザーのデータを全て削除し、リダイレクト

      }
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleCancel} disabled={loading} className="text-sm text-gray-600 hover:underline mx-2">
      {loading ? "退会中..." : "退会する"}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </button>
  );
}
