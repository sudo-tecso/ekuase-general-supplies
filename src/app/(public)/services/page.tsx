import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { User, Phone, MessageSquare, Star, Search, Filter, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Image from "next/image";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: { specialty?: string; search?: string };
}) {
  const providers = await prisma.serviceProvider.findMany({
    where: {
      isVisible: true,
      ...(searchParams.specialty ? { specialty: searchParams.specialty } : {}),
      ...(searchParams.search ? { name: { contains: searchParams.search, mode: "insensitive" } } : {}),
    },
    orderBy: { rating: "desc" },
  });

  const specialties = ["Architect", "Plumber", "Electrician", "Mason", "Painter"];

  return (
    <div className="bg-background min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <p className="text-accent font-black uppercase tracking-[0.3em] text-xs">Ekuase Professionals</p>
            <h1 className="text-5xl md:text-6xl font-heading font-black uppercase tracking-tighter text-secondary leading-none">
              Verified <span className="text-accent">Tradespeople</span>
            </h1>
            <p className="text-muted-foreground font-medium text-lg italic">Connect with the best architects, plumbers, and electricians in the industry. All professionals are background-checked.</p>
          </div>
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-2 px-6 py-3 bg-secondary rounded-2xl text-white shadow-xl">
               <ShieldCheck className="w-5 h-5 text-accent" />
               <span className="text-[10px] font-black uppercase tracking-widest">Ekuase Certified</span>
             </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-[32px] border shadow-2xl">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by name..."
              className="w-full h-16 pl-16 pr-6 rounded-2xl bg-muted/30 border-none focus:ring-2 ring-accent outline-none transition-all font-bold text-secondary"
            />
          </div>
          <div className="w-full md:w-64 relative">
             <Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
             <select className="w-full h-16 pl-16 pr-6 rounded-2xl bg-muted/30 border-none focus:ring-2 ring-accent outline-none appearance-none font-bold text-secondary uppercase tracking-widest text-xs">
               <option value="">All Specialties</option>
               {specialties.map(s => <option key={s} value={s}>{s}</option>)}
             </select>
          </div>
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {providers.map((provider) => (
            <Card key={provider.id} className="group overflow-hidden border-none shadow-2xl rounded-[40px] bg-white transition-all duration-500 hover:-translate-y-2">
              <div className="p-10 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 rounded-[32px] overflow-hidden border-4 border-muted group-hover:border-accent transition-colors">
                    <Image 
                      src={provider.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider.name}`} 
                      alt={provider.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-heading font-black uppercase tracking-tighter text-secondary">{provider.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-accent/10 text-accent rounded-full">
                        {provider.specialty}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-black">{Number(provider.rating).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground font-medium leading-relaxed italic line-clamp-3">
                  "{provider.bio}"
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <Button asChild className="h-14 font-black uppercase tracking-tighter shadow-lg shadow-accent/20">
                    <a href={`https://wa.me/${provider.phone}`} target="_blank">
                      <MessageSquare className="w-4 h-4 mr-2" /> WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="secondary" className="h-14 font-black uppercase tracking-tighter">
                    <a href={`tel:${provider.phone}`}>
                      <Phone className="w-4 h-4 mr-2" /> Call Now
                    </a>
                  </Button>
                </div>
              </div>
              
              <div className="bg-muted/30 px-10 py-4 border-t flex items-center justify-between">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Certified Since 2024</p>
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-accent/20" />
                   ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
