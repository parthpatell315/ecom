'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/currency';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/product/ProductCard';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ShoppingBag,
  Zap,
  Clock,
  Layers,
  Box,
  Scale,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { addItem, isLoading: isCartLoading } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product) {
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);
          if (data.product.variants && data.product.variants.length > 0) {
            setSelectedVariant(data.product.variants[0]);
            setSelectedImage(data.product.variants[0].image || data.product.images[0]?.url || '');
          } else if (data.product.images && data.product.images.length > 0) {
            setSelectedImage(data.product.images[0].url);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#D9232D]" />
        <span className="text-xs">Preparing piece specifications...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900">Piece not found</h2>
        <p className="text-xs text-gray-500 mt-2 mb-6">The requested architectural piece is not in the active catalog.</p>
        <Link
          href="/shop"
          className="py-2.5 px-6 rounded-full bg-[#D9232D] text-white text-xs font-bold"
        >
          Return to Collection
        </Link>
      </div>
    );
  }

  const effectivePriceMinor = product.priceMinor + (selectedVariant?.priceAdjustmentMinor || 0);

  const handleAddToCart = async () => {
    const success = await addItem(product.id, selectedVariant?.id, quantity);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  const handleBuyNow = async () => {
    const success = await addItem(product.id, selectedVariant?.id, quantity);
    if (success) {
      router.push('/checkout');
    }
  };

  const specs = typeof product.specs === 'object' ? product.specs : {};
  const savings = product.originalPriceMinor
    ? product.originalPriceMinor - effectivePriceMinor
    : 0;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-gray-500 mb-8 flex items-center gap-1.5">
          <Link href="/" className="hover:text-[#D9232D] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#D9232D] transition-colors">
            Collection
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.category.slug}`}
            className="hover:text-[#D9232D] transition-colors"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{product.title}</span>
        </nav>

        {/* Main Product Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Gallery (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[560px] pb-2 md:pb-0 scrollbar-none flex-shrink-0">
                {product.images.map((img: any, idx: number) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImage(img.url)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border transition-all ${
                      selectedImage === img.url
                        ? 'border-[#D9232D] ring-2 ring-[#D9232D]/30'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img.url} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}

            {/* Primary View */}
            <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-200 shadow-sm">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-all duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
              )}

              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span className="py-1 px-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D9232D] text-white shadow-sm">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Info & Purchase Controls (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="uppercase tracking-widest text-[#D9232D] font-bold">{product.category.name}</span>
                <span className="font-mono text-gray-400">SKU: {selectedVariant?.sku || product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#222225] leading-tight">
                {product.title}
              </h1>

              <p className="text-sm text-gray-600 mt-2 font-normal leading-relaxed">
                {product.subtitle || product.tagline}
              </p>

              {/* Price Tag with Avian-style savings */}
              <div className="mt-5 pb-5 border-b border-gray-200 flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-[#222225]">
                  {formatCurrency(effectivePriceMinor)}
                </span>
                {product.originalPriceMinor && (
                  <span className="text-base text-gray-400 line-through">
                    {formatCurrency(product.originalPriceMinor)}
                  </span>
                )}
                {savings > 0 && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Save {formatCurrency(savings)}
                  </span>
                )}
              </div>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between items-center text-xs mb-3">
                    <span className="font-medium text-[#222225]">
                      Finish & Biopolymer Material
                    </span>
                    <span className="text-gray-500">{selectedVariant?.colorName || selectedVariant?.name}</span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((v: any) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setSelectedVariant(v);
                          if (v.image) setSelectedImage(v.image);
                        }}
                        className={`py-2 px-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
                          selectedVariant?.id === v.id
                            ? 'border-[#D9232D] bg-[#FFF5F6] text-[#D9232D] ring-2 ring-[#D9232D]/20'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-gray-300 inline-block shadow-2xs"
                          style={{ backgroundColor: v.colorHex }}
                        />
                        <span>{v.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Availability */}
              <div className="mt-6 flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-700 font-medium">
                  In Stock & Ready for Studio Dispatch
                </span>
                <span className="text-gray-500">({selectedVariant?.stockCount ?? product.stockCount} batch units available)</span>
              </div>

              {/* Quantity Selector and CTA Actions */}
              <div className="mt-8 space-y-3">
                <div className="flex gap-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-300 rounded-xl px-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-gray-600 hover:text-black"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-medium text-[#222225]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-gray-600 hover:text-black"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag (Vibrant Red) */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isCartLoading}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-[#D9232D] text-white text-sm font-medium hover:bg-[#b91c1c] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        Added to Bag
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        Add to Bag
                      </>
                    )}
                  </button>
                </div>

                {/* Instant Buy Now */}
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 rounded-xl border border-gray-300 bg-[#222225] hover:bg-[#38383D] text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  Buy Now with Express Studio Dispatch
                </button>
              </div>

              {/* Value Guarantees */}
              <div className="mt-8 pt-6 border-t border-gray-200 space-y-2.5 text-xs text-gray-600">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-[#D9232D]" />
                  <span>Complimentary insured express delivery across India</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-[#D9232D]" />
                  <span>Guaranteed safe arrival in acoustic foam packaging</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#D9232D]" />
                  <span>1-Year studio mechanism warranty on all clocks & illumination circuits</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative & Generative Specs Section */}
        <div className="mt-20 pt-12 border-t border-gray-200 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Story */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D9232D] font-bold">Concept & Geometry</span>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-1">
                Design Architecture
              </h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
            {product.story && (
              <div className="p-6 rounded-2xl bg-[#FFF5F6] border border-[#D9232D]/15 text-xs text-gray-700 italic leading-relaxed">
                &ldquo;{product.story}&rdquo;
              </div>
            )}
          </div>

          {/* Technical Specifications */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-[#F9FAFB] border border-gray-200 space-y-4 shadow-2xs">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D9232D]" />
                Additive Craft Specifications
              </h3>

              <div className="space-y-3 text-xs divide-y divide-gray-200 pt-1">
                {specs.material && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D9232D]" /> Material
                    </span>
                    <span className="font-semibold text-gray-800 text-right max-w-[200px]">
                      {specs.material}
                    </span>
                  </div>
                )}
                {specs.printDuration && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D9232D]" /> Print Duration
                    </span>
                    <span className="font-semibold text-gray-800">{specs.printDuration}</span>
                  </div>
                )}
                {specs.layerHeight && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#D9232D]" /> Layer Height
                    </span>
                    <span className="font-semibold text-gray-800">{specs.layerHeight}</span>
                  </div>
                )}
                {specs.dimensions && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Box className="w-3.5 h-3.5 text-[#D9232D]" /> Dimensions
                    </span>
                    <span className="font-semibold text-gray-800">{specs.dimensions}</span>
                  </div>
                )}
                {specs.weight && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-[#D9232D]" /> Net Weight
                    </span>
                    <span className="font-semibold text-gray-800">{specs.weight}</span>
                  </div>
                )}
                {specs.infillDensity && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-gray-500">Internal Infill</span>
                    <span className="font-semibold text-gray-800">{specs.infillDensity}</span>
                  </div>
                )}
                {specs.nozzleDiameter && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-gray-500">Extrusion Nozzle</span>
                    <span className="font-semibold text-gray-800">{specs.nozzleDiameter}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-200">
            <div className="max-w-2xl mb-8">
              <span className="text-xs uppercase tracking-widest text-[#D9232D] font-bold">Collector Reviews</span>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-1">
                Verified Studio Collector Impressions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.reviews.map((rev: any) => (
                <div
                  key={rev.id}
                  className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs"
                >
                  <div className="flex text-amber-500 text-xs mb-2">{'★'.repeat(rev.rating)}</div>
                  <h4 className="text-sm font-bold text-gray-900">&ldquo;{rev.title}&rdquo;</h4>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">{rev.comment}</p>
                  <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex justify-between">
                    <span>{rev.authorName} {rev.city && `• ${rev.city}`}</span>
                    <span className="text-emerald-700 font-semibold">✓ Verified Collector</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-gray-200">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#D9232D] font-bold">Complementary Pieces</span>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-1">
                  You May Also Like
                </h2>
              </div>
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="text-xs font-bold text-[#D9232D] hover:underline"
              >
                More in {product.category.name} →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel: any) => (
                <ProductCard
                  key={rel.id}
                  product={{
                    id: rel.id,
                    slug: rel.slug,
                    title: rel.title,
                    tagline: rel.tagline,
                    priceMinor: rel.priceMinor,
                    originalPriceMinor: rel.originalPriceMinor,
                    badge: rel.badge,
                    inStock: rel.inStock,
                    images: rel.images,
                    variants: rel.variants,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
