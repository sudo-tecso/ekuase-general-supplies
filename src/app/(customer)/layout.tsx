"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  User, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  Bell
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

import { Logo } from "@/components/shared/Logo";

const NAV_ITEMS = [
  { name: "Overview", href: "/customer/dashboard", icon: LayoutDashboard },
  { name: "My Orders", href: "/customer/orders", icon: ShoppingBag },
  { name: "My Wishlist", href: "/customer/wishlist", icon: Heart },
  { name: "My Profile", href: "/customer/profile", icon: User },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 h-screen bg-white border-r fixed left-0 top-0 z-40">
        <div className="p-8 border-b">
          <Link href="/">
            <Logo size="sm" />
          </Link>
        </div>

        <div className="flex-1 px-4 py-8 space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 relative group",
                  isActive 
                    ? "bg-accent/5 text-accent" 
                    : "text-muted-foreground hover:bg-muted hover:text-secondary"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-accent" : "text-muted-foreground")} />
                <span className="uppercase tracking-widest text-[10px]">{item.name}</span>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-accent rounded-r-full shadow-[2px_0_10px_rgba(255,92,0,0.5)]" />
                )}
                <ChevronRight className={cn(
                  "ml-auto w-4 h-4 opacity-0 transition-all",
                  isActive ? "opacity-100" : "group-hover:opacity-100 group-hover:translate-x-1"
                )} />
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50">
            <div className="w-10 h-10 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center text-accent font-black">
              {session?.user?.name?.[0] || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-secondary truncate">{session?.user?.name}</p>
              <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Customer</p>
            </div>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-4 px-6 py-4 w-full rounded-2xl font-bold text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="uppercase tracking-widest text-[10px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        {/* Header */}
        <header className="h-20 bg-white border-b px-4 lg:px-12 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center hover:bg-muted rounded-lg"
            >
              <Menu className="w-6 h-6 text-secondary" />
            </button>
            <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <span>Customer</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-secondary">{NAV_ITEMS.find(i => i.href === pathname)?.name || "Dashboard"}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 flex items-center justify-center hover:bg-muted rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-secondary" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-white" />
            </button>
            <Link href="/customer/profile">
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-muted hover:border-accent transition-colors">
                 <div className="w-full h-full bg-muted flex items-center justify-center text-xs font-black">
                   {session?.user?.name?.[0]}
                 </div>
              </div>
            </Link>
          </div>
        </header>

        <div className="p-4 lg:p-12 animate-in fade-in duration-500">
          {children}
        </div>
      </main>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <aside className="absolute left-0 top-0 w-80 h-full bg-white animate-in slide-in-from-left duration-300">
             {/* Same content as desktop aside, but with a close button */}
             <div className="p-8 border-b flex justify-between items-center">
              <Link href="/" onClick={() => setIsMobileOpen(false)}>
                <Logo size="sm" />
              </Link>
              <button onClick={() => setIsMobileOpen(false)}><X className="w-6 h-6 text-secondary" /></button>
            </div>
            {/* ... Navigation logic same as desktop ... */}
            <div className="flex-1 px-4 py-8 space-y-2">
              {NAV_ITEMS.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-4 px-6 py-4 rounded-2xl font-bold",
                    pathname === item.href ? "bg-accent/5 text-accent" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="uppercase tracking-widest text-[10px]">{item.name}</span>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
