"use client";
import { useState } from "react";


export default function CreateMember() {
  const [team, setTeam] = useState("");
  const [status, setStatus] = useState("");

  const createTeam = async () => {
      setStatus("チーム作成中...");
    const res = await fetch("/api/team/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: team }),
    });
    const data = await res.json();
    if (data.success) {
      setStatus("チーム作成完了 ✅");

      // リロード
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 1秒後にリロード
      
    } else {
      setStatus("チーム作成失敗 ❌");
    }
  };
  return (
    <div className="">
      <div className="font-bold text-sky-900">⚫︎チーム作成</div>
      <div className="border border-2 border-gray-300 p-4 rounded w-[50%] mt-4">
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="チーム名を入力"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="p-2 border border-gray-300 rounded w-[70%]"
          />
          <button
            onClick={createTeam}
            className="bg-sky-900 p-2 px-4 rounded font-bold text-white ml-2"
          >
            チーム作成
          </button>
        </div>
      </div>
      <p className="mt-2 text-green-500">{status}</p>
    </div>
  );
}
