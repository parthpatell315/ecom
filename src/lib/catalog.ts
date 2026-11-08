import { prisma } from '@/lib/prisma';

export interface CachedVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  colorHex: string;
  colorName: string;
  image: string;
  priceAdjustmentMinor: number;
  stockCount: number;
  inStock: boolean;
}

export interface CachedImage {
  id: string;
  productId: string;
  url: string;
  altText: string | null;
  displayOrder: number;
  isPrimary: boolean;
}

export interface CachedCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  displayOrder: number;
  productCount?: number;
}

export interface CachedProduct {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  tagline: string;
  description: string;
  priceMinor: number;
  originalPriceMinor: number | null;
  costMinor: number;
  sku: string;
  barcode: string | null;
  inStock: boolean;
  stockCount: number;
  isFeatured: boolean;
  badge: string | null;
  rating: number;
  reviewCount: number;
  specs: any;
  features: string[];
  dimensions: string | null;
  weightGrams: number | null;
  material: string | null;
  categoryId: string;
  category: CachedCategory;
  images: CachedImage[];
  variants: CachedVariant[];
  reviews?: any[];
  createdAt: Date;
  updatedAt: Date;
}

export const ACTIVE_PRODUCT_SLUGS = [
  'iron-hero-mk5-black-edition-wearable-helmet',
  'magnetic-levitation-f1-racing-car',
  'core-reactor-desk-light',
  'levitating-money-stack-lamp-magnetic-floating-rgb-ambient-led-light',
] as const;

// In-Memory Catalog Cache (Shared across warm Vercel/Node instances)
let cachedProducts: CachedProduct[] | null = null;
let cachedCategories: CachedCategory[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

// Mutex to prevent duplicate parallel fetches to Supabase
let pendingFetch: Promise<CachedProduct[]> | null = null;

export async function getCachedProducts(forceRefresh = false): Promise<CachedProduct[]> {
  const now = Date.now();
  if (!forceRefresh && cachedProducts && (now - lastCacheTime) < CACHE_TTL_MS) {
    return cachedProducts;
  }

  if (pendingFetch) {
    return pendingFetch;
  }

  pendingFetch = (async () => {
    try {
      const products = await prisma.product.findMany({
        where: {
          inStock: true,
          slug: {
            in: [...ACTIVE_PRODUCT_SLUGS],
          },
        },
        include: {
          category: true,
          images: {
            orderBy: { displayOrder: 'asc' },
          },
          variants: {
            orderBy: { name: 'asc' },
          },
          reviews: {
            where: { isApproved: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      // Maintain strict user priority order:
      // 1st: magnetic-levitation-f1-racing-car
      // 2nd: core-reactor-desk-light (₹1,499)
      // 3rd: levitating-money-stack-lamp-magnetic-floating-rgb-ambient-led-light
      const sorted = [...products].sort((a, b) => {
        const idxA = ACTIVE_PRODUCT_SLUGS.indexOf(a.slug as any);
        const idxB = ACTIVE_PRODUCT_SLUGS.indexOf(b.slug as any);
        const rankA = idxA === -1 ? 999 : idxA;
        const rankB = idxB === -1 ? 999 : idxB;
        return rankA - rankB;
      });

      if (sorted && sorted.length > 0) {
        cachedProducts = sorted as unknown as CachedProduct[];
        lastCacheTime = Date.now();
      }
      return cachedProducts || [];
    } catch (err) {
      console.error('Failed to refresh cached products from Supabase:', err);
      // Return stale cache if available
      if (cachedProducts) return cachedProducts;
      return [];
    } finally {
      pendingFetch = null;
    }
  })();

  return pendingFetch;
}

export async function getCachedProductBySlug(slug: string): Promise<CachedProduct | null> {
  const products = await getCachedProducts();
  const match = products.find((p) => p.slug === slug);
  if (match) return match;

  // Fallback: If not found in catalog cache, query directly once
  try {
    const single = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { displayOrder: 'asc' } },
        variants: { orderBy: { name: 'asc' } },
        reviews: { where: { isApproved: true }, orderBy: { createdAt: 'desc' } },
      },
    });
    return single as unknown as CachedProduct;
  } catch (err) {
    console.error(`Failed to fetch product by slug ${slug}:`, err);
    return null;
  }
}

export async function getCachedRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 2
): Promise<CachedProduct[]> {
  const products = await getCachedProducts();
  // Return the other signature products
  return products
    .filter((p) => p.id !== excludeId)
    .slice(0, limit);
}

export async function getCachedCategories(): Promise<CachedCategory[]> {
  const now = Date.now();
  if (cachedCategories && (now - lastCacheTime) < CACHE_TTL_MS) {
    return cachedCategories;
  }

  try {
    const categories = await prisma.category.findMany({
      where: {
        products: {
          some: { inStock: true },
        },
      },
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: {
            products: {
              where: { inStock: true },
            },
          },
        },
      },
    });

    cachedCategories = categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      image: c.image,
      displayOrder: c.displayOrder,
      productCount: c._count.products,
    }));

    return cachedCategories;
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    if (cachedCategories) return cachedCategories;
    return [];
  }
}

export async function getFlashSaleProducts(): Promise<CachedProduct[]> {
  const products = await getCachedProducts();
  const flashSlugs = [
    'core-reactor-desk-light',
    'levitating-money-stack-lamp-magnetic-floating-rgb-ambient-led-light',
  ];
  return flashSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is CachedProduct => Boolean(p));
}


