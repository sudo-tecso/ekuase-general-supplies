"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Loader2, X } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import axios from "axios";
import { useDebounce } from "@/hooks/useDebounce";

export const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSearch = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const { data } = await axios.get(`/api/products/search?q=${debouncedQuery}`);
        setResults(data.products);
        setIsOpen(true);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    handleSearch();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <form onSubmit={handleSearchSubmit} className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-accent transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search materials, tools, SKUs..."
          className="w-full h-11 pl-10 pr-10 rounded-full bg-muted border-transparent focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all text-sm outline-none"
        />
        {isLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-accent" />}
        {!isLoading && query && (
          <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-secondary hover:text-primary" />
          </button>
        )}
      </form>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white border rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 border-b bg-muted/50">
            <span className="text-[10px] font-black uppercase tracking-widest text-secondary px-2">Top Results</span>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {results.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  router.push(`/products/${product.sku}`);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-4 p-3 hover:bg-muted transition-colors text-left border-b last:border-0"
              >
                <div className="w-12 h-12 relative rounded overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={product.images[0] || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold truncate">{product.name}</h4>
                  <p className="text-xs text-secondary">{formatCurrency(Number(product.price))}</p>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={handleSearchSubmit}
            className="w-full p-3 text-center text-xs font-bold text-accent hover:bg-muted transition-colors border-t"
          >
            Press Enter to see all results
          </button>
        </div>
      )}
    </div>
  );
};
