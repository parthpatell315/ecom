import { PrismaClient } from '@prisma/client';

function getDatabaseUrl(): string | undefined {
  let url = process.env.DATABASE_URL;
  if (!url) {
    return 'postgresql://postgres.wfvvxyypfavjwkyzxxzi:KlYq5B6aa1gviDwJ@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1';
  }
  // Automatically rewrite direct IPv6 Supabase host to verified IPv4 transaction pooler
  if (url.includes('db.wfvvxyypfavjwkyzxxzi.supabase.co')) {
    url = url
      .replace('db.wfvvxyypfavjwkyzxxzi.supabase.co:5432', 'aws-0-ap-northeast-2.pooler.supabase.com:6543')
      .replace('postgres:', 'postgres.wfvvxyypfavjwkyzxxzi:');
    if (!url.includes('pgbouncer=true')) {
      url += (url.includes('?') ? '&' : '?') + 'pgbouncer=true&connection_limit=1';
    }
  } else if (url.includes('aws-0-ap-northeast-2.pooler.supabase.com:5432')) {
    // Convert session pooler (:5432) to transaction pooler (:6543) to prevent EMAXCONNSESSION
    url = url.replace(':5432', ':6543');
    if (!url.includes('pgbouncer=true')) {
      url += (url.includes('?') ? '&' : '?') + 'pgbouncer=true&connection_limit=1';
    }
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
