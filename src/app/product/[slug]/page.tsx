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

    const canonicalUrl = `https://www.flirta.network/product/${slug}`;
    const primaryImage = product.images?.[0]?.url || 'https://www.flirta.network/images/hero-arc.webp';
    const pageDescription =
      product.subtitle ||
      product.description?.replace(/<[^>]*>?/gm, '').substring(0, 160) ||
      'Precision 3D Printed Studio ambient lighting handcrafted in India with 0.12mm precision.';

    return {
      title: `${product.title} | flirta.network`,
      description: pageDescription,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${product.title} | flirta.network`,
        description: pageDescription,
        url: canonicalUrl,
        siteName: 'flirta.network',
        locale: 'en_IN',
        type: 'website',
        images: [
          {
            url: primaryImage,
            width: 1200,
            height: 800,
            alt: product.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.title} | flirta.network`,
        description: pageDescription,
        images: [primaryImage],
      },
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

