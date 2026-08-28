"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CATEGORIES } from "@/lib/catalog";

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

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

  return (
    <form
      onSubmit={applyFilters}
      className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:flex-row sm:items-end sm:gap-4"
      role="search"
      aria-label="Filter products"
    >
      <div className="flex-1">
        <label htmlFor="search-query" className="mb-1 block text-xs font-medium text-neutral-400">
          Search
        </label>
        <input
          id="search-query"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try 'running shoes' or 'jacket'"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
        />
      </div>

      <div>
        <label htmlFor="filter-category" className="mb-1 block text-xs font-medium text-neutral-400">
          Category
        </label>
        <select
          id="filter-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 sm:w-40"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-max-price" className="mb-1 block text-xs font-medium text-neutral-400">
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
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 sm:w-28"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
        >
          Apply
        </button>
        {hasFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 hover:border-neutral-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
          >
            Clear
          </button>
        ) : null}
      </div>
    </form>
  );
}
