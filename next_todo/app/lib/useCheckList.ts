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


  const handleStatusChange = async (id: string, currentStatus: boolean,LoginUser:string| null,LoginUserName:string) => {
    const newStatus = currentStatus === true ? false : true;
        // newStatus が true のとき、UserId に LoginUser の値をセット、それ以外の場合は null とする
    const UserId = newStatus ? LoginUser : null;


    // UIの状態を更新
    setCheckList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    //チェックされていたらLoguinUserをセット
    if (newStatus === true && LoginUser) {
      setCheckList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, checked_user_name: LoginUserName } : item))
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
              checked_user_name: newStatus ? LoginUserName : null,
              checked_at: newStatus ? nowString : null,
            }
          : item
      )
    );



    // APIを叩いてDB更新
    await fetch('/api/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus, LoginUser: UserId }),
    });
  };

  return {
    checkList,
    handleStatusChange,
  };
}
