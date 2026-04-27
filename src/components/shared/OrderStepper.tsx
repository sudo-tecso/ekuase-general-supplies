import { cn } from "@/lib/utils";
import { Check, Loader2, Package, Truck, Home, MapPin } from "lucide-react";

interface OrderStepperProps {
  status: string;
  paymentMethod: "ONLINE" | "TICKET";
}

const ONLINE_STEPS = [
  { label: "Placed", status: "PENDING", icon: Package },
  { label: "Paid", status: "PAID", icon: Check },
  { label: "Preparing", status: "PREPARING", icon: Loader2 },
  { label: "In Transit", status: "IN_TRANSIT", icon: Truck },
  { label: "Delivered", status: "DELIVERED", icon: Home },
];

const TICKET_STEPS = [
  { label: "Generated", status: "TICKET_GENERATED", icon: Package },
  { label: "Verified", status: "VERIFIED", icon: Check },
  { label: "Paid", status: "PAID", icon: Check },
  { label: "Ready", status: "READY", icon: MapPin },
];

export function OrderStepper({ status, paymentMethod }: OrderStepperProps) {
  const steps = paymentMethod === "ONLINE" ? ONLINE_STEPS : TICKET_STEPS;
  
  // Find current index
  let currentIdx = steps.findIndex((s) => s.status === status);
  if (currentIdx === -1) {
    // Fallback logic for status mapping
    if (status === "PAID" && paymentMethod === "ONLINE") currentIdx = 1;
    if (status === "TICKET_GENERATED") currentIdx = 0;
  }

  return (
    <div className="flex items-center justify-between w-full relative px-4">
      {/* Background Line */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0" />
      
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isCompleted = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isFuture = idx > currentIdx;

        return (
          <div key={idx} className="flex flex-col items-center gap-3 relative z-10">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg",
              isCompleted ? "bg-green-500 text-white" : 
              isCurrent ? "bg-accent text-white scale-110 ring-4 ring-accent/20" : 
              "bg-white text-muted-foreground border-2 border-muted"
            )}>
              {isCompleted ? <Check className="w-5 h-5" /> : <Icon className={cn("w-5 h-5", isCurrent && "animate-pulse")} />}
            </div>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest text-center",
              isCurrent ? "text-accent" : "text-muted-foreground"
            )}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
