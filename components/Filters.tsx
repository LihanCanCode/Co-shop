"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES } from "@/lib/catalog";

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(
    searchParams.get("category") ?? ""
  );
  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") ?? ""
  );

  function applyFilters(e?: FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.push(params.toString() ? `/?${params.toString()}` : "/");
  }

  function clearFilters() {
    setQuery("");
    setCategory("");
    setMaxPrice("");
    router.push("/");
  }

  const hasFilters = Boolean(query || category || maxPrice);

  const inputClass =
    "w-full rounded-xl px-3 py-2.5 text-sm text-cs-text-primary placeholder:text-cs-text-muted transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-accent/60";
  const inputStyle = {
    background: "rgba(8, 8, 15, 0.7)",
    border: "1px solid var(--cs-border)",
  };

  return (
    <motion.form
      onSubmit={applyFilters}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl p-5"
      style={{
        background: "rgba(24, 24, 40, 0.65)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid var(--cs-border)",
      }}
      role="search"
      aria-label="Filter products"
    >
      {/* Top gradient accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(139,92,246,0.7), rgba(168,85,247,0.5), transparent)",
        }}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4">
        {/* Search */}
        <div className="flex-1">
          <label
            htmlFor="search-query"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-cs-text-muted"
          >
            Search
          </label>
          <div className="relative">
            <svg
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cs-text-muted"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              id="search-query"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try 'running shoes' or 'jacket'"
              className={`${inputClass} pl-9`}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="filter-category"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-cs-text-muted"
          >
            Category
          </label>
          <select
            id="filter-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputClass} sm:w-44 cursor-pointer`}
            style={inputStyle}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Max Price */}
        <div>
          <label
            htmlFor="filter-max-price"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-cs-text-muted"
          >
            Max price
          </label>
          <input
            id="filter-max-price"
            type="number"
            min={0}
            inputMode="numeric"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="$"
            className={`${inputClass} sm:w-28`}
            style={inputStyle}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="btn-gradient rounded-xl px-5 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-accent/60 focus-visible:ring-offset-2"
          >
            Apply
          </motion.button>

          <AnimatePresence>
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={clearFilters}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-cs-text-secondary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-accent/60"
                style={{
                  background: "rgba(139, 92, 246, 0.07)",
                  border: "1px solid var(--cs-border)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(239,68,68,0.4)";
                  (e.currentTarget as HTMLElement).style.color = "#f87171";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--cs-border)";
                  (e.currentTarget as HTMLElement).style.color = "";
                }}
              >
                Clear
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.form>
  );
}
