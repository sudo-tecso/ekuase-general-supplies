import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductGridSkeleton } from "@/components/storefront/ProductSkeleton";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} Materials | Ekuase General Supplies`,
    description: `Browse our range of ${category.name} materials for your construction projects.`,
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-background pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Hero Banner */}
        <div className="relative h-64 rounded-3xl overflow-hidden mb-16 bg-primary flex items-center justify-center text-center">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent" />
          <div className="relative z-10 space-y-2">
            <h1 className="text-5xl md:text-7xl font-heading font-black uppercase tracking-tighter text-white">
              {category.name}
            </h1>
            <p className="text-white/60 font-bold uppercase tracking-widest text-xs">
              {category._count.products} Products Available
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="py-24 text-center">
            <h3 className="text-2xl font-heading font-black uppercase tracking-tighter text-secondary">No products in this category yet</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
