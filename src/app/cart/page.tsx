"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Warehouse, Trash2, ChevronRight, Truck, Info, Lock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const subtotal = getTotal();
  const estimatedTaxes = subtotal * 0.08;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
          <Warehouse className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 mb-2">Your Cart is Empty</h1>
        <p className="text-slate-500 mb-8 max-w-md">You haven't added any construction materials to your cart yet.</p>
        <Link href="/products">
          <Button className="bg-primary text-background-dark font-black uppercase tracking-tighter h-14 px-10 rounded-lg">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background-light min-h-screen pt-12 pb-20">
      <div className="max-w-[1280px] mx-auto w-full px-6 lg:px-20">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/" className="text-slate-500 text-sm font-medium hover:underline">Home</Link>
          <ChevronRight className="text-slate-400 w-4 h-4" />
          <span className="text-slate-900 text-sm font-semibold">Shopping Cart</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content: Cart Items */}
          <div className="flex-1 flex flex-col gap-8">
            <div>
              <h1 className="text-slate-900 text-4xl font-black tracking-tight mb-2">Your Cart</h1>
              <p className="text-slate-500 text-base">Items are grouped by warehouse availability for optimized logistics.</p>
            </div>

            {/* Shipment Group 1 */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-lg border-l-4 border-primary">
                <Warehouse className="text-primary w-6 h-6" />
                <div className="flex flex-col">
                  <h3 className="text-slate-900 font-bold leading-tight">Shipment 1: Main Warehouse</h3>
                  <p className="text-slate-500 text-xs uppercase tracking-wider font-bold">Standard Delivery (2-3 Business Days)</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 bg-white rounded-xl shadow-sm border border-slate-100">
                {items.map((item) => (
                  <div key={item.productId} className="flex flex-col sm:flex-row gap-4 p-5 items-center">
                    <div className="relative aspect-square bg-slate-100 rounded-lg size-24 shrink-0 border border-slate-100 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col gap-1 text-center sm:text-left">
                      <p className="text-slate-900 text-lg font-bold">{item.name}</p>
                      <p className="text-slate-500 text-sm">SKU: {item.productId.slice(0, 8).toUpperCase()}</p>
                      <p className="text-primary font-bold mt-1">{formatCurrency(item.price)} <span className="text-slate-400 font-normal text-xs">/ unit</span></p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-lg">
                        <button 
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-slate-900 shadow-sm hover:bg-slate-100 font-bold"
                        >-</button>
                        <input 
                          readOnly
                          type="number" 
                          value={item.quantity}
                          className="w-8 text-center bg-transparent border-none p-0 text-slate-900 font-bold focus:ring-0" 
                        />
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-slate-900 shadow-sm hover:bg-slate-100 font-bold"
                        >+</button>
                      </div>
                      <p className="text-slate-900 font-black text-lg min-w-[80px] text-right">{formatCurrency(item.price * item.quantity)}</p>
                      <button 
                        onClick={() => removeItem(item.productId)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar: Summary */}
          <aside className="lg:w-96 flex flex-col gap-6">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 sticky top-24">
              <h2 className="text-slate-900 text-2xl font-black mb-6 border-b border-slate-100 pb-4">Order Summary</h2>
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-sm font-medium">Subtotal ({items.length} items)</span>
                  <span className="text-slate-900 font-bold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-sm font-medium">Estimated Taxes</span>
                  <span className="text-slate-900 font-bold">{formatCurrency(estimatedTaxes)}</span>
                </div>
                <div className="border-t border-dashed border-slate-200 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-black text-slate-900 uppercase tracking-tight">Total</span>
                  <span className="text-2xl font-black text-primary">{formatCurrency(subtotal + estimatedTaxes)}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <Link href="/customer/checkout">
                  <Button className="w-full bg-primary hover:brightness-110 text-background-dark py-6 rounded-lg font-black text-lg shadow-md transition-all border-0 uppercase">
                    PROCEED TO CHECKOUT
                  </Button>
                </Link>
                <p className="text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" /> Secure checkout by Ekuase General Supplies
                </p>
              </div>

              {/* Promotion */}
              <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-primary text-xs font-bold uppercase mb-2">Apply Promo Code</p>
                <div className="flex gap-2">
                  <input className="flex-1 bg-white border border-slate-200 rounded-md text-sm px-3 focus:ring-1 focus:ring-primary outline-none" placeholder="Enter code" type="text"/>
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-md text-xs font-bold uppercase">Apply</button>
                </div>
              </div>
            </div>

            {/* Warehouse Info Card */}
            <div className="bg-slate-900 text-white p-6 rounded-xl overflow-hidden relative shadow-lg">
              <div className="relative z-10">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Info className="text-primary w-5 h-5" />
                  Pro Logistics Tip
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Heavy items like cement and rebar are fulfilled from our <strong>Main Warehouse</strong> to ensure the lowest bulk shipping rates.
                </p>
              </div>
              <Truck className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 pointer-events-none" />
            </div>
          </aside>
        </div>

        {/* Complete your project */}
        <section className="mt-20 border-t border-slate-200 pt-16">
          <h2 className="text-2xl font-black mb-8 text-slate-900">Complete your project</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Pro Leather Work Gloves", price: 18.99, image: "https://images.unsplash.com/photo-1544463695-46ba07c724df?w=500&q=80" },
              { name: "Titan Hard Hat - Gen 3", price: 45.00, image: "https://images.unsplash.com/photo-1541888086913-94c6f9328ff9?w=500&q=80" },
              { name: "Steel Precision Measuring Tape", price: 12.50, image: "https://images.unsplash.com/photo-1506544777-64cfbea50a8b?w=500&q=80" },
              { name: "Industrial Blue Tape (Pack 3)", price: 15.99, image: "https://images.unsplash.com/photo-1581458992661-d703b41bf373?w=500&q=80" },
            ].map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-square bg-slate-100 rounded-lg mb-4 overflow-hidden relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                </div>
                <h4 className="text-slate-900 font-bold text-sm">{item.name}</h4>
                <p className="text-primary font-bold text-xs mt-1">{formatCurrency(item.price)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
