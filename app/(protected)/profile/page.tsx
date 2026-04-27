import { auth } from "@/auth";
import { getCustomer } from "@/lib/shopify";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.accessToken) {
    redirect("/login");
  }

  let customer = null;
  if (session.provider === "shopify") {
    try {
      customer = await getCustomer(session.accessToken);
    } catch (error) {
      console.error("[ProfilePage] Shopify fetch error:", error);
    }
  }

  const orders = customer?.orders?.edges || [];
  const firstName = customer?.firstName || "My";
  
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
            <button className="text-primary font-headline font-semibold tracking-tight">Active Yields ({orders.length > 0 ? orders.length : 2})</button>
            <button className="text-stone-400 font-headline font-medium tracking-tight hover:text-primary transition-colors">Archived</button>
            <button className="text-stone-400 font-headline font-medium tracking-tight hover:text-primary transition-colors">Scheduled</button>
          </div>

          {/* Orders Map */}
          {orders.length > 0 ? (
             orders.map(({ node: order }: any, index: number) => {
               const firstItem = order.lineItems?.edges[0]?.node;
               const imageUrl = firstItem?.image?.url || "https://lh3.googleusercontent.com/aida-public/AB6AXuAURtJV42ScTna8TspbNBu7kRAGX7pzXfP5ZSs7iaSqfK3CMS81b_aijs0yS6dtpNZoi28IePCj3-VPvIZPNgaFHIo-UEcIsx5TyFdSmbpIyVroQfW3lbj8Ccc6p6Ji0ML0QLD8gm1h3XaI1oj3pyxuDHK_QhmAmNlhz8YFZOVNQOccMO7BJx1hY_MQn8GYjk0lpBNjMZl7T-OmOAz6-QpuwPjeScCO-R34j66vqDn6QxRgiOUdl7KgJvyR1NYv1pP7MwEMCrgxXag"; // Fallback image
               
               const dateStr = new Date(order.processedAt).toLocaleDateString("en-US", {
                 month: "long",
                 day: "numeric",
                 year: "numeric"
               });

               const isFulfilled = order.fulfillmentStatus === 'FULFILLED';

               return (
                 <div key={order.id} className="group relative bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 hover:scale-[1.01] transition-all duration-500 hover:shadow-2xl hover:shadow-on-surface/5">
                   <div className="flex flex-col md:flex-row h-full">
                     <div className="md:w-1/3 relative h-64 md:h-auto overflow-hidden">
                       <img alt={firstItem?.title || "Harvest"} className="w-full h-full object-cover grayscale-[0.2] group-hover:scale-105 transition-transform duration-700" src={imageUrl} />
                       <div className={`absolute inset-0 ${index % 2 === 0 ? 'bg-primary/10' : 'bg-secondary/10'} mix-blend-multiply`}></div>
                       <div className="absolute top-4 left-4">
                         <span className={`${isFulfilled ? 'bg-surface-container-highest text-on-surface border border-outline-variant/20' : 'bg-primary text-on-primary'} text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full`}>
                            {isFulfilled ? 'Preparing' : 'In Transit'}
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
                           Total: {order.totalPrice.amount} {order.totalPrice.currencyCode}
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
            // Static empty state from mockup
            <>
              {/* Order Card 1: Premium Glassmorphic */}
              <div className="group relative bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 hover:scale-[1.01] transition-all duration-500 hover:shadow-2xl hover:shadow-on-surface/5">
                <div className="flex flex-col md:flex-row h-full">
                  <div className="md:w-1/3 relative h-64 md:h-auto overflow-hidden">
                    <img alt="close-up of vibrant purple heirloom carrots and earthy golden beets in a rustic wooden crate under soft morning light" className="w-full h-full object-cover grayscale-[0.2] group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAURtJV42ScTna8TspbNBu7kRAGX7pzXfP5ZSs7iaSqfK3CMS81b_aijs0yS6dtpNZoi28IePCj3-VPvIZPNgaFHIo-UEcIsx5TyFdSmbpIyVroQfW3lbj8Ccc6p6Ji0ML0QLD8gm1h3XaI1oj3pyxuDHK_QhmAmNlhz8YFZOVNQOccMO7BJx1hY_MQn8GYjk0lpBNjMZl7T-OmOAz6-QpuwPjeScCO-R34j66vqDn6QxRgiOUdl7KgJvyR1NYv1pP7MwEMCrgxXag"/>
                    <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
                    <div className="absolute top-4 left-4">
                       <span className="bg-primary text-on-primary text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">In Transit</span>
                    </div>
                  </div>
                  <div className="md:w-2/3 p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-label uppercase tracking-widest text-stone-500">Order ID: AG-8842-X</span>
                        <span className="text-xs font-label text-stone-500">June 14, 2024</span>
                      </div>
                      <h3 className="text-3xl font-headline font-semibold text-primary tracking-tight mb-4">Summer Root Collection</h3>
                      <p className="text-on-surface-variant font-body leading-relaxed mb-6">A selection of seasonal root vegetables harvested at peak maturation from our North Valley plots.</p>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface-container-lowest flex items-center justify-center text-[10px] font-bold">1</div>
                        <div className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface-container-lowest flex items-center justify-center text-[10px] font-bold">2</div>
                        <div className="w-8 h-8 rounded-full bg-primary-fixed border-2 border-surface-container-lowest flex items-center justify-center text-[10px] font-bold">+2</div>
                      </div>
                      <button className="flex items-center gap-2 group/btn">
                        <span className="text-sm font-headline font-bold text-primary group-hover/btn:underline underline-offset-4 decoration-primary/30">TRACK SHIPMENT</span>
                        <span className="material-symbols-outlined text-sm text-primary" data-icon="north_east">north_east</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Card 2 */}
              <div className="group relative bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 hover:scale-[1.01] transition-all duration-500">
                <div className="flex flex-col md:flex-row h-full">
                  <div className="md:w-1/3 relative h-64 md:h-auto overflow-hidden">
                    <img alt="rich dark honeycomb dripping with golden honey on a textured ceramic plate with artisanal wooden honey dipper" className="w-full h-full object-cover grayscale-[0.2] group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMuK02jYd8i0ks-L_T_Sgm2es3pZXcQ8nLH8mur_eCO200TCLXxSlxEWecY2M7X0jhLcG6pzaTbh8Ay_N4q0d6Cm3DqDkHQEiQzZUjImYV1DrPKJUXvjr-GF1_kh4CcxRJdzKIZ4rmUH5Xg3-owcwJKMHDuVDyZiqBL5DQxAtRnWeXBNvTgFa2lvUDIQzrQn5JYAGjZ5SmquTOiH51KpqOXJsUHkn_dPn9W0ScE0M1zXZ-a0fNgusD9mkUasIJ50n06dFBvAbp7I4" />
                    <div className="absolute inset-0 bg-secondary/10 mix-blend-multiply"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-surface-container-highest text-on-surface text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-outline-variant/20">Preparing</span>
                    </div>
                  </div>
                  <div className="md:w-2/3 p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-label uppercase tracking-widest text-stone-500">Order ID: AG-9021-Y</span>
                        <span className="text-xs font-label text-stone-500">June 12, 2024</span>
                      </div>
                      <h3 className="text-3xl font-headline font-semibold text-primary tracking-tight mb-4">Artisanal Pollen Reserve</h3>
                      <p className="text-on-surface-variant font-body leading-relaxed mb-6">Cold-pressed wildflower honey and fresh royal jelly, sustainably extracted from our apiaries.</p>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10 mt-auto">
                      <span className="text-sm font-label font-medium text-secondary italic">Expected Arrival: June 18</span>
                      <button className="flex items-center gap-2 group/btn">
                        <span className="text-sm font-headline font-bold text-primary group-hover/btn:underline underline-offset-4 decoration-primary/30">MANAGE ORDER</span>
                        <span className="material-symbols-outlined text-sm text-primary" data-icon="settings">settings</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
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
