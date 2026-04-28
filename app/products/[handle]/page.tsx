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
import { 
  BadgeCheck, 
  Truck, 
  FlaskConical, 
  HelpCircle, 
  Leaf, 
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";

const HandleSchema = z.string().min(1).max(100);

interface PageParams {
  params: Promise<{ handle: string }>;
}

export const revalidate = 60; // Revalidate every 60 seconds

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
    <main className="bg-white pb-32 font-body text-agro-ink antialiased pt-40">
      <div className="max-w-[1600px] mx-auto px-8 md:px-12">
        
        {/* Architectural Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-16 border-b border-agro-outline-ghost/10 pb-6">
          <ol className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-agro-muted/40">
            <li><Link href="/" className="hover:text-agro-green transition-colors">Legacy</Link></li>
            <li className="w-1 h-1 bg-agro-green/30 rounded-full" />
            <li><Link href="/products" className="hover:text-agro-green transition-colors">Assets</Link></li>
            <li className="w-1 h-1 bg-agro-green/30 rounded-full" />
            <li className="text-agro-ink">{product.title}</li>
          </ol>
        </nav>

        {/* Product Section: Strategic Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 xl:gap-32 items-start text-agro-ink">
          {/* Left: Visual Asset Gallery */}
          <div className="lg:col-span-7 xl:col-span-7">
            <ProductGallery 
              images={product.images.nodes} 
              title={product.title} 
            />
          </div>

          {/* Right: Asset Specification */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col space-y-10 lg:pl-10">
            <header className="space-y-6">
              <div className="flex items-center gap-3">
                 <span className="h-6 w-1 bg-agro-green rounded-full" />
                 <h4 className="text-[11px] font-bold text-agro-green uppercase tracking-[0.4em]">
                   {product.vendor} Biological Suite
                 </h4>
              </div>
              <h1 className="text-5xl md:text-7xl font-headline font-semibold tracking-tighter leading-[0.85] uppercase text-agro-ink">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4 py-4 px-6 bg-agro-surface-low rounded-2xl border border-agro-outline-ghost/10 w-fit">
                <div className="flex items-center gap-1 text-agro-green">
                  {[1, 2, 3, 4, 5].map(i => (
                    <BadgeCheck key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-agro-muted uppercase tracking-[0.25em]">Verified Performance Record</span>
              </div>
            </header>

            <div className="space-y-2">
               <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-30">Consolidated Valuation</span>
               <div className="flex items-baseline gap-6">
                  <span className="text-5xl md:text-6xl font-headline font-bold tracking-tighter text-agro-ink">
                    {firstVariant ? formatPrice(firstVariant.price.amount, firstVariant.price.currencyCode) : "Quote Requested"}
                  </span>
                  {hasDiscount && (
                    <div className="flex items-center gap-3">
                       <span className="text-2xl text-agro-muted/30 line-through font-headline font-bold tracking-tighter">
                         {formatPrice(firstVariant.compareAtPrice!.amount, firstVariant.compareAtPrice!.currencyCode)}
                       </span>
                       <span className="text-[10px] font-bold text-white bg-agro-green px-3 py-1 rounded-full uppercase tracking-tighter">-{discountPercent}%</span>
                    </div>
                  )}
               </div>
            </div>

            <p className="text-agro-muted text-xl md:text-2xl font-headline font-medium tracking-tight leading-tight opacity-80 max-w-2xl">
              {product.description}
            </p>

            {/* Performance Indicators */}
            <div className="grid grid-cols-3 gap-6 py-10 border-y border-agro-outline-ghost/10">
              {[
                { label: "Governance", icon: ShieldCheck, value: "Certified" },
                { label: "Logistics", icon: Truck, value: "Priority" },
                { label: "Biological", icon: FlaskConical, value: "Optimized" }
              ].map((spec, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-agro-surface-low flex items-center justify-center border border-agro-outline-ghost/20 shadow-editorial">
                    <spec.icon className="w-6 h-6 text-agro-green opacity-40" />
                  </div>
                  <div className="space-y-1">
                     <span className="block text-[9px] font-bold uppercase tracking-[0.3em] opacity-30">{spec.label}</span>
                     <span className="block text-[10px] font-bold uppercase tracking-widest">{spec.value}</span>
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
               <div className="bg-agro-surface-low p-6 rounded-3xl border border-agro-outline-ghost/10 flex items-start gap-4">
                  <HelpCircle className="w-6 h-6 text-agro-green shrink-0" />
                  <p className="text-[11px] text-agro-muted font-bold leading-relaxed uppercase tracking-widest">
                    Consult our institutional advisors for bulk procurement strategies.
                    <Link href="/contact" className="text-agro-green block mt-2 hover:underline">Strategic Consultation</Link>
                  </p>
               </div>
            </footer>
          </div>
        </div>

        {/* Technical Specification Section */}
        <div className="mt-48 pt-24 border-t border-agro-outline-ghost/10 grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-8 space-y-12">
               <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-agro-green uppercase tracking-[0.4em]">Resource Brief</h4>
                  <h3 className="text-5xl md:text-7xl font-headline font-semibold text-agro-ink tracking-tight leading-none uppercase">Agronomic <br/> Assessment.</h3>
               </div>
               
               <div className="bg-agro-surface-low p-12 lg:p-20 rounded-[3rem] border border-agro-outline-ghost/10 shadow-editorial overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                    <span className="font-headline font-bold text-[150px] leading-none">BAK</span>
                 </div>
                 <div className="prose prose-stone prose-2xl font-headline font-semibold tracking-tight leading-[1.1] text-agro-ink max-w-none opacity-80 uppercase">
                   {product.descriptionHtml ? (
                     <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
                   ) : (
                     <p>{product.description}</p>
                   )}
                 </div>
               </div>
            </div>

            <div className="lg:col-span-4 lg:mt-32">
               <div className="bg-agro-ink p-12 rounded-[2.5rem] shadow-editorial sticky top-40">
                  <h3 className="text-[11px] font-bold text-agro-green uppercase tracking-[0.5em] mb-12 flex items-center gap-4 italic underline underline-offset-8">
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
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-agro-green transition-all duration-500">
                          <BadgeCheck className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-16 pt-10 border-t border-white/10 flex items-center gap-6">
                     <Leaf className="w-10 h-10 text-white/20" />
                     <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] leading-relaxed">
                        Authorized Distribution <br/> Professional Grade Assets
                     </p>
                  </div>
               </div>
            </div>
        </div>

        {/* Related Strategy Matrix */}
        <div className="mt-48 pt-24 border-t border-agro-outline-ghost/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
            <div className="space-y-6">
              <h4 className="text-[11px] font-bold text-agro-green uppercase tracking-[0.4em]">Asset Suite</h4>
              <h2 className="text-5xl md:text-8xl font-headline font-semibold text-agro-ink tracking-tighter leading-none uppercase">Strategic <br/> Compatibility.</h2>
            </div>
            <Link href="/products" className="group flex flex-col items-end gap-4">
              <span className="text-[11px] font-bold text-agro-ink uppercase tracking-[0.4em]">Inventory Index</span>
              <div className="w-20 h-20 bg-agro-surface-low rounded-full flex items-center justify-center border border-agro-outline-ghost/20 group-hover:bg-agro-green group-hover:border-agro-green transition-all duration-500">
                <ArrowRight className="w-8 h-8 text-agro-ink group-hover:text-white transition-colors" />
              </div>
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
