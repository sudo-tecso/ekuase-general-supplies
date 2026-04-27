import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, cn, shimmer, toBase64 } from "@/lib/utils";
import { ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductActions } from "@/components/storefront/ProductActions";
import { Metadata } from "next";

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { sku: true },
    take: 100,
  });

  return products.map((product) => ({
    slug: product.sku,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { sku: params.slug },
  });

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Ekuase General Supplies`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { sku: params.slug },
    include: {
      Category: true,
    },
  });

  if (!product) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 4,
  });

  return (
    <div className="bg-background pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary mb-12">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/products?category=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-2xl overflow-hidden bg-muted border">
              <Image
                src={product.images[0] || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover"
                priority
                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <div key={i} className={cn(
                  "aspect-square relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all",
                  i === 0 ? "border-accent" : "border-transparent hover:border-muted-foreground"
                )}>
                  <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="uppercase tracking-widest text-[10px] font-black">{product.category}</Badge>
                <span className="text-xs text-secondary font-bold uppercase tracking-widest">SKU: {product.sku}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tighter leading-none">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-accent">{formatCurrency(Number(product.price))}</span>
                {product.stock > 0 ? (
                  <Badge variant="success" className="uppercase font-bold">In Stock</Badge>
                ) : (
                  <Badge variant="danger" className="uppercase font-bold">Out of Stock</Badge>
                )}
              </div>
            </div>

            <p className="text-secondary leading-relaxed max-w-xl">
              {product.description}
            </p>

            <ProductActions 
              product={{
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: product.images[0] || "/placeholder.png",
                stock: product.stock,
              }} 
            />

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-6 h-6 text-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="w-6 h-6 text-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest">Genuine Quality</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw className="w-6 h-6 text-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-24">
          <div className="border-b flex gap-12 mb-8 overflow-x-auto">
            <button className="pb-4 border-b-2 border-accent text-sm font-black uppercase tracking-widest">Description</button>
            <button className="pb-4 border-b-2 border-transparent text-sm font-bold uppercase tracking-widest text-secondary hover:text-primary">Specifications</button>
            <button className="pb-4 border-b-2 border-transparent text-sm font-bold uppercase tracking-widest text-secondary hover:text-primary">Reviews</button>
          </div>
          <div className="max-w-3xl">
            <p className="text-secondary leading-relaxed">
              {product.description}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-heading font-black uppercase tracking-tighter mb-12">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
