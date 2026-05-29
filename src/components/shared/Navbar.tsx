"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  // Destructure `status` alongside `data` — status is the ONLY reliable
  // synchronous indicator. `data` is null during "loading", so branching on
  // `!!session` alone causes a flash of the unauthenticated state on every
  // client-side navigation while the JWT is still being verified.
  const { data: session, status } = useSession();

  const totalItems = useCartStore((state) => state.getItemCount());
  const pathname = usePathname();
  const hasSidebar =
    pathname?.startsWith("/customer") || pathname?.startsWith("/admin");

  /** First letter of the user's name, used as avatar fallback */
  const userInitial = session?.user?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 px-4 md:px-20 py-4 transition-all",
        // Match the sidebar width (18rem) + original 2rem padding = 20rem
        hasSidebar && "lg:pl-[20rem]"
      )}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8">

        {/* ── Logo ─────────────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="size-10 bg-white rounded flex items-center justify-center overflow-hidden">
            <img
              alt="Ekuase General Supplies Logo"
              className="w-full h-full object-contain"
              src="/logo.png"
            />
          </div>
          <h2 className="text-xl font-black tracking-tight uppercase">
            Ekuase General Supplies
          </h2>
        </Link>

        {/* ── Navigation Links ──────────────────────────────────────── */}
        <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          <Link
            className="text-sm font-semibold hover:text-primary transition-colors"
            href="/products"
          >
            Materials
          </Link>
          <Link
            className="text-sm font-semibold hover:text-primary transition-colors"
            href="/warehouses"
          >
            Warehouses
          </Link>
          <Link
            className="text-sm font-semibold hover:text-primary transition-colors"
            href="/services"
          >
            Hire Professionals
          </Link>
          <Link
            className="text-sm font-semibold hover:text-primary transition-colors"
            href="/products"
          >
            Products
          </Link>
          <Link
            className="text-sm font-semibold hover:text-primary transition-colors"
            href="/orders"
          >
            Track Order
          </Link>
        </nav>

        {/* ── Right-side controls ───────────────────────────────────── */}
        <div className="flex items-center gap-4 shrink-0">

          {/* Cart — always visible */}
          <Link
            href="/cart"
            className="flex items-center justify-center rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] mr-2">
              shopping_cart
            </span>
            <span className="text-sm font-bold">Cart</span>
            {totalItems > 0 && (
              <span className="ml-1 bg-primary text-background-dark text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {totalItems}
              </span>
            )}
          </Link>

          {/* ── Auth controls — gated on `status`, never on `!!session` ── */}
          {status === "loading" ? (
            // Skeleton preserves layout width while the JWT resolves,
            // preventing the layout shift that makes "Sign In" flash briefly.
            <div className="flex items-center gap-2 animate-pulse" aria-hidden="true">
              <div className="h-10 w-20 rounded-lg bg-slate-200 dark:bg-slate-700" />
              <div className="h-10 w-20 rounded-lg bg-slate-200 dark:bg-slate-700" />
            </div>
          ) : status === "authenticated" ? (
            // ── Signed-in state ──────────────────────────────────────
            <div className="flex items-center gap-3">
              <Link
                href="/customer/profile"
                className="hidden sm:flex items-center text-sm font-semibold hover:text-primary transition-colors"
              >
                {session.user?.name?.split(" ")[0] ?? "My Account"}
              </Link>
              <button
                id="navbar-sign-out-btn"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center justify-center rounded-lg h-10 px-5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:brightness-110 transition-all"
              >
                <span className="text-sm font-bold">Sign Out</span>
              </button>
            </div>
          ) : (
            // ── Signed-out state ─────────────────────────────────────
            <div className="flex items-center gap-2">
              <Link
                id="navbar-sign-in-link"
                href="/login"
                className="flex items-center justify-center rounded-lg h-10 px-5 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <span className="text-sm font-bold">Sign In</span>
              </Link>
              <Link
                id="navbar-sign-up-link"
                href="/register"
                className="flex items-center justify-center rounded-lg h-10 px-5 bg-primary text-background-dark hover:brightness-110 transition-all"
              >
                <span className="text-sm font-bold">Sign Up</span>
              </Link>
            </div>
          )}

          {/* ── Avatar — only rendered when authenticated ─────────── */}
          {status === "authenticated" && (
            <Link
              href="/customer/profile"
              id="navbar-avatar-link"
              className="size-10 rounded-full border-2 border-primary/30 bg-slate-200 overflow-hidden shrink-0 hover:ring-2 hover:ring-primary/50 transition-all"
              title={session.user?.name ?? "My Profile"}
            >
              {session.user?.image ? (
                <img
                  alt={session.user.name ?? "User avatar"}
                  className="w-full h-full object-cover"
                  src={session.user.image}
                  referrerPolicy="no-referrer"
                />
              ) : (
                // Fallback: coloured circle with the user's first initial
                <div className="w-full h-full flex items-center justify-center bg-primary text-background-dark font-bold text-sm select-none">
                  {userInitial}
                </div>
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
