import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';
import type { Metadata } from 'next';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { title: true, subtitle: true, description: true },
  });

  if (!product) return { title: 'Product Not Found | flirta.network' };

  return {
    title: `${product.title} | flirta.network`,
    description: product.subtitle || product.description?.substring(0, 150),
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
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

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 4,
    include: {
      category: true,
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      variants: {
        take: 1,
      },
    },
  });

  return (
    <ProductDetailClient
      product={JSON.parse(JSON.stringify(product))}
      relatedProducts={JSON.parse(JSON.stringify(relatedProducts))}
    />
  );
}
