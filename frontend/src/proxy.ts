import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook(.*)",
]);

const devMiddleware = (req: NextRequest) => {
  const devSession = req.cookies.get("dev_session");
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  if (isDashboard && !devSession) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  return NextResponse.next();
};

const clerkAuth = clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth.protect();
  }
});

export default bypassAuth ? devMiddleware : clerkAuth;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
