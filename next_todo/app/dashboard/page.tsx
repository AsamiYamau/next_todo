import { lusitana } from '@/app/ui/fonts';
import UserName from '@/app/ui/dashboard/common/UserName'; 


export default async function Page() {

  return (
    <main className='p-6 md:p-12'>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <UserName />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
ダッシュボードに載せるものは特にない
      </div>
     
    </main>
  );
}