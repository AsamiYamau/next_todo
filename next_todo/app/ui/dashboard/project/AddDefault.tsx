'use client';

import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react';


export default function AddDefault({ projectId, }: { projectId: string }) {
  const router = useRouter();

  const { data: session } = useSession();
  const LoguinUser = (session?.user as any)?.id;

  const handleAddDefault = async (projectId: string,LoguinUser:string) => {
    if (confirm('デフォルトチェックリストを追加しますか？')) {
      await fetch(`/api/project/${projectId}/add-default`, { method: 'POST' });
      // 成功したらリダイレクト
      router.push(`/dashboard/project/${projectId}`);
    }
  };

  return (
    <div className="bg-blue-400 p-2 px-4 rounded font-bold text-white cursor-pointer" onClick={() => handleAddDefault(projectId,LoguinUser)}>
      デフォルトチェックリスト反映
    </div>
  );
}