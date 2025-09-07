import SideNav from "@/app/ui/dashboard/sidenav";
import Footer from "@/app/ui/dashboard/footer";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return (
    <>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow md:overflow-y-auto flex flex-col">
          {children}
          <div className="hidden h-auto w-full grow  md:block"></div>
          <div className="">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
