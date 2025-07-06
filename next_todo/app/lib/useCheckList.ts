// app/lib/useCheckList.ts
//チェックリストのステータスを管理

import { useState, useEffect } from 'react';
import { CheckListItem } from '@/app/lib/definitions';

export function useCheckList(initialData: CheckListItem[]) {
  const [checkList, setCheckList] = useState(initialData);


    // ★ここを追加！
  useEffect(() => {
    setCheckList(initialData);
  }, [initialData]);


  const handleStatusChange = async (id: string, currentStatus: boolean,LoguinUser:string,LoguinUserName:string) => {
    const newStatus = currentStatus === true ? false : true;

    // UIの状態を更新
    setCheckList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    //チェックされていたらLoguinUserをセット
    if (newStatus === true && LoguinUser) {
      setCheckList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, checked_user_name: LoguinUserName } : item))
      );
    } else {
      setCheckList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, checked_user_name: null } : item))
      );
    }
    const nowString = new Date().toLocaleString('ja-JP', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });

    setCheckList(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              checked_user_name: newStatus ? LoguinUserName : null,
              checked_at: newStatus ? nowString : null,
            }
          : item
      )
    );

    // APIを叩いてDB更新
    await fetch('/api/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus, LoguinUser }),
    });
  };

  return {
    checkList,
    handleStatusChange,
  };
}
