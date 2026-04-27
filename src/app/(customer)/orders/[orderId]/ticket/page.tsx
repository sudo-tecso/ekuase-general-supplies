"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { Download, Share2, Printer, MapPin, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function TicketPage() {
  const { orderId } = useParams();
  const [data, setData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}/ticket`);
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch ticket");
      }
    };
    fetchTicket();
  }, [orderId]);

  useEffect(() => {
    if (!data) return;
    
    const interval = setInterval(() => {
      const expiry = new Date(data.expiresAt).getTime();
      const now = new Date().getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${h}h ${m}m`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  const downloadPDF = async () => {
    if (!ticketRef.current) return;
    const canvas = await html2canvas(ticketRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`EGS-Ticket-${data.ticketCode}.pdf`);
  };

  const shareWhatsApp = () => {
    const text = `Hi Ekuase General Supplies, here is my order ticket: ${data.ticketCode}. Order Total: ${formatCurrency(data.order.totalAmount)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin w-12 h-12 text-accent" />
    </div>
  );

  return (
    <div className="bg-background min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="flex flex-col items-center text-center mb-12 space-y-4">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
            <Clock className="w-10 h-10 text-accent animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tighter text-secondary">Your Ticket is Ready!</h1>
          <p className="text-muted-foreground font-medium max-w-md">Present this QR code at any Ekuase General Supplies warehouse within the next 48 hours to complete your payment and collect your items.</p>
        </div>

        {/* Ticket Section */}
        <div ref={ticketRef} className="bg-white rounded-[40px] shadow-2xl overflow-hidden border-2 border-accent relative">
          {/* Header */}
          <div className="bg-secondary p-8 text-white flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Ticket ID</p>
              <h2 className="text-3xl font-heading font-black tracking-tighter uppercase">{data.ticketCode}</h2>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Status</p>
              <p className="text-accent font-black uppercase tracking-widest text-xs px-3 py-1 bg-white/10 rounded-full">Valid</p>
            </div>
          </div>

          <div className="p-10 space-y-10 flex flex-col items-center">
            {/* QR Code */}
            <div className="relative w-64 h-64 p-4 bg-white border-4 border-muted rounded-3xl">
              <img src={data.qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
                <span className="text-8xl font-black">EGS</span>
            </div>

            {/* Order Details */}
            <div className="w-full space-y-4 pt-4 border-t border-dashed border-muted">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Order Total Due</span>
                <span className="text-3xl font-heading font-black text-secondary">{formatCurrency(data.order.totalAmount)}</span>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-accent shrink-0" />
                <p className="text-xs text-secondary font-medium leading-relaxed">
                  This ticket is tied to Order <span className="font-bold">#{orderId.slice(-8).toUpperCase()}</span>. 
                  Price guarantee expires in <span className="text-accent font-bold">{timeLeft}</span>.
                </p>
              </div>
            </div>

            {/* Store Locations */}
            <div className="w-full space-y-3 pt-4">
               <div className="flex items-center gap-2 text-secondary">
                 <MapPin className="w-4 h-4 text-accent" />
                 <span className="text-xs font-bold uppercase tracking-widest">Main Pickup Branch: Accra Central</span>
               </div>
            </div>
          </div>

          {/* Perforation Effect */}
          <div className="absolute top-[108px] -left-4 w-8 h-8 rounded-full bg-background border-r-2 border-accent" />
          <div className="absolute top-[108px] -right-4 w-8 h-8 rounded-full bg-background border-l-2 border-accent" />
        </div>

        {/* Action Buttons */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 no-print">
          <Button 
            onClick={downloadPDF}
            variant="outline" 
            size="lg" 
            className="h-16 flex items-center justify-center gap-3 font-black uppercase tracking-tighter"
          >
            <Download className="w-5 h-5" /> Download PDF
          </Button>
          <Button 
            onClick={shareWhatsApp}
            size="lg" 
            className="h-16 flex items-center justify-center gap-3 font-black uppercase tracking-tighter bg-[#25D366] hover:bg-[#128C7E] border-none"
          >
            <Share2 className="w-5 h-5" /> Share WhatsApp
          </Button>
          <Button 
            onClick={() => window.print()}
            variant="outline" 
            size="lg" 
            className="sm:col-span-2 h-14 flex items-center justify-center gap-3 font-bold uppercase tracking-widest opacity-60 hover:opacity-100"
          >
            <Printer className="w-5 h-5" /> Print Ticket
          </Button>
        </div>

        <div className="mt-8 text-center no-print">
           <Link href="/products" className="text-sm font-bold text-accent hover:underline uppercase tracking-widest">
             Continue Shopping
           </Link>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .container { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}
