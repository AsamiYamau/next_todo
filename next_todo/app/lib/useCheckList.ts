// app/lib/useCheckList.ts
//チェックリストのステータスを管理

import { useState } from 'react';
import { CheckListItem } from '@/app/lib/definitions';

export function useCheckList(initialData: CheckListItem[]) {
  const [checkList, setCheckList] = useState(initialData);

  const handleStatusChange = async (id: string, currentStatus: boolean) => {
    const newStatus = currentStatus === true ? false : true;

    // UIの状態を更新
    setCheckList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    // APIを叩いてDB更新
    await fetch('/api/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
  };

  return {
    checkList,
    handleStatusChange,
  };
}
