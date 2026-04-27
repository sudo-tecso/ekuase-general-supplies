import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductGridSkeleton } from "@/components/storefront/ProductSkeleton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Filter, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Construction Materials | Ekuase General Supplies",
  description: "Browse our extensive catalog of high-quality construction materials.",
};

interface ProductsPageProps {
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
  };
}

async function ProductGrid({ searchParams }: ProductsPageProps) {
  const { category, search, sort, page = "1" } = searchParams;
  const limit = 12;
  const skip = (parseInt(page) - 1) * limit;

  const where = {
    isActive: true,
    ...(category && { category: { equals: category, mode: "insensitive" as any } }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as any } },
        { description: { contains: search, mode: "insensitive" as any } },
      ],
    }),
  };

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip,
    take: limit,
  });

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-secondary">
          <Filter className="w-10 h-10 opacity-20" />
        </div>
        <h3 className="text-2xl font-heading font-black uppercase tracking-tighter">No products found</h3>
        <p className="text-secondary max-w-xs">We couldn't find any products matching your current filters.</p>
        <Link href="/products">
          <Button variant="outline">Clear all filters</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="bg-background pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 space-y-10 shrink-0">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                <SlidersHorizontal className="w-3 h-3" />
                Categories
              </h3>
              <div className="space-y-3">
                <Link 
                  href="/products"
                  className={cn(
                    "flex items-center justify-between group transition-colors",
                    !searchParams.category ? "text-accent font-bold" : "text-secondary hover:text-primary"
                  )}
                >
                  <span className="text-sm">All Products</span>
                </Link>
                {categories.map((cat) => (
                  <Link 
                    key={cat.id}
                    href={`/products?category=${cat.name}`}
                    className={cn(
                      "flex items-center justify-between group transition-colors",
                      searchParams.category === cat.name ? "text-accent font-bold" : "text-secondary hover:text-primary"
                    )}
                  >
                    <span className="text-sm">{cat.name}</span>
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-secondary-foreground font-bold">
                      {cat._count.products}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-6">Sort By</h3>
              <div className="space-y-3">
                {[
                  { label: "Newest", value: "newest" },
                  { label: "Price: Low to High", value: "price_asc" },
                  { label: "Price: High to Low", value: "price_desc" },
                ].map((s) => (
                  <Link 
                    key={s.value}
                    href={`/products?${new URLSearchParams({ ...searchParams, sort: s.value }).toString()}`}
                    className={cn(
                      "block text-sm transition-colors",
                      (searchParams.sort || "newest") === s.value ? "text-accent font-bold" : "text-secondary hover:text-primary"
                    )}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
              <div>
                <h1 className="text-4xl font-heading font-black uppercase tracking-tighter">
                  {searchParams.category || "All Products"}
                </h1>
                {searchParams.search && (
                  <p className="text-sm text-secondary mt-1">
                    Showing results for "<span className="text-primary font-bold">{searchParams.search}</span>"
                  </p>
                )}
              </div>
            </div>

            <Suspense fallback={<ProductGridSkeleton count={9} />}>
              <ProductGrid searchParams={searchParams} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
