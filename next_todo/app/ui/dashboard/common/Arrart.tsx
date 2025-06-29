'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';


export default function Arrart({ updated }: { updated?: string | string[] }) {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (updated) {
      setShow(true);
    }
  }, [updated]);

  const handleClose = () => {
    setShow(false);
    // クエリパラメータを消す
   // パスだけにリプレイス
  router.replace('/dashboard/project', { scroll: false });
  };

  return (
    <div className="">
      {show && (
        <div className="mt-4 text-green-500 font-bold">
          更新完了！
          <button
            className="ml-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={handleClose}
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}