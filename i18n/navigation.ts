import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware navigation helpers — use these instead of next/link and
// next/navigation so every internal link keeps the /{locale} prefix.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
