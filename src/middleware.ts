import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const role = req.auth?.user?.role;

  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isPublicRoute = 
    nextUrl.pathname === "/" || 
    nextUrl.pathname.startsWith("/(public)") || 
    ["/login", "/register", "/products", "/services", "/unauthorized"].includes(nextUrl.pathname);
  
  const isAuthRoute = ["/login", "/register"].includes(nextUrl.pathname);
  
  const isCustomerRoute = nextUrl.pathname.startsWith("/customer");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isManagerRoute = nextUrl.pathname.startsWith("/manager");

  if (isApiRoute) return NextResponse.next();

  if (isAuthRoute) {
    if (isLoggedIn) {
      const redirectUrl = role === "ADMIN" ? "/admin/dashboard" : role === "MANAGER" ? "/manager/dashboard" : "/customer/dashboard";
      return NextResponse.redirect(new URL(redirectUrl, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && (isCustomerRoute || isAdminRoute || isManagerRoute)) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  if (isLoggedIn) {
    if (isCustomerRoute && role !== "CUSTOMER") {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }
    if (isAdminRoute && role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }
    if (isManagerRoute && role !== "MANAGER") {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
