import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

interface WishlistItem {
  productId: string;
}

interface WishlistStore {
  items: WishlistItem[];
  toggleWishlist: (productId: string, isLoggedIn: boolean) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  syncWithDB: () => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isInWishlist: (productId) => get().items.some((i) => i.productId === productId),
      toggleWishlist: async (productId, isLoggedIn) => {
        const isCurrentlyIn = get().isInWishlist(productId);
        
        // Optimistic UI Update
        if (isCurrentlyIn) {
          set({ items: get().items.filter((i) => i.productId !== productId) });
        } else {
          set({ items: [...get().items, { productId }] });
        }

        if (isLoggedIn) {
          try {
            if (isCurrentlyIn) {
              await axios.delete(`/api/wishlist?productId=${productId}`);
            } else {
              await axios.post("/api/wishlist", { productId });
            }
          } catch (error) {
            // Revert on error
            console.error("Wishlist sync failed", error);
            if (isCurrentlyIn) {
              set({ items: [...get().items, { productId }] });
            } else {
              set({ items: get().items.filter((i) => i.productId !== productId) });
            }
          }
        }
      },
      syncWithDB: async () => {
        try {
          const { data } = await axios.get("/api/wishlist");
          set({ items: data.items.map((i: any) => ({ productId: i.productId })) });
        } catch (error) {
          console.error("Failed to fetch wishlist", error);
        }
      },
    }),
    {
      name: "ekuase-gs-wishlist",
    }
  )
);
