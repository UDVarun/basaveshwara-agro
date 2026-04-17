import { getProducts } from "@/lib/shopify";
import type { ShopifyProductConnection } from "@/types/shopify";
import ProductCard from "@/components/ProductCard";

export default async function ProductsGrid({ 
  q, category, brand 
}: { 
  q?: string; 
  category?: string; 
  brand?: string;
}) {
  // Construct dynamic Shopify query
  const queryParts = [];
  if (q) queryParts.push(q);
  if (category) queryParts.push(`product_type:${category}`);
  if (brand) queryParts.push(`vendor:${brand}`);
  
  const combinedQuery = queryParts.join(" ");

  let data: ShopifyProductConnection;
  try {
    data = await getProducts({
      first: 24, 
      query: combinedQuery,
    });
  } catch (error) {
    console.error("[ProductsGrid] Error fetching:", error);
    return <div className="p-12 text-center text-on-surface-variant font-medium opacity-60">Inventory sync in progress...</div>;
  }

  const products = data.edges.map((edge) => edge.node);

  if (products.length === 0) {
    return (
      <div className="p-24 text-center space-y-4 bg-surface-container-low rounded-3xl border border-outline-variant/10">
        <span className="material-symbols-outlined text-4xl text-primary/20" data-icon="search_off">search_off</span>
        <h3 className="font-headline font-bold text-xl text-primary">No Resources Found</h3>
        <p className="font-body text-on-surface-variant max-w-xs mx-auto">We couldn&apos;t find any assets matching your current filters. Try adjusting your selection.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
