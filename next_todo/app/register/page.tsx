import RegisterForm from "@/app/ui/dashboard/member/RegisterForm";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <main className='p-6 md:p-12'>
      <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
      </Suspense>
    </main>
  );
}
