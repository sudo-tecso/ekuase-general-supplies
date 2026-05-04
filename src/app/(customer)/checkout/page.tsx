"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ShoppingCart, Truck, CreditCard, Ticket, Check, ChevronRight, ChevronLeft, MapPin, Store, Loader2, Trash2, Info, Warehouse, Lock } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { toast } from "react-hot-toast";
import Image from "next/image";
import axios from "axios";

const deliverySchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Delivery address is required"),
  method: z.enum(["DELIVERY", "PICKUP"]),
});

type DeliveryValues = z.infer<typeof deliverySchema>;

const STEPS = [
  { id: 1, name: "Cart Review", icon: ShoppingCart },
  { id: 2, name: "Delivery", icon: Truck },
  { id: 3, name: "Payment", icon: CreditCard },
  { id: 4, name: "Confirm", icon: Check },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "TICKET">("ONLINE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { data: session } = useSession();
  const { items, clearCart, updateQuantity, removeItem, getTotal } = useCartStore();
  const subtotal = getTotal();
  
  const form = useForm<DeliveryValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      fullName: session?.user?.name || "",
      phone: (session?.user as any)?.phone || "",
      address: "",
      method: "DELIVERY",
    },
  });

  const deliveryMethod = form.watch("method");
  const deliveryFee = deliveryMethod === "DELIVERY" ? 50 : 0;
  const estimatedTaxes = subtotal * 0.08; // 8% dummy tax for the UI layout match
  const finalTotal = subtotal + deliveryFee + estimatedTaxes;

  useEffect(() => {
    if (items.length === 0 && step !== 4) {
      router.push("/products");
    }
  }, [items, step, router]);

  const onSubmit = async (values: DeliveryValues) => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/orders", {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        deliveryDetails: values,
        paymentMethod,
        totalAmount: finalTotal,
        deliveryFee,
      });

      const { orderId } = response.data;

      if (paymentMethod === "ONLINE") {
        const PaystackPop = (await import("@paystack/inline-js")).default;
        const paystack = new PaystackPop();
        
        paystack.newTransaction({
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
          email: session?.user?.email || "",
          amount: Math.round(finalTotal * 100), // in kobo
          currency: "GHS",
          ref: `EGS-${orderId}-${Date.now()}`,
          onSuccess: async (transaction: any) => {
            await axios.post(`/api/orders/${orderId}/verify-payment`, {
              reference: transaction.reference
            });
            clearCart();
            router.push(`/customer/orders/${orderId}/success`);
          },
          onCancel: () => {
            toast.error("Payment cancelled");
            setIsSubmitting(false);
          }
        });
      } else {
        clearCart();
        router.push(`/customer/orders/${orderId}/ticket`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Order failed");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background-light min-h-screen pt-12 pb-20">
      <div className="max-w-[1280px] mx-auto w-full px-6 lg:px-20">
        
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-12 relative px-4 max-w-3xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 -z-10 -translate-y-1/2" />
          {STEPS.map((s) => {
            const Icon = s.icon;
            const active = step >= s.id;
            return (
              <div key={s.id} className="flex flex-col items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border",
                  active ? "bg-primary text-background-dark border-primary scale-110" : "bg-white text-slate-400 border-slate-200"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest hidden sm:block",
                  active ? "text-slate-900" : "text-slate-400"
                )}>
                  {s.name}
                </span>
              </div>
            );
          })}
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-10">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col gap-8">
            
            {/* Step 1: Cart Review */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h1 className="text-slate-900 text-4xl font-black tracking-tight mb-2">Your Cart</h1>
                  <p className="text-slate-500 text-base">Items are grouped by warehouse availability for optimized logistics.</p>
                </div>
                
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
                          <p className="text-slate-500 text-sm">SKU: {item.productId.slice(0,8).toUpperCase()}</p>
                          <p className="text-primary font-bold mt-1">{formatCurrency(item.price)} <span className="text-slate-400 font-normal text-xs">/ unit</span></p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-lg">
                            <button 
                              type="button"
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
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-slate-900 shadow-sm hover:bg-slate-100 font-bold"
                            >+</button>
                          </div>
                          <p className="text-slate-900 font-black text-lg min-w-[80px] text-right">{formatCurrency(item.price * item.quantity)}</p>
                          <button 
                            type="button"
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
            )}

            {/* Step 2: Delivery Details */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
                <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-6">Delivery Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Full Name</label>
                    <Input {...form.register("fullName")} placeholder="First & Last Name" className="border-slate-200 focus-visible:ring-primary h-12" />
                    {form.formState.errors.fullName && <p className="text-xs text-red-500">{form.formState.errors.fullName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Phone Number</label>
                    <Input {...form.register("phone")} placeholder="024 XXX XXXX" className="border-slate-200 focus-visible:ring-primary h-12" />
                    {form.formState.errors.phone && <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>}
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Delivery Method</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={cn(
                      "flex items-center gap-4 p-6 rounded-2xl border-2 transition-all cursor-pointer",
                      deliveryMethod === "DELIVERY" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-200 bg-white hover:border-primary/50"
                    )}>
                      <input type="radio" {...form.register("method")} value="DELIVERY" className="hidden" />
                      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", deliveryMethod === "DELIVERY" ? "bg-primary text-background-dark" : "bg-slate-100 text-slate-400")}>
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 tracking-tight">Home Delivery</p>
                        <p className="text-xs text-slate-500">+ {formatCurrency(50.00)} Fee</p>
                      </div>
                      {deliveryMethod === "DELIVERY" && <Check className="ml-auto w-5 h-5 text-primary" />}
                    </label>

                    <label className={cn(
                      "flex items-center gap-4 p-6 rounded-2xl border-2 transition-all cursor-pointer",
                      deliveryMethod === "PICKUP" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-200 bg-white hover:border-primary/50"
                    )}>
                      <input type="radio" {...form.register("method")} value="PICKUP" className="hidden" />
                      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", deliveryMethod === "PICKUP" ? "bg-primary text-background-dark" : "bg-slate-100 text-slate-400")}>
                        <Store className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 tracking-tight">Store Pickup</p>
                        <p className="text-xs text-slate-500">Free of Charge</p>
                      </div>
                      {deliveryMethod === "PICKUP" && <Check className="ml-auto w-5 h-5 text-primary" />}
                    </label>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Address / Location Details</label>
                  <textarea 
                    {...form.register("address")}
                    className="w-full min-h-[120px] p-4 rounded-xl border border-slate-200 focus:border-primary outline-none focus:ring-1 focus:ring-primary transition-all resize-none text-sm"
                    placeholder="Provide specific directions or store branch for pickup..."
                  />
                  {form.formState.errors.address && <p className="text-xs text-red-500">{form.formState.errors.address.message}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
                <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-6">Payment Method</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className={cn(
                    "relative p-8 rounded-2xl border-2 transition-all cursor-pointer group flex flex-col items-center text-center gap-4",
                    paymentMethod === "ONLINE" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-200 bg-white hover:border-primary/50"
                  )}>
                    <input type="radio" name="payment" onChange={() => setPaymentMethod("ONLINE")} checked={paymentMethod === "ONLINE"} className="hidden" />
                    <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <CreditCard className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black tracking-tighter text-slate-900">Pay Online Now</h4>
                      <p className="text-sm text-slate-500 mt-2 font-medium">Fast & Secure payment</p>
                    </div>
                    {paymentMethod === "ONLINE" && (
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary text-background-dark flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </label>

                  <label className={cn(
                    "relative p-8 rounded-2xl border-2 transition-all cursor-pointer group flex flex-col items-center text-center gap-4",
                    paymentMethod === "TICKET" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-200 bg-white hover:border-primary/50"
                  )}>
                    <input type="radio" name="payment" onChange={() => setPaymentMethod("TICKET")} checked={paymentMethod === "TICKET"} className="hidden" />
                    <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Ticket className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black tracking-tighter text-slate-900">Ticket-to-Store</h4>
                      <p className="text-sm text-slate-500 mt-2 font-medium">Generate QR and pay in-store</p>
                    </div>
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-2 px-3 py-1 bg-primary/10 rounded-full">No Online Fee</p>
                    {paymentMethod === "TICKET" && (
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary text-background-dark flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary (from cart.zip) */}
          <aside className="lg:w-96 flex flex-col gap-6">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 sticky top-24">
              <h2 className="text-slate-900 text-2xl font-black mb-6 border-b border-slate-100 pb-4">Order Summary</h2>
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-sm font-medium">Subtotal ({items.length} items)</span>
                  <span className="text-slate-900 font-bold">{formatCurrency(subtotal)}</span>
                </div>
                
                {step > 1 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-slate-500">
                      <span className="text-xs">Delivery Fee</span>
                      <span className="text-slate-900 text-xs font-semibold">{formatCurrency(deliveryFee)}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-sm font-medium">Estimated Taxes</span>
                  <span className="text-slate-900 font-bold">{formatCurrency(estimatedTaxes)}</span>
                </div>
                
                <div className="border-t border-dashed border-slate-200 my-2"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-black text-slate-900 uppercase tracking-tight">Total</span>
                  <span className="text-2xl font-black text-primary">{formatCurrency(step > 1 ? finalTotal : subtotal + estimatedTaxes)}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:brightness-110 text-background-dark py-6 rounded-lg font-black text-lg shadow-md transition-all border-0"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin w-6 h-6" />
                  ) : step < 3 ? (
                    `Proceed to ${STEPS[step].name}`
                  ) : paymentMethod === "ONLINE" ? (
                    `Pay Now`
                  ) : (
                    "Generate Ticket"
                  )}
                </Button>
                
                {step > 1 && (
                  <button 
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="w-full text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors flex items-center justify-center"
                  >
                    <ChevronLeft className="mr-1 w-4 h-4" /> Back to {STEPS[step-2].name}
                  </button>
                )}
                
                <p className="text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" /> Secure checkout by EGS
                </p>
              </div>

              {/* Promotion (Visual Only) */}
              {step === 1 && (
                <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-primary text-xs font-bold uppercase mb-2">Apply Promo Code</p>
                  <div className="flex gap-2">
                    <input className="flex-1 bg-white border border-slate-200 rounded-md text-sm px-3 focus:ring-1 focus:ring-primary outline-none" placeholder="Enter code" type="text"/>
                    <button type="button" className="bg-slate-900 text-white px-4 py-2 rounded-md text-xs font-bold uppercase">Apply</button>
                  </div>
                </div>
              )}
            </div>

            {/* Warehouse Info Card */}
            {step === 1 && (
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
            )}
          </aside>
        </form>

        {/* Recently Viewed / Recommendations Placeholder */}
        {step === 1 && (
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
        )}

      </div>
    </div>
  );
}
