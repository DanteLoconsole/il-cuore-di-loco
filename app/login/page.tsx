import { Suspense } from "react";
import LoginForm from "@/components/loginForm";

export default function LoginPage() {
  return (
    <div className="flex w-full justify-center bg-accent">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
