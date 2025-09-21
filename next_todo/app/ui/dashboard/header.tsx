import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import Image from 'next/image';


export default function Header() {
  return (
    <div className="flex h-full flex-col px-3 py-2 md:px-2 bg-blue-50">
      <h1>
        <Link
        className="mb-2 flex items-end justify-start rounded-md p-5"
        href="/"
      >
        <div className="w-full text-white md:w-full">
          <Image
            src="/logo2.png"
            alt="Logo"
            width={200}
            height={100}
            className="rounded-full"
          />
        </div>
      </Link>
      </h1>
    </div>
  );
}
