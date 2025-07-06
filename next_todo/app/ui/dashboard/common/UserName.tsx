'use client';

import { useSession } from 'next-auth/react';


export default function UserName() {
const { data: session } = useSession();
console.log('UserName session:', session);
  return (
    <div className="">
      <span className="text-xl font-bold text-blue-600">
        {session?.user?.name }
      </span>
      <span>さん、お疲れ様です！</span>
    </div>
  );

}