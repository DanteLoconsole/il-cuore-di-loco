"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type NewsletterState = { error?: string; success?: boolean } | undefined;

const schema = z.object({
  name: z.string().trim().max(100).optional(),
  email: z.string().trim().email("Ongeldig e-mailadres."),
});

/** Public — capture a newsletter sign-up. Idempotent for already-subscribed emails. */
export async function subscribeNewsletter(
  _prev: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const parsed = schema.safeParse({
    name: formData.get("name") || undefined,
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email } = parsed.data;

  // Upsert keeps it idempotent: re-subscribing with the same email is a no-op success.
  await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: { name: name ?? undefined },
    create: { name, email },
  });

  revalidatePath("/admin");
  return { success: true };
}
