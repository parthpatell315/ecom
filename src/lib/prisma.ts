import { PrismaClient } from '@prisma/client';

function getDatabaseUrl(): string | undefined {
  let url = process.env.DATABASE_URL;
  if (!url) {
    return 'postgresql://postgres.wfvvxyypfavjwkyzxxzi:KlYq5B6aa1gviDwJ@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres';
  }
  // Automatically rewrite direct IPv6 Supabase host to verified IPv4 pooler
  if (url.includes('db.wfvvxyypfavjwkyzxxzi.supabase.co')) {
    url = url
      .replace('db.wfvvxyypfavjwkyzxxzi.supabase.co:5432', 'aws-0-ap-northeast-2.pooler.supabase.com:5432')
      .replace('postgres:', 'postgres.wfvvxyypfavjwkyzxxzi:');
  }
  return url;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const activeUrl = getDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: activeUrl ? { db: { url: activeUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
