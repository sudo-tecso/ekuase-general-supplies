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
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <h2 className="font-black uppercase tracking-tighter text-xl text-slate-900">My Cart</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                <ShoppingCart className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900">Your cart is empty</h3>
                <p className="text-slate-500 text-sm font-medium">Looks like you haven't added any materials yet.</p>
              </div>
              <Button onClick={() => setIsOpen(false)} className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-8 py-6 h-auto font-black uppercase tracking-tighter">
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-5 group">
                  <div className="w-24 h-24 relative rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-black text-sm text-slate-900 leading-tight uppercase tracking-tight line-clamp-2">{item.name}</h4>
                      <button 
                        onClick={() => removeItem(item.productId)}
                        className="text-slate-300 hover:text-red-500 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-primary font-black">{formatCurrency(item.price)}</p>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden h-9 bg-slate-50">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="px-3 hover:bg-white transition-colors disabled:opacity-50 text-slate-600"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-black text-slate-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-3 hover:bg-white transition-colors disabled:opacity-50 text-slate-600"
                          disabled={item.quantity >= item.maxStock}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-black text-slate-900 text-sm">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 border-t border-slate-100 space-y-6 bg-slate-50/50 backdrop-blur-sm">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs font-black uppercase tracking-widest">Subtotal</span>
                <span className="text-slate-900 font-black">{formatCurrency(getTotal())}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs font-black uppercase tracking-widest">Logistics estimate</span>
                <span className="text-slate-900 text-xs font-bold italic">Calculated at checkout</span>
              </div>
            </div>
            <div className="h-px bg-slate-100" />
            <Link href="/cart" onClick={() => setIsOpen(false)}>
              <Button className="w-full h-16 bg-primary hover:brightness-110 text-background-dark font-black uppercase tracking-tighter text-lg shadow-xl shadow-primary/10 border-0 group rounded-xl">
                View Shopping Cart
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
