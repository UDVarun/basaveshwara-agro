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

interface PageParams {
  params: Promise<{ handle: string }>;
}

export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  try {
    const handles = await getAllProductHandles();
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

  const [product, relatedData] = await Promise.all([
    getProductByHandle(parsed.data),
    getProducts({ first: 8 })
  ]);

  if (!product) notFound();

  const relatedProducts = relatedData.edges
    .map(e => e.node)
    .filter(p => p.handle !== product.handle)
    .slice(0, 4);

  const firstVariant = product.variants.nodes[0];
  
  const hasDiscount = firstVariant?.compareAtPrice && 
                      parseFloat(firstVariant.compareAtPrice.amount) > parseFloat(firstVariant.price.amount);
  const discountPercent = hasDiscount 
    ? Math.round(((parseFloat(firstVariant!.compareAtPrice!.amount) - parseFloat(firstVariant!.price.amount)) / parseFloat(firstVariant!.compareAtPrice!.amount)) * 100)
    : 0;

  return (
    <main className="bg-white pb-32 font-body text-on-surface antialiased pt-40">
      <div className="max-w-[1600px] mx-auto px-8 md:px-12">
        
        {/* Architectural Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-16 border-b border-outline-variant/10 pb-6">
          <ol className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40">
            <li><Link href="/" className="hover:text-primary transition-colors">Legacy</Link></li>
            <li className="w-1 h-1 bg-secondary rounded-full" />
            <li><Link href="/products" className="hover:text-primary transition-colors">Assets</Link></li>
            <li className="w-1 h-1 bg-secondary rounded-full" />
            <li className="text-primary">{product.title}</li>
          </ol>
        </nav>

        {/* Product Section: Strategic Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 xl:gap-32 items-start text-primary">
          {/* Left: Visual Asset Gallery */}
          <div className="lg:col-span-7 xl:col-span-7">
            <ProductGallery 
              images={product.images.nodes} 
              title={product.title} 
            />
          </div>

          {/* Right: Asset Specification */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col space-y-10">
            <header className="space-y-6">
              <div className="flex items-center gap-3">
                 <span className="h-6 w-1 bg-secondary rounded-full" />
                 <h4 className="text-[11px] font-black text-secondary uppercase tracking-[0.4em] font-label">
                   {product.vendor} Biological Suite
                 </h4>
              </div>
              <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tighter leading-[0.85] uppercase">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4 py-4 px-6 bg-surface-container-low rounded-2xl border border-outline-variant/5 w-fit">
                <div className="flex items-center text-secondary/40">
                  {[1, 2, 3, 4, 5].map(i => (
                    <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  ))}
                </div>
                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.25em]">Verified Performance Record</span>
              </div>
            </header>

            <div className="space-y-2">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Consolidated Valuation</span>
               <div className="flex items-baseline gap-6">
                  <span className="text-5xl md:text-6xl font-headline font-black tracking-tighter">
                    {firstVariant ? formatPrice(firstVariant.price.amount, firstVariant.price.currencyCode) : "Quote Requested"}
                  </span>
                  {hasDiscount && (
                    <div className="flex items-center gap-3">
                       <span className="text-2xl text-on-surface-variant/30 line-through font-headline font-black tracking-tighter">
                         {formatPrice(firstVariant.compareAtPrice!.amount, firstVariant.compareAtPrice!.currencyCode)}
                       </span>
                       <span className="text-[10px] font-black text-white bg-secondary px-3 py-1 rounded-full uppercase tracking-tighter">-{discountPercent}%</span>
                    </div>
                  )}
               </div>
            </div>

            <p className="text-on-surface-variant text-xl md:text-2xl font-headline font-black tracking-tight leading-tight opacity-70">
              {product.description}
            </p>

            {/* Performance Indicators */}
            <div className="grid grid-cols-3 gap-6 py-10 border-y border-outline-variant/10">
              {[
                { label: "Governance", icon: "verified", value: "Certified" },
                { label: "Logistics", icon: "local_shipping", value: "Priority" },
                { label: "Biological", icon: "biotech", value: "Optimized" }
              ].map((spec, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center border border-outline-variant/5 shadow-editorial">
                    <span className="material-symbols-outlined text-2xl opacity-40">{spec.icon}</span>
                  </div>
                  <div className="space-y-1">
                     <span className="block text-[9px] font-black uppercase tracking-[0.3em] opacity-20">{spec.label}</span>
                     <span className="block text-[10px] font-black uppercase tracking-widest">{spec.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Procurement Actions */}
            <div className="product-actions-wrapper">
               <ProductActions 
                 variants={product.variants.nodes}
                 productTitle={product.title}
                 handle={product.handle}
                 featuredImage={product.featuredImage}
               />
            </div>

            <footer className="pt-6">
               <div className="bg-surface-container p-6 rounded-3xl border border-outline-variant/10 flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary text-2xl">help</span>
                  <p className="text-[11px] text-on-surface-variant font-bold leading-relaxed uppercase tracking-widest">
                    Consult our institutional advisors for bulk procurement strategies.
                    <Link href="/contact" className="text-secondary block mt-2 hover:underline">Strategic Consultation</Link>
                  </p>
               </div>
            </footer>
          </div>
        </div>

        {/* Technical Specification Section */}
        <div className="mt-48 pt-24 border-t border-outline-variant/10 grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-8 space-y-12">
               <div className="space-y-4">
                  <h4 className="text-[11px] font-black text-secondary uppercase tracking-[0.4em]">Resource Brief</h4>
                  <h3 className="text-5xl md:text-7xl font-headline font-black text-primary tracking-tight leading-none uppercase">Agronomic <br/> Assessment.</h3>
               </div>
               
               <div className="bg-surface-container-low p-12 lg:p-20 rounded-[3rem] border border-outline-variant/5 shadow-luxury overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <span className="font-headline font-black text-[100px]">BAK</span>
                 </div>
                 <div className="prose prose-stone prose-2xl font-headline font-black tracking-tight leading-[1.1] text-primary max-w-none opacity-80 uppercase">
                   {product.descriptionHtml ? (
                     <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
                   ) : (
                     <p>{product.description}</p>
                   )}
                 </div>
               </div>
            </div>

            <div className="lg:col-span-4 lg:mt-32">
               <div className="bg-primary p-12 rounded-[2.5rem] shadow-editorial sticky top-32">
                  <h3 className="text-[11px] font-black text-secondary uppercase tracking-[0.5em] mb-12 flex items-center gap-4 italic underline underline-offset-8">
                    Institutional Certification
                  </h3>
                  <ul className="space-y-8">
                    {[
                      "Verified Biological Purity Score",
                      "Climate-Resistant Optimization",
                      "High-Density Growth Potential",
                      "Regional Soil DNA Alignment"
                    ].map((benefit, i) => (
                      <li key={i} className="flex items-center gap-6 group">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-secondary transition-all">
                          <span className="material-symbols-outlined text-white text-sm">verified</span>
                        </div>
                        <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-16 pt-10 border-t border-white/10 flex items-center gap-6">
                     <span className="material-symbols-outlined text-white/20 text-4xl">eco</span>
                     <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] leading-relaxed">
                        Authorized Distribution <br/> Professional Grade Assets
                     </p>
                  </div>
               </div>
            </div>
        </div>

        {/* Related Strategy Matrix */}
        <div className="mt-48 pt-24 border-t border-outline-variant/10">
          <div className="flex items-end justify-between mb-20">
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-secondary uppercase tracking-[0.4em]">Asset Suite</h4>
              <h2 className="text-5xl md:text-8xl font-headline font-black text-primary tracking-tighter leading-none uppercase">Strategic <br/> Compatibility.</h2>
            </div>
            <Link href="/products" className="group flex flex-col items-end gap-2">
              <span className="text-[11px] font-black text-primary uppercase tracking-[0.4em]">Inventory Index</span>
              <span className="material-symbols-outlined text-primary text-5xl group-hover:translate-x-4 transition-transform">arrow_forward</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {relatedProducts?.filter(p => p.handle !== product.handle).slice(0, 4).map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
