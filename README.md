This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Legal Compliance & Storefront Configuration

All legal, statutory, shipping, and promotional configurations are centralized in dedicated config files:

- `src/config/legal.ts`: Entity details, GSTIN, registered address, Grievance Officer details per Consumer Protection (E-Commerce) Rules 2020, and BIS registration numbers.
- `src/config/sale.ts`: Announcement banner and countdown configuration. Real countdown renders only if `SALE_END_DATE` is set to a future timestamp.
- `src/config/shipping.ts`: Delivery promise (`DELIVERY_PROMISE`) and partial COD parameters.
- `src/config/social.ts`: Social media links (Instagram, WhatsApp, etc.).

### IP & Trademark Scanner
Run the automated build-time scanner to ensure no unauthorized third-party trademark terms exist in source code or catalog seeds:
```bash
npm run check:ip
```

### Media Rights & Photography Advisory
> [!WARNING]
> Several product image assets stored on the CDN currently follow marketplace naming conventions (e.g. `il_1588xN.*` originating from Etsy/AliExpress supplier listings). 
> While dev-time warnings (`checkImageRights` in `src/config/media.ts`) will flag these in console, it is strongly advised to conduct in-house studio product photography and replace these assets before scaling paid ad campaigns to protect against DMCA notices or copyright claims.

