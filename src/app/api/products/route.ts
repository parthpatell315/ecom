import { NextRequest, NextResponse } from 'next/server';
import { getCachedProducts, CachedProduct } from '@/lib/catalog';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort'); // 'price-asc' | 'price-desc' | 'rating' | 'featured'
    const featured = searchParams.get('featured');
    const inStockOnly = searchParams.get('inStock') === 'true';
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!, 10) : null;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!, 10) : null;

    const allProducts = await getCachedProducts();
    let filtered: CachedProduct[] = [...allProducts];

    if (category && category !== 'all') {
      filtered = filtered.filter((p) => p.category?.slug === category);
    }

    if (featured === 'true') {
      filtered = filtered.filter((p) => p.isFeatured);
    }

    if (inStockOnly) {
      filtered = filtered.filter((p) => p.inStock);
    }

    if (minPrice !== null && !isNaN(minPrice)) {
      filtered = filtered.filter((p) => p.priceMinor >= minPrice);
    }

    if (maxPrice !== null && !isNaN(maxPrice)) {
      filtered = filtered.filter((p) => p.priceMinor <= maxPrice);
    }

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tagline?.toLowerCase().includes(q)
      );
    }

    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.priceMinor - b.priceMinor);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.priceMinor - a.priceMinor);
    } else if (sort === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'featured') {
      filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return NextResponse.json(
      {
        success: true,
        count: filtered.length,
        products: filtered,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
