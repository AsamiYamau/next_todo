import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import SignOut from '@/app/ui/dashboard/sign-out';
import Image from 'next/image';


export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex items-end justify-start rounded-md p-5"
        href="/"
      >
        <div className="w-full text-white md:w-full">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={200}
            height={100}
            className="rounded-full"
          />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
       <SignOut />
      </div>
    </div>
  );
}
