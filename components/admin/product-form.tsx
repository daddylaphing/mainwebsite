"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase/client";
import type { Product } from "@/types";

interface ProductFormProps {
  initialProduct?: Product;
}

export function ProductForm({ initialProduct }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!initialProduct;

  const [name, setName] = useState(initialProduct?.name || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [shortDescription, setShortDescription] = useState(initialProduct?.short_description || "");
  const [price, setPrice] = useState(initialProduct?.price || 0);
  const [salePrice, setSalePrice] = useState<number | "">(initialProduct?.sale_price || "");
  const [bulkPrice, setBulkPrice] = useState<number | "">(initialProduct?.bulk_price || "");
  const [inventory, setInventory] = useState(initialProduct?.inventory || 0);
  const [lowStockThreshold, setLowStockThreshold] = useState(initialProduct?.low_stock_threshold || 10);
  const [category, setCategory] = useState(initialProduct?.category || "general");
  const [minimumQuantity, setMinimumQuantity] = useState(initialProduct?.minimum_quantity || 1);
  const [active, setActive] = useState(initialProduct?.active !== false);
  const [featured, setFeatured] = useState(!!initialProduct?.featured);
  const [recipeAvailable, setRecipeAvailable] = useState(!!initialProduct?.recipe_available);

  // Array states
  const [images, setImages] = useState<string[]>(initialProduct?.images || []);
  const [newImage, setNewImage] = useState("");
  const [ingredients, setIngredients] = useState<string[]>(initialProduct?.ingredients || []);
  const [newIngredient, setNewIngredient] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSlug = () => {
    const s = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setSlug(s);
  };

  const addImage = () => {
    if (newImage && !images.includes(newImage)) {
      setImages([...images, newImage]);
      setNewImage("");
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addIngredient = () => {
    if (newIngredient && !ingredients.includes(newIngredient)) {
      setIngredients([...ingredients, newIngredient]);
      setNewIngredient("");
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createBrowserClient();

    const payload = {
      name,
      slug,
      description,
      short_description: shortDescription,
      price: Number(price),
      sale_price: salePrice === "" ? null : Number(salePrice),
      bulk_price: bulkPrice === "" ? null : Number(bulkPrice),
      inventory: Number(inventory),
      low_stock_threshold: Number(lowStockThreshold),
      category,
      minimum_quantity: Number(minimumQuantity),
      active,
      featured,
      recipe_available: recipeAvailable,
      images,
      ingredients,
      updated_at: new Date().toISOString(),
    };

    let responseError;

    if (isEdit && initialProduct) {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", initialProduct.id);
      responseError = error;
    } else {
      const { error } = await supabase
        .from("products")
        .insert([payload]);
      responseError = error;
    }

    if (responseError) {
      setError(responseError.message);
      setLoading(false);
    } else {
      router.push("/admin/products");
      router.refresh();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back link */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="flex items-center gap-2 text-sm text-[#7A7570] hover:text-[#1A1A1A] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
      </div>

      <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 md:p-8 shadow-sm">
        <h2
          className="text-2xl font-bold text-[#1A1A1A] mb-8 border-b border-[#E6DFD5]/40 pb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {isEdit ? "Edit Product Details" : "Create New Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Authentic Spicy Laphing"
                className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25] transition-colors"
              />
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider flex items-center justify-between">
                <span>URL Slug *</span>
                <button
                  type="button"
                  onClick={generateSlug}
                  className="text-[10px] text-[#6E1D25] hover:underline font-bold"
                >
                  Generate Slug
                </button>
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. authentic-spicy-laphing"
                className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25] transition-colors"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25] transition-colors"
              >
                <option value="general">General</option>
                <option value="kit">Laphing Kit</option>
                <option value="wholesale">Wholesale</option>
                <option value="corndog">Corn Dog</option>
                <option value="addon">Addon / Extra Side</option>
              </select>
            </div>

            {/* Inventory */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
                Stock / Inventory Quantity *
              </label>
              <input
                type="number"
                required
                min="0"
                value={inventory}
                onChange={(e) => setInventory(Number(e.target.value))}
                className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25] transition-colors"
              />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
                Regular Price (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25] transition-colors"
              />
            </div>

            {/* Sale Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
                Sale Price (₹) (Optional)
              </label>
              <input
                type="number"
                min="0"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value === "" ? "" : Number(e.target.value))}
                className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25] transition-colors"
              />
            </div>

            {/* Bulk Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
                Bulk / Wholesale Price (₹) (Optional)
              </label>
              <input
                type="number"
                min="0"
                value={bulkPrice}
                onChange={(e) => setBulkPrice(e.target.value === "" ? "" : Number(e.target.value))}
                className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25] transition-colors"
              />
            </div>

            {/* Min Quantity */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
                Minimum Purchase Quantity
              </label>
              <input
                type="number"
                required
                min="1"
                value={minimumQuantity}
                onChange={(e) => setMinimumQuantity(Number(e.target.value))}
                className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25] transition-colors"
              />
            </div>

            {/* Low stock threshold */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
                Low Stock Threshold Alert
              </label>
              <input
                type="number"
                required
                min="1"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25] transition-colors"
              />
            </div>

            {/* Empty block for grid alignment */}
            <div className="hidden md:block"></div>

            {/* Checkbox triggers */}
            <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded border-[#E6DFD5] text-[#6E1D25] focus:ring-[#6E1D25]"
                />
                <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Active Status</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-[#E6DFD5] text-[#6E1D25] focus:ring-[#6E1D25]"
                />
                <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Featured</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recipeAvailable}
                  onChange={(e) => setRecipeAvailable(e.target.checked)}
                  className="rounded border-[#E6DFD5] text-[#6E1D25] focus:ring-[#6E1D25]"
                />
                <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Recipe Guide</span>
              </label>
            </div>
          </div>

          {/* Short Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
              Short Summary Description (for listings)
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="e.g. Delicious hot cold laphing kit with authentic spices"
              className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25] transition-colors"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
              Detailed Description (supports Markdown formatting)
            </label>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="# Fresh Laphing Sheet..."
              className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25] transition-colors resize-y"
            />
          </div>

          {/* Image URLs Manager */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider block">
              Product Images (URLs)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="https://example.com/image.png"
                className="flex-1 bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25] transition-colors"
              />
              <button
                type="button"
                onClick={addImage}
                className="bg-[#F7F3EC] border border-[#E6DFD5] hover:bg-[#E6DFD5]/40 text-[#1A1A1A] px-4 rounded-xl text-xs font-bold uppercase transition-all"
              >
                Add Image
              </button>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-video rounded-xl bg-[#FAFAF8] border border-[#E6DFD5] overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ingredients list */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider block">
              Ingredients
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="e.g. Organic Wheat Flour"
                className="flex-1 bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25] transition-colors"
              />
              <button
                type="button"
                onClick={addIngredient}
                className="bg-[#F7F3EC] border border-[#E6DFD5] hover:bg-[#E6DFD5]/40 text-[#1A1A1A] px-4 rounded-xl text-xs font-bold uppercase transition-all"
              >
                Add
              </button>
            </div>
            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-[#F7F3EC] border border-[#E6DFD5] px-3 py-1 rounded-full text-xs text-[#1A1A1A] font-semibold"
                  >
                    {ing}
                    <button
                      type="button"
                      onClick={() => removeIngredient(i)}
                      className="text-[#7A7570] hover:text-[#6E1D25]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Save/Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6DFD5]/40">
            <Link
              href="/admin/products"
              className="px-6 py-3.5 border border-[#E6DFD5] bg-white text-[#7A7570] hover:text-[#1A1A1A] hover:bg-[#F7F3EC] rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#6E1D25] text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition-colors disabled:opacity-60 shadow-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                isEdit ? "Update Product" : "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
