import { auth } from "@/lib/auth";
import { APP_NAME, APP_DESCRIPTION } from "@/constants";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Package, Truck, Users, ShieldCheck } from "lucide-react";

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent font-black text-[10px] uppercase tracking-widest animate-in fade-in slide-in-from-left duration-700">
              <ShieldCheck className="w-4 h-4" /> Ghana's #1 Construction Marketplace
            </div>
            <h1 className="text-6xl md:text-8xl font-heading font-black text-secondary uppercase tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom duration-700 delay-100">
              Build Faster. <br />
              <span className="text-accent">Pay Smarter.</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl italic leading-relaxed animate-in fade-in slide-in-from-bottom duration-700 delay-200">
              {APP_DESCRIPTION} From high-grade cement to professional architects, we provide everything you need to bring your vision to life.
            </p>
            <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
              {session ? (
                <Link href={session.user.role === "ADMIN" ? "/admin/dashboard" : "/customer/dashboard"}>
                  <Button size="lg" className="h-16 px-10 font-black uppercase tracking-tighter shadow-2xl shadow-accent/20">
                    Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <Link href="/register">
                  <Button size="lg" className="h-16 px-10 font-black uppercase tracking-tighter shadow-2xl shadow-accent/20">
                    Get Started Today <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              )}
              <Link href="/products">
                <Button variant="outline" size="lg" className="h-16 px-10 font-black uppercase tracking-tighter border-2">
                  Browse Materials
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute right-[-10%] top-[10%] w-[50%] aspect-square bg-accent/5 rounded-full blur-3xl -z-10" />
        <div className="absolute left-[-10%] bottom-[10%] w-[30%] aspect-square bg-secondary/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                title: "Premium Materials", 
                desc: "Sourced directly from verified manufacturers like Ghacem and Dangote.", 
                icon: Package,
                color: "bg-blue-500"
              },
              { 
                title: "Hybrid Payments", 
                desc: "Pay online via Paystack or generate a ticket for in-store physical payments.", 
                icon: ShieldCheck,
                color: "bg-accent"
              },
              { 
                title: "Fast Logistics", 
                desc: "Track your construction materials from our warehouse to your site in real-time.", 
                icon: Truck,
                color: "bg-secondary"
              }
            ].map((f, i) => (
              <div key={i} className="group p-10 bg-white rounded-[40px] shadow-xl hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-accent/20">
                <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg group-hover:rotate-12 transition-transform`}>
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-heading font-black uppercase tracking-tighter text-secondary mb-4">{f.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed italic">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center space-y-12">
          <div className="flex flex-wrap justify-center gap-20">
            {[
              { label: "Products", value: "500+" },
              { label: "Tradespeople", value: "120+" },
              { label: "Regions", value: "16" },
              { label: "Trust Score", value: "99%" },
            ].map((s, i) => (
              <div key={i} className="space-y-2">
                <p className="text-5xl font-heading font-black text-secondary tracking-tighter">{s.value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-accent">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
