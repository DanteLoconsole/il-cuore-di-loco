"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import SectionHeading from "@/components/sectionHeading";
import { Button } from "@/components/ui/button";

const inputClass =
  "rounded-md border border-header/20 bg-white p-3 text-[0.95rem] focus:border-main focus:outline-none";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/admin";

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      redirect: false,
    });

    setPending(false);
    if (res?.error) {
      setError("E-mailadres of wachtwoord is onjuist.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="w-full max-w-md px-6 py-16">
      <SectionHeading>Beheer</SectionHeading>
      <p className="mt-4 text-center text-sm text-header/70">
        Enkel voor beheerders.
      </p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="E-mailadres"
          autoComplete="email"
          required
          className={inputClass}
        />
        <input
          type="password"
          name="password"
          placeholder="Wachtwoord"
          autoComplete="current-password"
          required
          className={inputClass}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={pending} className="p-4">
          {pending ? "Bezig…" : "Inloggen"}
        </Button>
      </form>
    </div>
  );
}
