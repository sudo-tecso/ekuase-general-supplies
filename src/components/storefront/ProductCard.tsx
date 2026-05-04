"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Heart, ShoppingCart, Info } from "lucide-react";
import { formatCurrency, shimmer, toBase64 } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number | any;
    images: string[];
    category: string;
    stock: number;
    sku: string;
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { data: session } = useSession();
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  
  const isWishlisted = isInWishlist(product.id);
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock < 10;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.images[0] || "/placeholder.png",
        maxStock: product.stock,
      },
      1
    );
    toast.success("Added to cart!");
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    await toggleWishlist(product.id, !!session);
    toast.success(isWishlisted ? "Removed from wishlist" : "Saved to wishlist");
  };

  return (
    <div className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-primary transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl">
      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className={cn(
          "absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md border transition-all",
          isWishlisted 
            ? "bg-primary text-background-dark border-primary" 
            : "bg-white/50 text-slate-400 border-transparent hover:bg-white hover:text-red-500"
        )}
      >
        <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
      </button>

      <Link href={`/products/${product.sku}`}>
        {/* Image Container */}
        <div className="aspect-square relative overflow-hidden bg-slate-100">
          <img
            src={product.images[0] || "/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {outOfStock && (
            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center z-10 backdrop-blur-[2px]">
              <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded uppercase tracking-widest">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{product.category}</span>
            {lowStock && !outOfStock && (
              <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">Only {product.stock} left</span>
            )}
          </div>
          
          <h3 className="font-black text-slate-900 text-lg line-clamp-1 uppercase tracking-tight group-hover:text-primary transition-colors leading-tight">
            {product.name}
          </h3>

          <div className="flex items-end justify-between pt-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Logistics Rate</span>
              <span className="text-2xl font-black text-slate-900">{formatCurrency(Number(product.price))}</span>
            </div>
            
            <Button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="h-12 w-12 p-0 rounded-xl bg-slate-900 text-white hover:bg-primary hover:text-background-dark transition-all shadow-lg shadow-slate-900/10 group-hover:scale-110"
            >
              <ShoppingCart className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};
