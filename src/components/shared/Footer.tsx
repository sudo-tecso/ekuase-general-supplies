import Link from "next/link";
import { Logo } from "./Logo";
import { APP_NAME } from "@/constants";

export const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/">
              <Logo size="sm" />
            </Link>
            <p className="text-secondary-foreground/60 text-sm leading-relaxed">
              Ghana's premier platform for construction materials and verified tradespeople. 
              Quality building starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold mb-6 text-accent uppercase tracking-widest text-xs">Quick Links</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/80">
              <li><Link href="/products" className="hover:text-accent transition-colors">Browse Products</Link></li>
              <li><Link href="/services" className="hover:text-accent transition-colors">Find Tradespeople</Link></li>
              <li><Link href="/track-order" className="hover:text-accent transition-colors">Track Order</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-bold mb-6 text-accent uppercase tracking-widest text-xs">Categories</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/80">
              <li><Link href="/category/cement" className="hover:text-accent transition-colors">Cement & Concrete</Link></li>
              <li><Link href="/category/steel" className="hover:text-accent transition-colors">Structural Steel</Link></li>
              <li><Link href="/category/roofing" className="hover:text-accent transition-colors">Roofing Materials</Link></li>
              <li><Link href="/category/tools" className="hover:text-accent transition-colors">Hardware & Tools</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold mb-6 text-accent uppercase tracking-widest text-xs">Contact Us</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/80">
              <li>Apese-Ayikuma, Ghana</li>
              <li>+233 55 583 5876</li>
              <li>ekuasegeneralsupplies@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-secondary-foreground/40">
          <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
