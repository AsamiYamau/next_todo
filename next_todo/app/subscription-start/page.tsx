"use client";

import { useState } from "react";
//session
import { useSession } from "next-auth/react";

const plans = [
  {
    id: 1,
    name: "ベーシックプラン",
    description: "基本機能のみ。無料。",
    pranId1: "price_1SANk7Ch2J0J1cSXtDN9tN0v", // ここにStripeの価格IDを入れる
    pranId2: "price_1SANqICh2J0J1cSXuQe8FziZ", // 年払い用
    price1: "980円",
    price2: "8,800円",
  },
  {
    id: 2,
    name: "スタンダードプラン",
    description: "標準機能＋チーム管理。月額1,000円。",
    pranId1: "price_1SANl4Ch2J0J1cSX8KRCgCbE", // ここにStripeの価格IDを入れる
    pranId2: "price_1SANrgCh2J0J1cSXQc8VFVkk", // 年払い用
    price1: "1,980円",
    price2: "12,800円",
  },
  {
    id: 3,
    name: "Proプラン",
    description: "全機能＋優先サポート。月額3,000円。",
    pranId1: "price_1SANlmCh2J0J1cSXKbcxSvGm", // ここにStripeの価格IDを入れる
    pranId2: "price_1SANsxCh2J0J1cSXLNQ78Val", // 年払い用
    price1: "3,980円",
    price2: "24,800円",
  },
];

export default function SubscriptionStartPage() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSelect = async (userId: string, planId: string) => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      // ここでAPIを叩く
      const res = await fetch("/api/subscription-start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId,planId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "プラン契約に失敗しました");
      } else {
        window.location.href = data.url;
      }
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">プラン選択</h1>
      <div className="space-y-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="border rounded p-4 flex flex-col md:flex-row items-center justify-between"
          >
            <div className="md:w-2/3">
              <div className="font-bold text-lg mb-2">{plan.name}</div>
              <div className="text-gray-600">{plan.description}</div>
            </div>
            <div className="flex flex-col items-end gap-4 items-center md:w-1/3">
              <button
                className={`mt-4 md:mt-0 px-4 py-2 rounded font-bold text-white cursor-pointer bg-orange-400 hover:bg-orange-600 transition-all duration-200`}
                disabled={loading}
                onClick={() => handleSelect(userId,plan.pranId1)}
              >
                月額{plan.price1}
              </button>
              <button
                className={`px-4 py-2 rounded font-bold text-white cursor-pointer bg-orange-500  hover:bg-orange-600 transition-all duration-200`}
                disabled={loading}
                onClick={() => handleSelect(userId,plan.pranId2)}
              >
                お得な年払い{plan.price2}
              </button>
            </div>
          </div>
        ))}
      </div>
      {message && <p className="text-green-600 mt-6">{message}</p>}
      {error && <p className="text-red-600 mt-6">{error}</p>}
    </div>
  );
}
