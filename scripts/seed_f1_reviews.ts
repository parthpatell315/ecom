import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const F1_SLUG = 'magnetic-levitation-f1-racing-car';

const REVIEWS = [
  {
    authorName: 'Vikramaditya Sengupta',
    city: 'Bengaluru, Karnataka',
    rating: 5,
    title: 'The magnetic levitation is pure magic',
    comment: 'Took less than 30 seconds to balance it using the guide tool. Once floating, it rotates continuously without stopping. The build quality of both the carbon-black base and the aerodynamic car chassis is remarkable. Absolute showstopper on my desk.',
    createdAt: new Date('2026-10-18T10:30:00Z'),
  },
  {
    authorName: 'Aarav Patel',
    city: 'Mumbai, Maharashtra',
    rating: 5,
    title: 'Every single person in my office stopped to stare',
    comment: 'I placed this on my studio reception desk. People literally do a double take. It floats with zero contact and spins silently 24/7. Packaging was super secure with thick custom foam.',
    createdAt: new Date('2026-10-20T14:15:00Z'),
  },
  {
    authorName: 'Karan Malhotra',
    city: 'Delhi NCR',
    rating: 5,
    title: 'Phenomenal engineering and zero motor noise',
    comment: 'I was worried there might be a buzzing sound from the electromagnets, but it is 100% dead silent. The base stays cool to the touch even after being plugged in for 4 days straight. Worth every rupee.',
    createdAt: new Date('2026-10-22T09:45:00Z'),
  },
  {
    authorName: 'Pooja Hegde',
    city: 'Hyderabad, Telangana',
    rating: 5,
    title: 'Ordered this as an anniversary gift for my husband',
    comment: 'He is a hardcore motorsport and racing fan. When he saw it floating in mid-air, he was completely blown away. The matte finish and aerodynamic detailing look very high-end.',
    createdAt: new Date('2026-10-23T16:20:00Z'),
  },
  {
    authorName: 'Aditya Nair',
    city: 'Pune, Maharashtra',
    rating: 5,
    title: 'Super quick delivery to Pune and flawless finish',
    comment: 'Delivered in 3 days. The levitation mechanism is very stable. Even if someone accidentally bumps the table, it wobbles slightly but doesn\'t drop. Excellent customer support too.',
    createdAt: new Date('2026-10-25T11:00:00Z'),
  },
  {
    authorName: 'Siddharth Rao',
    city: 'Chennai, Tamil Nadu',
    rating: 4,
    title: 'Took a couple tries to balance, but looks unbelievable',
    comment: 'First time balancing a levitating object takes a few tries until you feel the magnetic sweet spot with both hands. Once you get the feel, it locks into place instantly. Looks futuristic on my dark wood setup.',
    createdAt: new Date('2026-10-26T18:10:00Z'),
  },
  {
    authorName: 'Sneha Mukherjee',
    city: 'Kolkata, West Bengal',
    rating: 5,
    title: 'Much higher quality than typical online gadgets',
    comment: 'Usually these novelty items feel plasticky, but this has substantial weight. The base has non-slip silicone feet and the magnetic field is very strong. Highly recommended.',
    createdAt: new Date('2026-10-27T13:40:00Z'),
  },
  {
    authorName: 'Rishabh Jain',
    city: 'Jaipur, Rajasthan',
    rating: 5,
    title: 'Best desk centerpiece I\'ve ever owned',
    comment: 'The subtle ambient glow from the base ring at night combined with the floating car model looks out of this world. Looks like something straight out of a design museum.',
    createdAt: new Date('2026-10-28T15:25:00Z'),
  },
  {
    authorName: 'Manish Chawla',
    city: 'Gurugram, Haryana',
    rating: 5,
    title: 'Prepaid UPI discount was great, smooth dispatch',
    comment: 'Got the ₹300 instant discount and order confirmation arrived on WhatsApp instantly. Delivery was fast. The product itself exceeded my expectations.',
    createdAt: new Date('2026-10-29T10:15:00Z'),
  },
  {
    authorName: 'Varun Sharma',
    city: 'Chandigarh',
    rating: 5,
    title: 'True 360 degree floating — unbelievable physics',
    comment: 'Giving it a gentle tap gives it a frictionless spin that lasts for hours. Premium studio packaging made unboxing feel like a top-tier product.',
    createdAt: new Date('2026-10-30T17:05:00Z'),
  },
  {
    authorName: 'Ananya Deshmukh',
    city: 'Navi Mumbai, Maharashtra',
    rating: 5,
    title: 'Stunning aesthetic for tech & racing lovers',
    comment: 'The level of precision on the suspension arms and front wing is insane. It floats about 20mm above the magnetic platform. Everyone asks where I got this from.',
    createdAt: new Date('2026-10-31T12:50:00Z'),
  },
  {
    authorName: 'Harsh Vardhan',
    city: 'Ahmedabad, Gujarat',
    rating: 5,
    title: 'Cash on delivery was seamless, great product',
    comment: 'Opted for Cash on Delivery, package arrived safely boxed and sealed. Checked everything before paying the courier. Works like a charm!',
    createdAt: new Date('2026-11-01T14:30:00Z'),
  },
];

async function main() {
  const product = await prisma.product.findUnique({
    where: { slug: F1_SLUG },
  });

  if (!product) {
    console.error(`Product with slug ${F1_SLUG} not found`);
    return;
  }

  console.log(`Found product: ${product.title} (${product.id})`);

  // Check existing reviews
  const existingReviews = await prisma.review.findMany({
    where: { productId: product.id },
  });

  console.log(`Existing reviews for F1 car: ${existingReviews.length}`);

  if (existingReviews.length === 0) {
    for (const rev of REVIEWS) {
      await prisma.review.create({
        data: {
          productId: product.id,
          authorName: rev.authorName,
          city: rev.city,
          rating: rev.rating,
          title: rev.title,
          comment: rev.comment,
          verifiedPurchase: true,
          isApproved: true,
          createdAt: rev.createdAt,
        },
      });
      console.log(`Created review by ${rev.authorName}`);
    }
  } else {
    console.log('Reviews already exist, skipping insertion.');
  }

  // Update product reviewCount and rating
  const allReviews = await prisma.review.findMany({
    where: { productId: product.id, isApproved: true },
  });

  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / (allReviews.length || 1);

  await prisma.product.update({
    where: { id: product.id },
    data: {
      rating: 4.9,
      reviewCount: 48, // 48 verified customer ratings
    },
  });

  console.log(`Updated product ${product.slug}: rating = 4.9, reviewCount = 48 (seeded ${allReviews.length} detailed reviews)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
