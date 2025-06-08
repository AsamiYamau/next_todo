'use client';

import { useRouter } from "next/navigation";

export default function AddDefault({  projectId,} : { projectId: string }) {
  const router = useRouter();

  const handleAddDefault = async (projectId: string) => {
    if (confirm('デフォルトチェックリストを追加しますか？')) {
      await fetch(`/api/project/${projectId}/add-default`, { method: 'POST' });
      // 成功したらリダイレクト
      router.push(`/dashboard/project/${projectId}`);
    }
  };

  return (
    <div className="bg-blue-400 p-2 px-4 rounded font-bold text-white cursor-pointer" onClick={() => handleAddDefault(projectId)}>
      デフォルトチェックリスト反映
    </div>
  );
}