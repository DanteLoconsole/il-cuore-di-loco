import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Detects the visitor's locale (browser Accept-Language → cookie) and rewrites
// unprefixed paths to /{locale}/…. Auth stays enforced server-side in layouts.
export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, and anything with a file extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
