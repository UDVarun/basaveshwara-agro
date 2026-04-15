import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import type { ShopifyProduct } from "@/types/shopify";

// ─── Handle validation ────────────────────────────────────────────────────────
// Shopify handles: lowercase letters, digits, hyphens only, max 100 chars

const HandleSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9-]+$/, "Invalid handle");

// ─── Data fetching ────────────────────────────────────────────────────────────

async function fetchProduct(handle: string): Promise<ShopifyProduct | null> {
  const baseUrl =
    process.env["NEXT_PUBLIC_BASE_URL"] ?? "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/v1/products/${handle}`, {
    next: { revalidate: 60 },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load product");

  return res.json() as Promise<ShopifyProduct>;
}

// ─── generateMetadata (SEO Law 2) ────────────────────────────────────────────

interface PageParams {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { handle } = await params;

  const parsed = HandleSchema.safeParse(handle);
  if (!parsed.success) {
    return { title: "Product Not Found" };
  }

  const product = await fetchProduct(parsed.data);
  if (!product) {
    return { title: "Product Not Found" };
  }

  const title = product.seo.title ?? product.title;
  const description =
    product.seo.description ??
    product.description.slice(0, 160) ??
    `Buy ${product.title} from Sri Basaveshwara Agro Kendra, Chikmagalur`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.featuredImage
        ? [
            {
              url: product.featuredImage.url,
              width: product.featuredImage.width,
              height: product.featuredImage.height,
              alt: product.featuredImage.altText ?? title,
            },
          ]
        : [],
    },
  };
}

// ─── Price formatter ──────────────────────────────────────────────────────────

function formatPrice(amount: string, currencyCode: string): string {
  const num = parseFloat(amount);
  if (currencyCode === "INR") return `₹${num.toLocaleString("en-IN")}`;
  return `${currencyCode} ${num.toFixed(2)}`;
}

// ─── JSON-LD Product schema ───────────────────────────────────────────────────

function ProductJsonLd({ product }: { product: ShopifyProduct }) {
  const firstVariant = product.variants.nodes[0];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url,
    brand: {
      "@type": "Brand",
      name: product.vendor || "Sri Basaveshwara Agro Kendra",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: firstVariant?.price.currencyCode ?? "INR",
      price: firstVariant?.price.amount ?? "0",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Sri Basaveshwara Agro Kendra",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ─── Product specs table ──────────────────────────────────────────────────────
// Reads from product tags in format "spec:value" e.g. "active-ingredient:Chlorpyrifos"

function SpecsTable({ product }: { product: ShopifyProduct }) {
  // Parse structured tags: "registration:KA-CHK-001", "dosage:2ml per litre" etc.
  const specTags = product.tags
    .filter((t) => t.includes(":"))
    .map((t) => {
      const colonIdx = t.indexOf(":");
      return {
        key: t.slice(0, colonIdx).replace(/-/g, " "),
        value: t.slice(colonIdx + 1),
      };
    });

  // Build specs from product fields + parsed tags
  const specs: Array<{ label: string; value: string }> = [];

  if (product.vendor) specs.push({ label: "Manufacturer", value: product.vendor });
  if (product.productType) specs.push({ label: "Product Type", value: product.productType });

  // Pack sizes from variant titles
  const packSizes = product.variants.nodes
    .map((v) => v.title)
    .filter((t) => t !== "Default Title")
    .join(", ");
  if (packSizes) specs.push({ label: "Pack Sizes", value: packSizes });

  // Additional specs from tags
  const specKeyLabels: Record<string, string> = {
    "active ingredient": "Active Ingredient",
    "concentration": "Concentration / NPK",
    "npk": "NPK Ratio",
    "crop suitability": "Crop Suitability",
    "dosage": "Dosage / Application Rate",
    "registration": "Registration Number",
    "application": "Application Method",
    "shelf life": "Shelf Life",
  };

  for (const { key, value } of specTags) {
    const label = specKeyLabels[key.toLowerCase()] ?? key;
    if (!specs.find((s) => s.label === label)) {
      specs.push({ label, value });
    }
  }

  if (specs.length === 0) return null;

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
      <table className="w-full text-sm">
        <caption className="sr-only">Product specifications for {product.title}</caption>
        <tbody>
          {specs.map(({ label, value }, i) => (
            <tr
              key={label}
              className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
            >
              <th
                scope="row"
                className="w-2/5 px-4 py-3 text-left text-xs font-semibold text-slate-700"
              >
                {label}
              </th>
              <td className="px-4 py-3 text-left text-slate-900">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Add to Cart button (client island) ─────────────────────────────────────
// Imported below as a client component

import AddToCartButton from "./AddToCartButton";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductDetailPage({ params }: PageParams) {
  const { handle } = await params;

  // Validate handle before any fetch
  const parsed = HandleSchema.safeParse(handle);
  if (!parsed.success) notFound();

  const product = await fetchProduct(parsed.data);
  if (!product) notFound();

  const firstVariant = product.variants.nodes[0];
  const price = firstVariant
    ? formatPrice(firstVariant.price.amount, firstVariant.price.currencyCode)
    : null;

  return (
    <>
      <ProductJsonLd product={product} />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Breadcrumb — each link min-h-[48px] */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-700">
            <li>
              <Link
                href="/"
                className="flex min-h-[48px] items-center hover:text-[#166534]"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-400">/</li>
            <li>
              <Link
                href="/products"
                className="flex min-h-[48px] items-center hover:text-[#166534]"
              >
                Products
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-400">/</li>
            <li
              aria-current="page"
              className="flex min-h-[48px] items-center font-semibold text-slate-900"
            >
              {product.title}
            </li>
          </ol>
        </nav>

        {/* Product layout: stacked mobile, side-by-side desktop */}
        <div className="flex flex-col gap-8 md:flex-row md:gap-12">
          {/* Product image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 md:w-1/2 md:flex-none">
            {product.featuredImage ? (
              <Image
                src={product.featuredImage.url}
                alt={
                  product.featuredImage.altText ??
                  `${product.title} — product image`
                }
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-6"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
                No image available
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-1 flex-col">
            {/* Vendor / type */}
            {(product.vendor || product.productType) && (
              <p className="text-xs font-semibold uppercase tracking-wide text-[#166534]">
                {[product.vendor, product.productType].filter(Boolean).join(" · ")}
              </p>
            )}

            {/* Product name — h1 */}
            <h1 className="mt-1 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
              {product.title}
            </h1>

            {/* Price */}
            {price && (
              <p className="mt-3 text-2xl font-bold text-[#166534]">
                {price}
                {product.variants.nodes.length > 1 && (
                  <span className="ml-1 text-sm font-normal text-slate-700">
                    onwards
                  </span>
                )}
              </p>
            )}

            {/* Availability */}
            <p className="mt-2 text-sm font-semibold">
              {product.availableForSale ? (
                <span className="text-[#166534]">In Stock</span>
              ) : (
                <span className="text-slate-500">Out of Stock</span>
              )}
            </p>

            {/* Description */}
            {product.description && (
              <div className="mt-4 text-sm leading-relaxed text-slate-700">
                <p>{product.description}</p>
              </div>
            )}

            {/* Specs table */}
            <SpecsTable product={product} />

            {/* Desktop Add to Cart — static, inline with product form */}
            {firstVariant && (
              <div className="mt-6 hidden md:block">
                <AddToCartButton
                  variantId={firstVariant.id}
                  productTitle={product.title}
                  available={product.availableForSale}
                  priceInPaise={Math.round(parseFloat(firstVariant.price.amount) * 100)}
                  currencyCode={firstVariant.price.currencyCode}
                  imageUrl={product.featuredImage?.url ?? null}
                  imageAlt={product.featuredImage?.altText ?? null}
                  handle={product.handle}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sticky Add to Cart — bottom of viewport */}
      {firstVariant && (
        <div className="sticky bottom-0 left-0 right-0 border-t border-slate-200 bg-[#F8FAFC] p-4 md:hidden">
          <AddToCartButton
            variantId={firstVariant.id}
            productTitle={product.title}
            available={product.availableForSale}
            priceInPaise={Math.round(parseFloat(firstVariant.price.amount) * 100)}
            currencyCode={firstVariant.price.currencyCode}
            imageUrl={product.featuredImage?.url ?? null}
            imageAlt={product.featuredImage?.altText ?? null}
            handle={product.handle}
          />
        </div>
      )}
    </>
  );
}
