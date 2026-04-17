import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import type { ShopifyProduct } from "@/types/shopify";
import { getProductByHandle, getProducts, getAllProductHandles } from "@/lib/shopify";
import { formatPrice } from "@/lib/format";
import ProductGallery from "@/components/ProductGallery";
import ProductActions from "@/components/ProductActions";
import ProductCard from "@/components/ProductCard";

const HandleSchema = z.string().min(1).max(100);

// Removal of fetch helpers — using direct Shopify library calls

interface PageParams {
  params: Promise<{ handle: string }>;
}

export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  try {
    const handles = await getAllProductHandles();
    // Pre-render the first 50 products for near-instant transitions
    return handles.slice(0, 50).map((handle) => ({
      handle: handle,
    }));
  } catch (error) {
    console.error("[generateStaticParams] Error:", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.title} | Sri Basaveshwara Agro Kendra`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: product.featuredImage ? [{ url: product.featuredImage.url }] : [],
    }
  };
}

export default async function ProductDetailPage({ params }: PageParams) {
  const { handle } = await params;
  const parsed = HandleSchema.safeParse(handle);
  if (!parsed.success) notFound();

  // Parallelize the primary fetch and related products discovery
  const [product, relatedData] = await Promise.all([
    getProductByHandle(parsed.data),
    getProducts({ first: 8 }) // Fetch more to filter current product effectively
  ]);

  if (!product) notFound();

  const relatedProducts = relatedData.edges
    .map(e => e.node)
    .filter(p => p.handle !== product.handle)
    .slice(0, 4);

  const firstVariant = product.variants.nodes[0];
  
  // Calculate discount if applicable
  const hasDiscount = firstVariant?.compareAtPrice && 
                      parseFloat(firstVariant.compareAtPrice.amount) > parseFloat(firstVariant.price.amount);
  const discountPercent = hasDiscount 
    ? Math.round(((parseFloat(firstVariant!.compareAtPrice!.amount) - parseFloat(firstVariant!.price.amount)) / parseFloat(firstVariant!.compareAtPrice!.amount)) * 100)
    : 0;

  return (
    <main className="bg-surface pb-24 font-body text-on-surface antialiased pt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex text-[11px] text-on-surface-variant font-label mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
          <ol className="flex items-center space-x-2">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><span className="material-symbols-outlined text-xs">chevron_right</span></li>
            <li><Link href="/products" className="hover:text-primary transition-colors">Inventory</Link></li>
            <li><span className="material-symbols-outlined text-xs">chevron_right</span></li>
            <li className="text-on-surface-variant/60">{product.productType || "Resources"}</li>
            <li><span className="material-symbols-outlined text-xs">chevron_right</span></li>
            <li aria-current="page" className="text-primary font-bold">{product.title}</li>
          </ol>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* Left: Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery 
              images={product.images.nodes} 
              title={product.title} 
            />
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="mb-2">
              <span className="text-secondary font-bold font-label text-[10px] uppercase tracking-[0.3em]">{product.vendor}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tighter text-on-surface mb-4 leading-tight">
              {product.title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center text-secondary">
                {[1, 2, 3, 4].map(i => (
                  <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
                <span className="material-symbols-outlined text-lg">star_half</span>
              </div>
              <span className="text-on-surface-variant text-xs font-bold font-label opacity-60 uppercase tracking-widest">(128 Farmer Reviews)</span>
            </div>

            <div className="flex items-end space-x-4 mb-8">
              <span className="text-4xl font-headline font-bold text-primary tracking-tighter">
                {firstVariant ? formatPrice(firstVariant.price.amount, firstVariant.price.currencyCode) : "Price on request"}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-on-surface-variant/40 line-through font-medium mb-1">
                    {formatPrice(firstVariant.compareAtPrice!.amount, firstVariant.compareAtPrice!.currencyCode)}
                  </span>
                  <span className="text-sm text-secondary font-bold mb-2 bg-secondary/10 px-2 py-0.5 rounded-full">-{discountPercent}%</span>
                </>
              )}
            </div>

            <p className="text-on-surface-variant/80 font-medium leading-relaxed text-lg mb-10">
              {product.description}
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mb-10 py-8 border-y border-outline-variant/20">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary border border-outline-variant/10 shadow-sm">
                  <span className="material-symbols-outlined text-2xl">verified</span>
                </div>
                <span className="text-[10px] font-bold text-on-surface font-label uppercase tracking-widest">Genuine Product</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary border border-outline-variant/10 shadow-sm">
                  <span className="material-symbols-outlined text-2xl">receipt_long</span>
                </div>
                <span className="text-[10px] font-bold text-on-surface font-label uppercase tracking-widest">GST Invoice</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary border border-outline-variant/10 shadow-sm">
                  <span className="material-symbols-outlined text-2xl">storefront</span>
                </div>
                <span className="text-[10px] font-bold text-on-surface font-label uppercase tracking-widest">Authorized</span>
              </div>
            </div>

            {/* Client Actions Component */}
            <ProductActions 
              variants={product.variants.nodes}
              productTitle={product.title}
              handle={product.handle}
              featuredImage={product.featuredImage}
            />

            <div className="mt-auto">
              <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 flex items-start space-x-3">
                <span className="material-symbols-outlined text-primary text-xl">info</span>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                  For bulk biological orders or wholesale inquiries, please 
                  <Link href="/contact" className="text-primary font-bold hover:underline ml-1">contact dealer support</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Bento Section */}
        <div className="mt-32 pt-16 border-t border-outline-variant/20">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3">
              <h3 className="text-3xl font-headline font-bold text-primary mb-8 tracking-tighter">Agronomic Assessment</h3>
              <div className="bg-surface-container-low p-10 rounded-[2.5rem] shadow-editorial border border-outline-variant/5">
                <div className="prose prose-stone prose-lg font-body leading-relaxed text-on-surface-variant max-w-none">
                  {product.descriptionHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
                  ) : (
                    <p>{product.description}</p>
                  )}
                </div>
              </div>
              
              {/* Dynamic Guidelines Grid (Visible for Seeds/Fertilizers) */}
              {["Seed", "Fertilizer"].includes(product.productType) && (
                <div className="mt-8 bg-primary text-white p-10 rounded-[2.5rem] shadow-editorial">
                  <h4 className="text-xl font-headline font-bold mb-10 flex items-center gap-3">
                    <span className="material-symbols-outlined">analytics</span>
                    Cultivation Protocol
                  </h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                      { label: "Stability", icon: "landscape", value: "High Loam Precision" },
                      { label: "Interval", icon: "calendar_today", value: "90-110 Days" },
                      { label: "Optimal Rate", icon: "scale", value: "100g / Acre" },
                      { label: "Geometry", icon: "straighten", value: "90cm x 60cm" }
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">{item.label}</div>
                        <div className="flex items-center gap-2 font-medium">
                          <span className="material-symbols-outlined text-secondary opacity-80">{item.icon}</span>
                          <span>{item.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:w-1/3">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-editorial border border-outline-variant/10 h-full flex flex-col">
                <h3 className="text-xl font-headline font-bold text-primary mb-8 flex items-center gap-2 tracking-tighter">
                  <span className="material-symbols-outlined text-secondary">workspace_premium</span>
                  Resource Certification
                </h3>
                <ul className="space-y-6 flex-grow">
                  {[
                    "Verified Biological Purity",
                    "Climate-Resistant Optimization",
                    "High Logistics Stability",
                    "Certified Manufacturer Warranty"
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="material-symbols-outlined text-secondary text-sm">check</span>
                      </div>
                      <span className="text-on-surface-variant font-medium leading-snug">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-12 pt-8 border-t border-outline-variant/20">
                  <div className="flex items-center gap-3 text-secondary font-bold text-xs uppercase tracking-widest">
                    <span className="material-symbols-outlined">verified</span>
                    Stewardship Record 100%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-32">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-headline font-bold text-primary tracking-tighter">Strategic Provisions</h2>
              <p className="text-on-surface-variant font-medium mt-2">Compatible resources for your current selection.</p>
            </div>
            <Link href="/products" className="text-primary font-bold hover:underline flex items-center group font-label text-sm uppercase tracking-widest">
              View Inventory
              <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts?.filter(p => p.handle !== product.handle).slice(0, 4).map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
