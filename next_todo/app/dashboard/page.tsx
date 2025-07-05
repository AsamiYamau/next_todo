import { lusitana } from '@/app/ui/fonts';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        最近触った案件
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
bbbb
      </div>
    </main>
  );
}