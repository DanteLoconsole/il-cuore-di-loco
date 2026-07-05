import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import LoginForm from "@/components/loginForm";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex w-full justify-center bg-accent">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
