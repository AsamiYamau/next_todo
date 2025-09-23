'use client';

import Link from "next/link";
import Image from "next/image";
import EditIcon from "@/public/ico/edit.svg";
import DeleteIcon from "@/public/ico/trash.svg";

import { useState } from "react";

export default function MemberEdit({member,userId,teamId}:
  {member: { id: string; name: string; role: number };
  userId: string;
  teamId: string;
}) {
    //権限変更ハンドラ
    const [role, setRole] = useState(member.role);

    //編集ハンドラ
    const handleEdit = async (userId: string, roleValue:number) => {
      await fetch(`/api/member/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, roleValue }),
      });
      window.location.reload();
    }
    // 削除ハンドラ
    const handleDelete = async (userId: string, teamId: string) => {
      if (confirm("チームメンバーから削除しますか？")) {
        // await fetch(`/api/member/delete`, { 
        //   method: "DELETE",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ userId, teamId })
  
        //  });
        // window.location.reload();
      }
    };

  return (
    <div className="edit-list flex justify-end">
      <select
        value={role}
        onChange={(e) => setRole(Number(e.target.value))}
        className="ml-2 border rounded px-2 py-1 text-sm mr-2"
      >
        <option value={1}>管理者</option>
        <option value={2}>編集者</option>
      </select>
      <button 
      className="text-sm bg-sky-900 p-1 px-4 rounded font-bold text-white"
      onClick={() => handleEdit(member.id, role)}
      >
        権限を変更
      </button>

      <button
        type="button"
        className="ml-4 text-red-500 hover:underline"
        onClick={() => handleDelete(userId, teamId)}
      >
        <Image
          src={DeleteIcon}
          alt="Delete"
          width={20}
          height={20}
          className="inline-block"
        />
      </button>
    </div>
  );
}
