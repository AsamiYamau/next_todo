"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Project } from "@/app/lib/definitions";
import { useState } from "react";

export default function AddDefault({
  projectId,
  defaultTemplate,
}: {
  projectId: string;
  defaultTemplate: Project[];
}) {
  const router = useRouter();


  const [defautl, setDefault] = useState("");

const handleAddDefault = async (projectId: string, e: React.FormEvent) => {
  e.preventDefault();
  if (confirm("デフォルトチェックリストを追加しますか？")) {
    await fetch(`/api/project/${projectId}/add-default`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        defaultProjectId: defautl, // ← ここで渡す
      }),
    });
    router.push(`/dashboard/project/${projectId}`);
  }
};


  return (
    <>
      {/* <div
        className="bg-blue-400 p-2 px-4 rounded font-bold text-white cursor-pointer"
        onClick={() => handleAddDefault(projectId, LoguinUser)}
      >
        デフォルトチェックリスト反映
      </div> */}
      <form onSubmit={(e) => handleAddDefault(projectId, e)}>
        <div className="flex items-center justify-between">
          <select
            value={defautl}
            onChange={(e) => setDefault(e.target.value)}
            className="p-2 border border-gray-300 rounded mr-2"
          >
            <option value="">デフォルトチェックリストを選択</option>
            {defaultTemplate.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-400 p-2 px-4 rounded font-bold text-white"
            >
              追加
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
