"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency, cn } from "@/lib/utils";
import { useEffect } from "react";

export const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getTotal } = useCartStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-accent" />
            <h2 className="font-heading font-black uppercase tracking-tighter text-xl">My Cart</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-secondary">
                <ShoppingCart className="w-10 h-10 opacity-20" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading uppercase tracking-tighter">Your cart is empty</h3>
                <p className="text-secondary text-sm">Looks like you haven't added anything yet.</p>
              </div>
              <Button onClick={() => setIsOpen(false)} className="uppercase font-bold tracking-widest text-xs">
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 group">
                  <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-bold text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-secondary font-black">{formatCurrency(item.price)}</p>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border rounded-lg overflow-hidden h-8">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="px-2 hover:bg-muted transition-colors disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-2 hover:bg-muted transition-colors disabled:opacity-50"
                          disabled={item.quantity >= item.maxStock}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.productId)}
                        className="text-danger p-2 hover:bg-danger/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t space-y-4 bg-muted/30">
            <div className="flex justify-between items-end">
              <span className="text-secondary text-sm font-bold uppercase tracking-widest">Subtotal</span>
              <span className="text-2xl font-black text-primary">{formatCurrency(getTotal())}</span>
            </div>
            <p className="text-[10px] text-secondary text-center uppercase tracking-widest">
              Shipping & taxes calculated at checkout
            </p>
            <Link href="/checkout" onClick={() => setIsOpen(false)}>
              <Button className="w-full h-14 font-black uppercase tracking-tighter text-lg group">
                Proceed to Checkout
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
