"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, User, Menu, X, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SearchBar } from "./SearchBar";
import { Logo } from "./Logo";

export const Navbar = () => {
  const { data: session } = useSession();
  const cartItems = useCartStore((state) => state.items);
  const setIsCartOpen = useCartStore((state) => state.setIsOpen);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isAdminOrManager = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER";

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/">
          <Logo size="sm" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium hover:text-accent transition-colors">Home</Link>
          <Link href="/products" className="text-sm font-medium hover:text-accent transition-colors">Products</Link>
          <Link href="/services" className="text-sm font-medium hover:text-accent transition-colors">Services</Link>
          <div className="w-64">
            <SearchBar />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isAdminOrManager ? (
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm" className="font-bold uppercase tracking-widest text-[10px] border-accent text-accent hover:bg-accent hover:text-white">
                  Admin Dashboard
                </Button>
              </Link>
              <div className="h-4 w-[1px] bg-border" />
              <button 
                onClick={() => signOut()}
                className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : session ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-muted rounded-full transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pl-3 hover:bg-muted rounded-full transition-all border border-transparent hover:border-border"
                >
                  <span className="text-sm font-medium">{session.user.name?.replace("BuildMart", "EGS")?.split(" ")[0]}</span>
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                    <User className="w-4 h-4" />
                  </div>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", isProfileOpen && "rotate-180")} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border rounded-lg shadow-lg py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link href="/customer/dashboard" className="block px-4 py-2 text-sm hover:bg-muted">Dashboard</Link>
                    <Link href="/customer/orders" className="block px-4 py-2 text-sm hover:bg-muted">My Orders</Link>
                    <Link href="/customer/wishlist" className="block px-4 py-2 text-sm hover:bg-muted">Wishlist</Link>
                    <hr className="my-1" />
                    <button 
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-muted"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full w-full bg-background border-b animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-4 gap-4">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/products" onClick={() => setIsMenuOpen(false)}>Products</Link>
            <Link href="/services" onClick={() => setIsMenuOpen(false)}>Services</Link>
            <hr />
            {!session && (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Register</Button>
                </Link>
              </div>
            )}
            {session && (
              <div className="flex flex-col gap-4">
                {isAdminOrManager && (
                  <Link href="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full font-black uppercase tracking-tighter">Admin Dashboard</Button>
                  </Link>
                )}
                <Link href="/customer/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start px-0 font-bold uppercase tracking-widest text-xs">Customer Dashboard</Button>
                </Link>
                <Button variant="ghost" onClick={() => signOut()} className="justify-start px-0 text-destructive font-bold uppercase tracking-widest text-xs">Logout</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
