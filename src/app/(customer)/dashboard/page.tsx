import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, Clock, Heart, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { format } from "date-fns";

export default async function CustomerDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [orders, wishlistCount, stats] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.wishlist.count({
      where: { userId: session.user.id }
    }),
    prisma.order.aggregate({
      where: { userId: session.user.id },
      _count: { id: true },
      _sum: { totalAmount: true }
    })
  ]);

  const pendingDeliveries = await prisma.order.count({
    where: { 
      userId: session.user.id,
      status: { in: ["PAID", "TICKET_GENERATED"] }
    }
  });

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-[40px] bg-secondary p-12 text-white">
        <div className="relative z-10 space-y-2">
          <p className="text-accent font-black uppercase tracking-[0.3em] text-xs">Overview</p>
          <h1 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tighter">
            Good day, {session.user.name?.split(" ")[0]}!
          </h1>
          <p className="text-white/60 font-medium italic">Your construction projects are moving forward. Here's your summary.</p>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        <TrendingUp className="absolute right-12 top-12 w-32 h-32 text-white/5" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Orders", value: stats._count.id, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Pending Tasks", value: pendingDeliveries, icon: Clock, color: "text-accent", bg: "bg-accent/5" },
          { label: "Saved Items", value: wishlistCount, icon: Heart, color: "text-pink-600", bg: "bg-pink-50" },
        ].map((stat, i) => (
          <Card key={i} className="p-8 border-none shadow-xl flex items-center justify-between group hover:scale-[1.02] transition-transform duration-300">
            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              <p className="text-4xl font-heading font-black text-secondary">{stat.value}</p>
            </div>
            <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center", stat.bg)}>
              <stat.icon className={cn("w-8 h-8", stat.color)} />
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading font-black uppercase tracking-tighter text-secondary">Recent Orders</h2>
          <Button asChild variant="outline" size="sm" className="font-bold uppercase tracking-widest text-[10px]">
            <Link href="/customer/orders">View All Orders</Link>
          </Button>
        </div>

        <div className="bg-white rounded-[32px] border overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order ID</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-muted-foreground font-medium italic">No orders found yet.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-black text-secondary uppercase tracking-tighter">#{order.id.slice(-8)}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-medium text-muted-foreground">{format(order.createdAt, "MMM dd, yyyy")}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-secondary">{formatCurrency(Number(order.totalAmount))}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                        order.status === "PAID" ? "bg-green-100 text-green-700" :
                        order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                        order.status === "TICKET_GENERATED" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                      )}>
                        {order.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <Link href={`/customer/orders/${order.id}`} className="text-accent hover:underline flex items-center gap-1 font-black text-xs uppercase tracking-widest">
                        View <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/products" className="group">
          <Card className="p-8 border-2 border-muted hover:border-accent transition-all duration-500 overflow-hidden relative">
            <div className="relative z-10 space-y-2">
              <h3 className="text-xl font-heading font-black uppercase tracking-tighter text-secondary">Browse Materials</h3>
              <p className="text-sm text-muted-foreground">Ready for the next phase? Restock your supplies now.</p>
              <div className="pt-4 flex items-center gap-2 text-accent font-black text-xs uppercase tracking-widest">
                Shop Now <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            <ShoppingBag className="absolute -right-4 -bottom-4 w-32 h-32 text-muted opacity-20 group-hover:rotate-12 transition-transform" />
          </Card>
        </Link>
        <Link href="/services" className="group">
          <Card className="p-8 border-2 border-muted hover:border-secondary transition-all duration-500 overflow-hidden relative">
            <div className="relative z-10 space-y-2">
              <h3 className="text-xl font-heading font-black uppercase tracking-tighter text-secondary">Find Professionals</h3>
              <p className="text-sm text-muted-foreground">Connect with verified architects, plumbers, and electricians.</p>
              <div className="pt-4 flex items-center gap-2 text-secondary font-black text-xs uppercase tracking-widest">
                Hire Now <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            <User className="absolute -right-4 -bottom-4 w-32 h-32 text-muted opacity-20 group-hover:rotate-12 transition-transform" />
          </Card>
        </Link>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
