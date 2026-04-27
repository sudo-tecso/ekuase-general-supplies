"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { ColumnDef } from "@tanstack/react-table";
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff,
  Package
} from "lucide-react";
import { toast } from "react-hot-toast";

import { DataTable } from "@/components/admin/DataTable";
import { ProductModal } from "@/components/admin/ProductModal";
import { ConfirmationDialog } from "@/components/admin/ConfirmationDialog";
import { cn } from "@/lib/utils";

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Products
  const { data, isLoading } = useQuery("admin-products", async () => {
    const res = await axios.get("/api/admin/products");
    return res.data;
  });

  // Fetch Categories
  const { data: categoriesData } = useQuery("admin-categories", async () => {
    const res = await axios.get("/api/admin/categories");
    return res.data;
  });

  const categories = categoriesData || [];
  const products = data?.products || [];

  const deleteMutation = useMutation(
    async (id: string) => {
      await axios.delete(`/api/admin/products/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("admin-products");
        toast.success("Product deleted successfully");
        setIsDeleteDialogOpen(false);
      },
      onError: () => {
        toast.error("Failed to delete product");
      },
      onSettled: () => {
        setIsDeleting(false);
      }
    }
  );

  const toggleActiveMutation = useMutation(
    async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await axios.patch(`/api/admin/products/${id}`, { isActive });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("admin-products");
        toast.success("Product status updated");
      }
    }
  );

  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
          className="w-4 h-4 rounded text-accent focus:ring-accent"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(!!e.target.checked)}
          className="w-4 h-4 rounded text-accent focus:ring-accent"
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "images",
      header: "Image",
      cell: ({ row }) => {
        const image = row.original.images?.[0];
        return (
          <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden border">
            {image ? (
              <img src={image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-5 h-5 text-muted-foreground/40" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => <span className="font-black text-[11px]">{row.original.sku}</span>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm truncate max-w-[200px]">{row.original.name}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
            {row.original.Category?.name || "Uncategorized"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price (GHS)",
      cell: ({ row }) => <span className="font-black text-secondary">₵{parseFloat(row.original.price).toFixed(2)}</span>,
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.original.stock;
        let status = "In Stock";
        let color = "bg-green-500/10 text-green-600";
        
        if (stock === 0) {
          status = "Out of Stock";
          color = "bg-destructive/10 text-destructive";
        } else if (stock < 10) {
          status = "Low Stock";
          color = "bg-orange-500/10 text-orange-600";
        }

        return (
          <div className="flex flex-col gap-1">
            <span className="font-black text-sm">{stock}</span>
            <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full w-fit", color)}>
              {status}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <span className={cn(
          "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
          row.original.isActive ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
        )}>
          {row.original.isActive ? "Active" : "Hidden"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedProduct(product);
                setIsModalOpen(true);
              }}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-secondary"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleActiveMutation.mutate({ id: product.id, isActive: !product.isActive })}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-secondary"
            >
              {product.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                setSelectedProduct(product);
                setIsDeleteDialogOpen(true);
              }}
              className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-secondary tracking-tight">Inventory Management</h1>
          <p className="text-sm text-muted-foreground font-medium">Manage your products, stock levels, and categories.</p>
        </div>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        searchPlaceholder="Search by name or SKU..."
        bulkActions={[
          {
            label: "Deactivate",
            icon: <EyeOff className="w-3 h-3" />,
            action: (rows) => {
              toast.success(`Deactivating ${rows.length} products...`);
              // Bulk logic here
            }
          },
          {
            label: "Delete",
            icon: <Trash2 className="w-3 h-3" />,
            variant: "destructive",
            action: (rows) => {
              setIsDeleteDialogOpen(true);
              // Set selected to first for display? Or handle bulk
            }
          }
        ]}
      />

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedProduct}
        categories={categories}
        onSuccess={() => queryClient.invalidateQueries("admin-products")}
      />

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          setIsDeleting(true);
          deleteMutation.mutate(selectedProduct.id);
        }}
        title="Delete Product"
        description={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
