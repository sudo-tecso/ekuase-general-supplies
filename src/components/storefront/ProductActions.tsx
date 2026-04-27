"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useSession } from "next-auth/react";
import { Minus, Plus, Heart, ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
}

export const ProductActions = ({ product }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);
  const { data: session } = useSession();
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(product.id);
  const outOfStock = product.stock === 0;

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        maxStock: product.stock,
      },
      quantity
    );
    toast.success(`${quantity} ${product.name} added to cart`);
  };

  const handleWishlist = async () => {
    await toggleWishlist(product.id, !!session);
    toast.success(isWishlisted ? "Removed from wishlist" : "Saved to wishlist");
  };

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      {!outOfStock && (
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Quantity</label>
          <div className="flex items-center border rounded-xl w-32 h-12 overflow-hidden bg-white">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex-1 h-full hover:bg-muted flex items-center justify-center transition-colors border-r"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="flex-1 text-center font-bold text-lg">{quantity}</span>
            <button 
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="flex-1 h-full hover:bg-muted flex items-center justify-center transition-colors border-l"
              disabled={quantity >= product.stock}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={handleAddToCart}
          disabled={outOfStock}
          size="lg" 
          className="h-14 px-12 text-lg font-black uppercase tracking-tighter flex-1 shadow-lg shadow-accent/20"
        >
          <ShoppingCart className="mr-2 w-5 h-5" />
          Add to Cart
        </Button>
        <Button 
          onClick={handleWishlist}
          variant="outline" 
          size="lg" 
          className={cn(
            "h-14 px-8 flex items-center gap-2 font-bold uppercase tracking-widest transition-all",
            isWishlisted ? "text-accent border-accent bg-accent/5" : ""
          )}
        >
          <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
          {isWishlisted ? "Saved" : "Wishlist"}
        </Button>
      </div>
    </div>
  );
};
