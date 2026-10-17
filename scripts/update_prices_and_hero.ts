import { prisma } from '../src/lib/prisma';

async function updatePrices() {
  console.log('Updating product prices in PostgreSQL database...');

  // 1. Perch Wall Clock - DUBBEL -> Rs. 999
  const perch = await prisma.product.updateMany({
    where: {
      OR: [
        { slug: 'perch-wall-clock-dubbel' },
        { title: { contains: 'Perch Wall Clock', mode: 'insensitive' } },
      ],
    },
    data: {
      priceMinor: 99900, // Rs. 999
      badge: '75% OFF',
    },
  });
  console.log(`Updated Perch Wall Clock: ${perch.count} records`);

  // 2. GTA Money Sign Floating -> Rs. 1399
  const gta = await prisma.product.updateMany({
    where: {
      OR: [
        { slug: 'levitating-money-stack-lamp-magnetic-floating-rgb-ambient-led-light' },
        { title: { contains: 'GTA Money', mode: 'insensitive' } },
      ],
    },
    data: {
      priceMinor: 139900, // Rs. 1,399
    },
  });
  console.log(`Updated GTA Money Sign: ${gta.count} records`);

  // 3. Marvel Iron Man Arc Reactor -> Rs. 1799
  const arc = await prisma.product.updateMany({
    where: {
      OR: [
        { slug: 'marvel-iron-man-arc-reactor-wireless-charger' },
        { title: { contains: 'Arc Reactor', mode: 'insensitive' } },
      ],
    },
    data: {
      priceMinor: 179900, // Rs. 1,799
    },
  });
  console.log(`Updated Marvel Iron Man Arc Reactor: ${arc.count} records`);

  // Verify the updated products
  const verified = await prisma.product.findMany({
    where: {
      OR: [
        { title: { contains: 'Perch Wall Clock', mode: 'insensitive' } },
        { title: { contains: 'GTA Money', mode: 'insensitive' } },
        { title: { contains: 'Arc Reactor', mode: 'insensitive' } },
      ],
    },
    select: {
      title: true,
      priceMinor: true,
      slug: true,
    },
  });

  console.log('\nVerified Current Database Prices:');
  verified.forEach((p) => {
    console.log(`- ${p.title}: Rs. ${p.priceMinor / 100} (slug: ${p.slug})`);
  });
}

updatePrices()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
