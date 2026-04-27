import { auth } from "@/auth";
import { getCustomer, getOrdersByEmail } from "@/lib/shopify";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/format";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  let customer = null;
  let adminOrders: any[] = [];

  // Parallel fetch for speed
  const [customerData, ordersData] = await Promise.all([
    session.provider === "shopify" && session.accessToken 
      ? getCustomer(session.accessToken).catch(() => null)
      : Promise.resolve(null),
    getOrdersByEmail(session.user.email)
  ]);

  customer = customerData;
  adminOrders = ordersData;

  const firstName = customer?.firstName || session.user.name?.split(' ')[0] || "My";
  
  // Calculate "Member Since" string
  const memberSinceStr = customer?.createdAt 
    ? new Date(customer.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Spring 2022";

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 py-24 min-h-screen">
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-20 items-end">
        <div className="md:col-span-7">
          <h1 className="text-6xl md:text-8xl font-headline font-semibold tracking-tighter text-primary leading-[0.9] mb-8 capitalize">
            {firstName === "My" ? "My Harvests" : `${firstName}'s Harvests`}
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant max-w-xl leading-relaxed font-light italic">
            A curated journal of your commitment to the earth. Every order is a step toward agricultural restoration and seasonal excellence.
          </p>
        </div>
        <div className="md:col-span-5 flex flex-col items-start md:items-end">
          <div className="text-left md:text-right">
            <span className="block font-headline font-semibold text-primary uppercase tracking-[0.2em] text-xs mb-2">Member Since</span>
            <span className="text-3xl font-headline font-medium text-on-surface tracking-tight">
              {memberSinceStr}
            </span>
          </div>
        </div>
      </div>

      {/* Asymmetric Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Main Content: Orders */}
        <div className="md:col-span-8 flex flex-col gap-12">
          
          {/* Filter Bar */}
          <div className="flex gap-8 border-b border-outline-variant/15 pb-4">
            <button className="text-primary font-headline font-semibold tracking-tight">Active Yields ({adminOrders.length})</button>
            <button className="text-stone-400 font-headline font-medium tracking-tight hover:text-primary transition-colors">Archived</button>
            <button className="text-stone-400 font-headline font-medium tracking-tight hover:text-primary transition-colors">Scheduled</button>
          </div>

          {/* Orders Map */}
          {adminOrders.length > 0 ? (
             adminOrders.map(({ node: order }: any, index: number) => {
               const firstItem = order.lineItems?.edges[0]?.node;
               const imageUrl = firstItem?.image?.url || "https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?q=80&w=2070&auto=format&fit=crop"; // Better fallback
               
               const dateStr = new Date(order.processedAt).toLocaleDateString("en-US", {
                 month: "long",
                 day: "numeric",
                 year: "numeric"
               });

               const isFulfilled = order.fulfillmentStatus?.toUpperCase() === 'FULFILLED';

               return (
                 <div key={order.id} className="group relative bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 hover:scale-[1.01] transition-all duration-500 hover:shadow-2xl hover:shadow-on-surface/5">
                   <div className="flex flex-col md:flex-row h-full">
                     <div className="md:w-1/3 relative h-64 md:h-auto overflow-hidden">
                       <img alt={firstItem?.title || "Harvest"} className="w-full h-full object-cover grayscale-[0.2] group-hover:scale-105 transition-transform duration-700" src={imageUrl} />
                       <div className={`absolute inset-0 ${index % 2 === 0 ? 'bg-primary/10' : 'bg-secondary/10'} mix-blend-multiply`}></div>
                       <div className="absolute top-4 left-4">
                         <span className={`${isFulfilled ? 'bg-surface-container-highest text-on-surface border border-outline-variant/20' : 'bg-primary text-on-primary'} text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full`}>
                            {isFulfilled ? 'Fulfilled' : 'In Processing'}
                         </span>
                       </div>
                     </div>
                     <div className="md:w-2/3 p-10 flex flex-col justify-between">
                       <div>
                         <div className="flex justify-between items-start mb-2">
                           <span className="text-xs font-label uppercase tracking-widest text-stone-500">Order ID: {order.name}</span>
                           <span className="text-xs font-label text-stone-500">{dateStr}</span>
                         </div>
                         <h3 className="text-3xl font-headline font-semibold text-primary tracking-tight mb-4">{firstItem?.title || "Seasonal Harvest"}</h3>
                         <p className="text-on-surface-variant font-body leading-relaxed mb-6">
                           {order.lineItems?.edges.map(({node}: any) => `${node.quantity}x ${node.title}`).join(', ')}
                         </p>
                       </div>
                       <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10 mt-auto">
                         <span className="text-sm font-label font-medium text-secondary italic">
                           Total: {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
                         </span>
                         <button className="flex items-center gap-2 group/btn">
                           <span className="text-sm font-headline font-bold text-primary group-hover/btn:underline underline-offset-4 decoration-primary/30">MANAGE ORDER</span>
                           <span className="material-symbols-outlined text-sm text-primary" data-icon="settings">settings</span>
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>
               );
             })
          ) : (
            <div className="py-24 text-center border-2 border-dashed border-outline-variant/20 rounded-2xl bg-surface-container-lowest">
               <span className="material-symbols-outlined text-5xl text-outline mb-4" data-icon="inventory_2">inventory_2</span>
               <h4 className="text-2xl font-headline font-bold text-primary mb-2">No Harvests Yet</h4>
               <p className="text-on-surface-variant font-light max-w-sm mx-auto">Your journey toward agricultural restoration hasn&apos;t begun yet. Visit our seasonal collection to start.</p>
               <a href="/products" className="inline-block mt-8 px-8 py-3 bg-primary text-on-primary font-headline font-bold text-sm tracking-tight hover:bg-primary-light transition-colors rounded-full">
                 EXPLORE COLLECTION
               </a>
            </div>
          )}
        </div>

        {/* Sidebar: Analytics & Reports */}
        <div className="md:col-span-4 sticky top-32 flex flex-col gap-8">
            {/* Sustainability Report Card */}
            <div className="bg-primary text-on-primary p-8 rounded-xl shadow-xl shadow-primary/20">
                <h4 className="font-headline font-semibold text-xl tracking-tight mb-6">Sustainability Impact</h4>
                <div className="space-y-8">
                    <div>
                        <div className="flex justify-between text-xs font-label uppercase tracking-[0.1em] text-on-primary/60 mb-2">
                            <span>Soil Carbon Sequestration</span>
                            <span>14.2 kg</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-tertiary-fixed w-[75%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs font-label uppercase tracking-[0.1em] text-on-primary/60 mb-2">
                            <span>Biodiversity Index Contribution</span>
                            <span>+0.8</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-tertiary-fixed w-[60%]"></div>
                        </div>
                    </div>
                    <div className="pt-4">
                        <p className="text-sm font-body leading-relaxed text-on-primary/80 italic">
                            &quot;Your support this season has contributed to the restoration of 4.2 acres of wildflower habitat.&quot;
                        </p>
                    </div>
                    <button className="w-full py-4 bg-primary-container text-on-primary-container font-headline font-bold text-sm tracking-tight hover:bg-tertiary-container transition-colors">
                        DOWNLOAD IMPACT REPORT
                    </button>
                </div>
            </div>

            {/* Yield Summary */}
            <div className="bg-surface-container-high p-8 rounded-xl border border-outline-variant/10">
                <h4 className="font-headline font-semibold text-xl tracking-tight text-primary mb-6">Seasonal Yield</h4>
                <div className="flex items-end gap-2 mb-2">
                    <span className="text-5xl font-headline font-bold text-primary tracking-tighter">184</span>
                    <span className="text-lg font-label text-stone-500 mb-2">lbs</span>
                </div>
                <p className="text-sm font-body text-on-surface-variant mb-6">Total produce delivered this year across 4 harvests.</p>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary" data-icon="eco">eco</span>
                        <span className="text-sm font-label text-primary font-medium">100% Organic Certified</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary" data-icon="local_shipping">local_shipping</span>
                        <span className="text-sm font-label text-primary font-medium">Zero-Plastic Packaging</span>
                    </div>
                </div>
            </div>

            {/* Support Anchor */}
            <div className="p-8 border border-outline-variant/20 rounded-xl flex flex-col gap-4">
                <h5 className="font-headline font-bold text-primary">Need assistance?</h5>
                <p className="text-sm font-body text-on-surface-variant leading-relaxed">Our concierge is available for adjustments to your delivery window or custom curation.</p>
                <a className="text-sm font-headline font-bold text-primary underline underline-offset-4" href="#">Connect with an Agronomist</a>
            </div>
        </div>

      </div>
    </main>
  );
}
