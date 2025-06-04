import { internationalizationMiddleware } from "@/middlewares/internationalization.middleware";
import type { NextRequest } from "next/server";

export const config = {
  // matcher tells Next.js which routes to run the middleware on. This runs the
  // middleware on all routes except for static assets and Posthog ingest
  matcher: ["/((?!api|_next/static|_next/image|ingest|images|favicon.ico).*)"],
};

export function middleware(request: NextRequest) {
  return internationalizationMiddleware(request);
}
