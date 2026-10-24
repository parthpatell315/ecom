import { notFound } from 'next/navigation';
import { getCachedProductBySlug, getCachedRelatedProducts } from '@/lib/catalog';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';
import type { Metadata } from 'next';

// Revalidate every 60 seconds (ISR Edge Caching)
export const revalidate = 60;

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const product = await getCachedProductBySlug(slug);

    if (!product) return { title: 'Product Not Found | flirta.network' };

    return {
      title: `${product.title} | flirta.network`,
      description: product.subtitle || product.description?.substring(0, 150),
    };
  } catch (error) {
    console.error('generateMetadata error:', error);
    return { title: 'flirta.network — Precision 3D Printed Studio' };
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  try {
    const { slug } = await params;
    const product = await getCachedProductBySlug(slug);

    if (!product) {
      notFound();
    }

    const relatedProducts = await getCachedRelatedProducts(product.categoryId, product.id, 4);

    return (
      <ProductDetailClient
        product={JSON.parse(JSON.stringify(product))}
        relatedProducts={JSON.parse(JSON.stringify(relatedProducts))}
      />
    );
  } catch (error) {
    console.error('ProductDetailPage error:', error);
    notFound();
  }
}

