"use client";

import { useCartStore } from "@/store/cartStore";
import { toast } from "react-hot-toast";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
  className?: string;
}

export const AddToCartButton = ({ product, className }: AddToCartButtonProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        maxStock: product.stock,
      },
      1
    );
    toast.success("Added to cart!");
  };

  return (
    <button 
      onClick={handleAddToCart}
      className={className || "w-full py-3 bg-slate-900 text-white font-bold text-sm rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"}
    >
      <ShoppingCart className="w-4 h-4" />
      Add to Cart
    </button>
  );
};
