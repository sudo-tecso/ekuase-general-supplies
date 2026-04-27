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
import { ShoppingCart, Truck, CreditCard, Ticket, Check, ChevronRight, ChevronLeft, MapPin, Store, Loader2 } from "lucide-react";
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
  const { items, total, subtotal, clearCart, updateQuantity, removeItem } = useCartStore();
  
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
  const finalTotal = subtotal + deliveryFee;

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
        // Initialize Paystack
        const PaystackPop = (await import("@paystack/inline-js")).default;
        const paystack = new PaystackPop();
        
        paystack.newTransaction({
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
          email: session?.user?.email || "",
          amount: finalTotal * 100, // in kobo
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
        // Ticket Flow
        clearCart();
        router.push(`/customer/orders/${orderId}/ticket`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Order failed");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-12 relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -z-10 -translate-y-1/2" />
          {STEPS.map((s) => {
            const Icon = s.icon;
            const active = step >= s.id;
            return (
              <div key={s.id} className="flex flex-col items-center gap-2">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
                  active ? "bg-accent text-white scale-110" : "bg-white text-muted-foreground"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest hidden sm:block",
                  active ? "text-secondary" : "text-muted-foreground"
                )}>
                  {s.name}
                </span>
              </div>
            );
          })}
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            
            {/* Step 1: Cart Review */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-heading font-black uppercase tracking-tighter text-secondary">Review Your Cart</h2>
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{items.length} Items</span>
                </div>
                <div className="space-y-4">
                  {items.map((item) => (
                    <Card key={item.productId} className="p-4 flex gap-4 items-center">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted border">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-secondary">{item.name}</h4>
                        <p className="text-accent font-black">{formatCurrency(item.price)}</p>
                      </div>
                      <div className="flex items-center border rounded-lg bg-muted/50">
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="px-3 py-1 hover:text-accent font-bold"
                        >-</button>
                        <span className="px-2 font-bold">{item.quantity}</span>
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-3 py-1 hover:text-accent font-bold"
                        >+</button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Delivery Details */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-heading font-black uppercase tracking-tighter text-secondary">Delivery Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-secondary">Full Name</label>
                    <Input {...form.register("fullName")} placeholder="First & Last Name" />
                    {form.formState.errors.fullName && <p className="text-xs text-destructive">{form.formState.errors.fullName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-secondary">Phone Number</label>
                    <Input {...form.register("phone")} placeholder="024 XXX XXXX" />
                    {form.formState.errors.phone && <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-secondary">Delivery Method</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={cn(
                      "flex items-center gap-4 p-6 rounded-2xl border-2 transition-all cursor-pointer",
                      deliveryMethod === "DELIVERY" ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-muted bg-white hover:border-accent/50"
                    )}>
                      <input type="radio" {...form.register("method")} value="DELIVERY" className="hidden" />
                      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", deliveryMethod === "DELIVERY" ? "bg-accent text-white" : "bg-muted text-secondary")}>
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-secondary uppercase tracking-tight">Home Delivery</p>
                        <p className="text-xs text-muted-foreground">+ GHS 50.00 Fee</p>
                      </div>
                      {deliveryMethod === "DELIVERY" && <Check className="ml-auto w-5 h-5 text-accent" />}
                    </label>

                    <label className={cn(
                      "flex items-center gap-4 p-6 rounded-2xl border-2 transition-all cursor-pointer",
                      deliveryMethod === "PICKUP" ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-muted bg-white hover:border-accent/50"
                    )}>
                      <input type="radio" {...form.register("method")} value="PICKUP" className="hidden" />
                      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", deliveryMethod === "PICKUP" ? "bg-accent text-white" : "bg-muted text-secondary")}>
                        <Store className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-secondary uppercase tracking-tight">Store Pickup</p>
                        <p className="text-xs text-muted-foreground">Free of Charge</p>
                      </div>
                      {deliveryMethod === "PICKUP" && <Check className="ml-auto w-5 h-5 text-accent" />}
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-secondary">Address / Location Details</label>
                  <textarea 
                    {...form.register("address")}
                    className="w-full min-h-[120px] p-4 rounded-2xl border-2 border-muted focus:border-accent outline-none transition-all resize-none"
                    placeholder="Provide specific directions or store branch for pickup..."
                  />
                  {form.formState.errors.address && <p className="text-xs text-destructive">{form.formState.errors.address.message}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-heading font-black uppercase tracking-tighter text-secondary">Choose Payment Method</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className={cn(
                    "relative p-8 rounded-3xl border-2 transition-all cursor-pointer group flex flex-col items-center text-center gap-4",
                    paymentMethod === "ONLINE" ? "border-accent bg-accent/5 ring-2 ring-accent" : "border-muted bg-white hover:border-accent/50"
                  )}>
                    <input type="radio" name="payment" onChange={() => setPaymentMethod("ONLINE")} checked={paymentMethod === "ONLINE"} className="hidden" />
                    <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <CreditCard className="w-10 h-10 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-xl font-heading font-black uppercase tracking-tighter text-secondary">Pay Online Now</h4>
                      <p className="text-sm text-muted-foreground mt-2 font-medium">Fast & Secure payment via Paystack</p>
                    </div>
                    <div className="mt-4 px-4 py-2 bg-white rounded-lg border flex items-center gap-2">
                       <Image src="https://paystack.com/assets/img/paystack-logo.png" alt="Paystack" width={80} height={20} className="object-contain" />
                    </div>
                    {paymentMethod === "ONLINE" && (
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center shadow-lg">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                  </label>

                  <label className={cn(
                    "relative p-8 rounded-3xl border-2 transition-all cursor-pointer group flex flex-col items-center text-center gap-4",
                    paymentMethod === "TICKET" ? "border-accent bg-accent/5 ring-2 ring-accent" : "border-muted bg-white hover:border-accent/50"
                  )}>
                    <input type="radio" name="payment" onChange={() => setPaymentMethod("TICKET")} checked={paymentMethod === "TICKET"} className="hidden" />
                    <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Ticket className="w-10 h-10 text-secondary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-heading font-black uppercase tracking-tighter text-secondary">Ticket-to-Store</h4>
                      <p className="text-sm text-muted-foreground mt-2 font-medium">Generate a QR ticket and pay in-store</p>
                    </div>
                    <p className="text-[10px] text-accent font-black uppercase tracking-widest mt-2 px-3 py-1 bg-accent/10 rounded-full">No Online Fee</p>
                    {paymentMethod === "TICKET" && (
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center shadow-lg">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                  </label>
                </div>

                <div className="p-6 bg-muted/30 rounded-2xl border-l-4 border-accent">
                  <p className="text-sm text-secondary font-medium italic">
                    {paymentMethod === "ONLINE" 
                      ? "Your order will be processed instantly. Once payment is confirmed, we'll schedule your delivery/pickup."
                      : "A unique QR ticket will be sent to your email. You must present it at our warehouse within 48 hours to secure these prices."
                    }
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[40px] border shadow-2xl space-y-8 sticky top-32">
              <h3 className="text-2xl font-heading font-black uppercase tracking-tighter text-secondary">Order Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                  <span className="font-bold text-secondary">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Delivery Fee</span>
                  <span className="font-bold text-secondary">{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="h-px bg-muted my-4" />
                <div className="flex justify-between items-center">
                  <span className="text-secondary font-black uppercase tracking-widest text-xs">Total Amount</span>
                  <span className="text-2xl font-heading font-black text-accent">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-16 text-lg font-black uppercase tracking-tighter shadow-xl shadow-accent/20"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin w-6 h-6" />
                  ) : step < 3 ? (
                    <>Continue <ChevronRight className="ml-2 w-5 h-5" /></>
                  ) : paymentMethod === "ONLINE" ? (
                    `Pay ${formatCurrency(finalTotal)}`
                  ) : (
                    "Generate Ticket"
                  )}
                </Button>
                
                {step > 1 && (
                  <button 
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="w-full text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-secondary transition-colors flex items-center justify-center"
                  >
                    <ChevronLeft className="mr-1 w-4 h-4" /> Back to {STEPS[step-2].name}
                  </button>
                )}
              </div>
              
              <div className="pt-6 text-center">
                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-[0.2em]">Ekuase General Supplies Platform Secure Checkout</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
