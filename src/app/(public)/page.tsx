import { Button } from "@/components/ui/Button";
import { PRODUCT_CATEGORIES } from "@/constants";
import { ArrowRight, Truck, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-primary pt-20">
        {/* Grain Overlay & Background Art */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/10 skew-x-12 transform translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-6xl md:text-8xl font-heading font-black text-white leading-[0.9] tracking-tighter mb-6 uppercase">
              Build Smarter <br />
              <span className="text-accent">Build Faster.</span>
            </h1>
            <p className="text-xl text-secondary-foreground/60 font-sans max-w-xl mb-10 leading-relaxed">
              Ghana's most trusted marketplace for premium construction materials and verified tradespeople. 
              Get what you need, when you need it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="h-14 px-10 text-lg group">
                  Shop Materials
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="h-14 px-10 text-lg border-white text-white hover:bg-white hover:text-primary">
                  Find a Tradesperson
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-white border-y py-12 relative z-20 -mt-10 mx-auto max-w-6xl w-full rounded-xl shadow-2xl">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent/10 rounded-lg text-accent">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg">Fast Delivery</h3>
                <p className="text-sm text-secondary">Same-day delivery across Accra and Kumasi.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent/10 rounded-lg text-accent">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg">Hybrid Checkout</h3>
                <p className="text-sm text-secondary">Pay online or generate a ticket for store pickup.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent/10 rounded-lg text-accent">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg">Verified Pros</h3>
                <p className="text-sm text-secondary">Work with vetted architects, plumbers & more.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-heading font-black uppercase tracking-tighter">Top Categories</h2>
            <div className="h-1 w-20 bg-accent mt-2" />
          </div>
          <Link href="/products" className="text-accent font-bold flex items-center gap-2 hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {PRODUCT_CATEGORIES.slice(0, 6).map((cat) => (
            <Link 
              key={cat} 
              href={`/category/${cat.toLowerCase()}`}
              className="group relative h-64 overflow-hidden rounded-xl bg-card border hover:border-accent transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent z-10" />
              <div className="absolute bottom-6 left-6 z-20">
                <h4 className="text-white font-heading font-bold text-lg group-hover:text-accent transition-colors">{cat}</h4>
                <p className="text-white/60 text-xs uppercase tracking-widest mt-1">Shop Now</p>
              </div>
              {/* Fallback image style */}
              <div className="absolute inset-0 bg-muted group-hover:scale-110 transition-transform duration-700" />
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-accent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter mb-6">
            Ready to start your project?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-10">
            Join thousands of builders and homeowners who trust Ekuase General Supplies for their construction needs.
          </p>
          <Link href="/register">
            <Button size="lg" variant="outline" className="h-14 px-12 border-white text-white hover:bg-white hover:text-accent font-bold">
              Create Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
