"use client";

import { useState } from "react";

export default function Invite({teamName,teamId}: {teamName: string, teamId: string}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const sendInvite = async () => {
    setStatus("送信中...");

    const res = await fetch("/api/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        teamName: teamName,
        teamId: teamId
      }),
    });

    const data = await res.json();
    if (data.success) {
      setStatus("招待メール送信完了 ✅");
    } else {
      setStatus("送信失敗 ❌");
    }
  };

  return (
    <div className="mt-8">
      <div className="font-bold text-blue-500">⚫︎新規メンバー追加</div>
      <div className="border border-2 border-gray-300 p-4 rounded w-[50%] mt-4 flex items-center justify-between">
        <input
          type="email"
          placeholder="招待先メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className=' p-2 border border-gray-300 rounded w-[70%]'
        />
        <button onClick={sendInvite} style={{ marginLeft: 10, padding: 8 }} className="bg-blue-400 p-2 px-4 rounded font-bold text-white">
          招待送信
        </button>
      </div>
        <p>{status}</p>
    </div>
  );
}
