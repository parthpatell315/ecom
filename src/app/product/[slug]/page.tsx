import { notFound } from 'next/navigation';
import { getCachedProductBySlug, getCachedRelatedProducts } from '@/lib/catalog';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';
import { LEVITATING_LAMP_FAQS, GENERAL_STORE_FAQS } from '@/data/faq';
import { SALE_CONFIG, isSaleActive } from '@/config/sale';
import reviewsData from '@/data/reviews.json';
import type { Metadata } from 'next';

export const revalidate = 60;

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

function cleanPlainText(text: string): string {
  return text
    .replace(/<[^>]*>?/gm, '')
    // Remove emojis and special symbol characters
    .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const product = await getCachedProductBySlug(slug);

    if (!product) return { title: 'Product Not Found | flirta.network' };

    const canonicalUrl = `https://www.flirta.network/product/${slug}`;
    const primaryImage = product.images?.[0]?.url || 'https://www.flirta.network/images/hero-arc.webp';

    // Per-page title <= 60 chars, no emoji
    const cleanTitle = cleanPlainText(product.title);
    const titleSuffix = ' | flirta';
    const maxTitleLength = 60 - titleSuffix.length;
    const truncatedTitle = cleanTitle.length > maxTitleLength
      ? cleanTitle.substring(0, maxTitleLength - 3) + '...'
      : cleanTitle;
    const seoTitle = `${truncatedTitle}${titleSuffix}`;

    // Meta description between 140 and 160 characters, no emoji
    let rawDescription = cleanPlainText(product.subtitle || product.description || product.tagline || '');
    if (rawDescription.length < 140) {
      rawDescription = `${rawDescription}. Designed with precision engineering for modern ambient workspaces with free insured delivery across India.`;
    }
    const seoDescription = cleanPlainText(rawDescription).substring(0, 158);

    return {
      title: seoTitle,
      description: seoDescription,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        url: canonicalUrl,
        siteName: 'flirta.network',
        locale: 'en_IN',
        type: 'website',
        images: [
          {
            url: primaryImage,
            width: 1200,
            height: 800,
            alt: cleanTitle,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDescription,
        images: [primaryImage],
      },
    };
  } catch (error) {
    console.error('generateMetadata error:', error);
    return { title: 'Studio Ambient Lighting | flirta.network' };
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

    const canonicalUrl = `https://www.flirta.network/product/${slug}`;
    const imagesList = product.images?.map((img: any) => img.url) || [];
    const isLevitatingLamp = product.slug?.includes('levitat');
    const faqList = isLevitatingLamp ? LEVITATING_LAMP_FAQS : GENERAL_STORE_FAQS;

    // Real reviews check for aggregateRating schema
    const rawReviews = Array.isArray(product.reviews) && product.reviews.length > 0
      ? product.reviews
      : Array.isArray(reviewsData)
      ? reviewsData
      : [];
    const hasRealReviews = rawReviews.length >= 5;

    // 1. Product JSON-LD Structured Data
    const productSchema: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: cleanPlainText(product.title),
      image: imagesList,
      description: cleanPlainText(product.subtitle || product.description || product.title),
      sku: product.sku || slug,
      brand: {
        '@type': 'Brand',
        name: 'flirta.network',
      },
      offers: {
        '@type': 'Offer',
        price: (product.priceMinor / 100).toFixed(2),
        priceCurrency: 'INR',
        availability: product.inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        url: canonicalUrl,
        ...(SALE_CONFIG.SALE_END_DATE && isSaleActive(SALE_CONFIG.SALE_END_DATE)
          ? { priceValidUntil: SALE_CONFIG.SALE_END_DATE }
          : {}),
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '0',
            currency: 'INR',
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'IN',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            businessDays: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 3,
              maxValue: 5,
              unitCode: 'd',
            },
          },
        },
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'IN',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
          merchantReturnDays: 7,
          returnMethod: 'https://schema.org/ReturnByMail',
          returnFees: 'https://schema.org/FreeReturn',
        },
      },
    };

    // Only add aggregateRating if >= 5 verified reviews exist
    if (hasRealReviews) {
      const avgRating = product.rating || 5.0;
      productSchema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toString(),
        reviewCount: rawReviews.length.toString(),
      };
    }

    // 2. BreadcrumbList JSON-LD
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.flirta.network',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Shop',
          item: 'https://www.flirta.network/shop',
        },
        ...(product.category
          ? [
              {
                '@type': 'ListItem',
                position: 3,
                name: product.category.name,
                item: `https://www.flirta.network/shop?category=${product.category.slug}`,
              },
              {
                '@type': 'ListItem',
                position: 4,
                name: product.title,
                item: canonicalUrl,
              },
            ]
          : [
              {
                '@type': 'ListItem',
                position: 3,
                name: product.title,
                item: canonicalUrl,
              },
            ]),
      ],
    };

    // 3. FAQPage JSON-LD
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqList.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };

    return (
      <>
        {/* Structured Data: Product, Breadcrumbs, FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        <ProductDetailClient
          product={JSON.parse(JSON.stringify(product))}
          relatedProducts={JSON.parse(JSON.stringify(relatedProducts))}
        />
      </>
    );
  } catch (error) {
    console.error('ProductDetailPage error:', error);
    notFound();
  }
}
