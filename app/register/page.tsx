"use client";

import { useActionState } from "react";
import Link from "next/link";
import { register } from "@/app/actions/auth";
import SectionHeading from "@/components/sectionHeading";
import { Button } from "@/components/ui/button";

const inputClass =
  "rounded-md border border-header/20 bg-white p-3 text-[0.95rem] focus:border-main focus:outline-none";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, undefined);

  return (
    <div className="flex w-full justify-center bg-accent">
      <div className="w-full max-w-md px-6 py-16">
        <SectionHeading>Account aanmaken</SectionHeading>

        <form action={formAction} className="mt-8 flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Naam"
            autoComplete="name"
            required
            className={inputClass}
          />
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
            placeholder="Wachtwoord (min. 8 tekens)"
            autoComplete="new-password"
            minLength={8}
            required
            className={inputClass}
          />

          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

          <Button type="submit" disabled={pending} className="p-4">
            {pending ? "Bezig…" : "Registreren"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-header/70">
          Al een account?{" "}
          <Link href="/login" className="font-semibold text-main">
            Log hier in
          </Link>
        </p>
      </div>
    </div>
  );
}
