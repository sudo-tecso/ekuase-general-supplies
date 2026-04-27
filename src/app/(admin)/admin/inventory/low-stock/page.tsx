"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, Edit3, Loader2, Package, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/shared/Modal";
import { cn } from "@/lib/utils";

export default function LowStockPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch low stock products (we'll filter on client for now, or use a specific API)
  const { data, isLoading } = useQuery("admin-low-stock", async () => {
    const res = await axios.get("/api/admin/products");
    return res.data.products.filter((p: any) => p.stock < 10);
  });

  const updateStockMutation = useMutation(
    async ({ id, stock }: { id: string; stock: number }) => {
      await axios.patch(`/api/admin/products/${id}/stock`, { stock });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("admin-low-stock");
        queryClient.invalidateQueries("admin-products");
        toast.success("Stock updated successfully");
        setIsModalOpen(false);
      },
      onError: () => {
        toast.error("Failed to update stock");
      },
      onSettled: () => {
        setIsUpdating(false);
      }
    }
  );

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => <span className="font-black text-[11px]">{row.original.sku}</span>,
    },
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm">{row.original.name}</span>
          <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
            {row.original.Category?.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "stock",
      header: "Current Stock",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
           <span className={cn(
             "font-black text-sm px-3 py-1 rounded-lg",
             row.original.stock === 0 ? "bg-destructive/10 text-destructive" : "bg-orange-500/10 text-orange-600"
           )}>
             {row.original.stock}
           </span>
           {row.original.stock === 0 && (
             <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />
           )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Quick Action",
      cell: ({ row }) => (
        <button
          onClick={() => {
            setSelectedProduct(row.original);
            setNewStock(row.original.stock + 50); // Suggest adding 50
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary/90 transition-all"
        >
          <RefreshCw className="w-3 h-3" />
          Update Stock
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-secondary tracking-tight">Low Stock Alerts</h1>
          <p className="text-sm text-muted-foreground font-medium">Critical inventory items that need immediate restocking.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-orange-500 rounded-3xl p-8 text-white shadow-lg shadow-orange-500/20 flex items-center justify-between">
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Low Stock Items</p>
              <h2 className="text-4xl font-black mt-2">{data?.filter((p: any) => p.stock > 0).length || 0}</h2>
           </div>
           <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Package className="w-8 h-8" />
           </div>
        </div>

        <div className="bg-destructive rounded-3xl p-8 text-white shadow-lg shadow-destructive/20 flex items-center justify-between">
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Out of Stock</p>
              <h2 className="text-4xl font-black mt-2">{data?.filter((p: any) => p.stock === 0).length || 0}</h2>
           </div>
           <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
           </div>
        </div>

        <div className="bg-white border rounded-3xl p-8 shadow-sm flex flex-col justify-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Alert Threshold</p>
            <div className="flex items-center gap-2 mt-2">
               <h2 className="text-2xl font-black text-secondary">Under 10</h2>
               <button className="text-accent text-[10px] font-black uppercase hover:underline">Change</button>
            </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        searchPlaceholder="Filter items..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Quick Stock Update"
      >
        <div className="space-y-6">
           <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border">
                 <Package className="w-6 h-6 text-secondary/40" />
              </div>
              <div>
                 <p className="text-sm font-bold text-secondary">{selectedProduct?.name}</p>
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{selectedProduct?.sku}</p>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-secondary/60">New Stock Quantity</label>
              <div className="flex items-center gap-4">
                 <input
                   type="number"
                   value={newStock}
                   onChange={(e) => setNewStock(parseInt(e.target.value))}
                   className="flex-1 px-4 py-4 bg-muted/30 border rounded-2xl text-lg font-black focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                 />
                 <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => setNewStock(prev => prev + 10)}
                      className="px-4 py-1.5 bg-muted rounded-lg text-[10px] font-black hover:bg-secondary hover:text-white transition-all"
                    >+10</button>
                    <button 
                      onClick={() => setNewStock(prev => Math.max(0, prev - 10))}
                      className="px-4 py-1.5 bg-muted rounded-lg text-[10px] font-black hover:bg-secondary hover:text-white transition-all"
                    >-10</button>
                 </div>
              </div>
           </div>

           <button
             onClick={() => {
               setIsUpdating(true);
               updateStockMutation.mutate({ id: selectedProduct.id, stock: newStock });
             }}
             disabled={isUpdating}
             className="w-full py-4 bg-accent text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
           >
             {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
             Update Stock Level
           </button>
        </div>
      </Modal>
    </div>
  );
}
