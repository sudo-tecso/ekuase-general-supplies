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
    <div className="group relative bg-card border rounded-xl overflow-hidden hover:border-accent transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl">
      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className={cn(
          "absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md border transition-all",
          isWishlisted 
            ? "bg-accent text-white border-accent" 
            : "bg-white/50 text-primary border-transparent hover:bg-white"
        )}
      >
        <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
      </button>

      <Link href={`/products/${product.sku}`}>
        {/* Image Container */}
        <div className="aspect-square relative overflow-hidden bg-muted">
          <Image
            src={product.images[0] || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
          />
          {outOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 backdrop-blur-[2px]">
              <Badge variant="danger" className="scale-125 font-bold uppercase">Out of Stock</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-secondary">{product.category}</span>
            {lowStock && !outOfStock && (
              <Badge variant="outline" className="text-[9px] text-accent border-accent py-0">Only {product.stock} left</Badge>
            )}
          </div>
          
          <h3 className="font-heading font-bold text-base line-clamp-1 group-hover:text-accent transition-colors">
            {product.name}
          </h3>

          <div className="flex items-end justify-between pt-2">
            <div className="flex flex-col">
              <span className="text-xl font-black text-primary">{formatCurrency(Number(product.price))}</span>
            </div>
            
            <Button
              onClick={handleAddToCart}
              disabled={outOfStock}
              size="sm"
              className="h-10 w-10 p-0 rounded-lg group-hover:bg-accent group-hover:text-white"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};
