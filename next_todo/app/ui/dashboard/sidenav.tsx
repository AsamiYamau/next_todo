import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import SignOut from '@/app/ui/dashboard/sign-out';
import Image from 'next/image';


export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 md:px-2 bg-gray-50 overflow-x-auto md:overflow-visible">
      <div className="flex flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2 mt-2 mb-2 sticky top-2 w-[650px] md:w-auto">
        <NavLinks />
      </div>
    </div>
  );
}
