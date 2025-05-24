// app/lib/useCheckList.ts
import { useState } from 'react';

export type CheckListItem = {
  id: string;
  title: string;
  status: string;
};

export function useCheckList(initialData: CheckListItem[]) {
  const [checkList, setCheckList] = useState(initialData);

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'OK' ? 'NG' : 'OK';

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
