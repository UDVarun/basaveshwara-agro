import { auth } from "@/auth";
import { getCustomer } from "@/lib/shopify";
import { redirect } from "next/navigation";
import { User, Package, MapPin, Mail, Calendar, LogOut } from "lucide-react";
import { signOut } from "@/auth";

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

  if (session.provider === "shopify" && !customer) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900">Failed to load profile</h1>
          <p className="text-stone-500">Please try logging in again.</p>
        </div>
      </div>
    );
  }

  const displayName = customer?.firstName 
    ? `${customer.firstName} ${customer.lastName}`
    : session.user?.name || "Member";
    
  const displayEmail = customer?.emailAddress?.email || session.user?.email;
  const initial = (customer?.firstName?.[0] || session.user?.name?.[0] || displayEmail?.[0] || "?").toUpperCase();

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header */}
      <div className="bg-emerald-900 text-white pt-24 pb-32 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-emerald-700 rounded-3xl flex items-center justify-center text-3xl font-bold border-4 border-emerald-800/50 shadow-2xl">
              {initial}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {displayName}
              </h1>
              <p className="text-emerald-100/80 font-medium flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" />
                {displayEmail}
              </p>
            </div>
          </div>
          
          <form action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
          }}>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all border border-white/10">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 -mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info Cards */}
        <div className="lg:col-span-1 space-y-6">
          {/* Address Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-stone-200/50 border border-stone-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-700" />
                Default Address
              </h3>
            </div>
            
            {customer?.defaultAddress ? (
              <div className="text-stone-600 space-y-1 font-medium italic">
                <p>{customer.defaultAddress.address1}</p>
                {customer.defaultAddress.address2 && <p>{customer.defaultAddress.address2}</p>}
                <p>{customer.defaultAddress.city}, {customer.defaultAddress.province} {customer.defaultAddress.zip}</p>
                <p>{customer.defaultAddress.country}</p>
              </div>
            ) : (
              <p className="text-stone-400 italic">
                {session.provider === "shopify" ? "No address on file" : "Not available for social login"}
              </p>
            )}
          </div>

          <div className="bg-emerald-800 rounded-3xl p-8 text-white shadow-xl shadow-emerald-900/10">
            <h3 className="text-lg font-bold mb-2">Need Help?</h3>
            <p className="text-emerald-100/80 text-sm mb-6">
              Contact our support team for any order inquiries or agricultural advice.
            </p>
            <button className="w-full bg-white text-emerald-900 font-bold py-3 rounded-xl hover:bg-emerald-50 transition-colors">
              Contact Support
            </button>
          </div>
        </div>

        {/* Right Column: Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-stone-200/50 border border-stone-100 min-h-[400px]">
            <h3 className="text-xl font-bold text-stone-900 flex items-center gap-3 mb-8">
              <Package className="w-6 h-6 text-emerald-700" />
              Recent Orders
            </h3>

            {customer?.orders?.edges?.length > 0 ? (
              <div className="space-y-4">
                {customer.orders.edges.map(({ node: order }: any) => (
                  <div key={order.id} className="group border border-stone-100 hover:border-emerald-200 hover:bg-emerald-50/30 rounded-2xl p-6 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-stone-900 font-bold text-lg">{order.name}</p>
                        <p className="text-stone-400 text-sm flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.processedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-stone-900 font-black text-lg">
                          {order.totalPrice.amount} {order.totalPrice.currencyCode}
                        </p>
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mt-2 ${
                          order.financialStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {order.financialStatus}
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-stone-50 flex justify-between items-center text-sm">
                      <p className="text-stone-500">
                        {order.lineItems.edges.map(({ node }: any) => `${node.quantity}x ${node.title}`).join(', ')}
                        {order.lineItems.edges.length > 2 && ' ...'}
                      </p>
                      <button className="text-emerald-700 font-bold hover:underline">
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-stone-50 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                  <Package className="w-10 h-10 text-stone-200" />
                </div>
                <h4 className="text-stone-900 font-bold mb-1">
                  {session.provider === "shopify" ? "No orders yet" : "Order tracking unavailable"}
                </h4>
                <p className="text-stone-400 max-w-[200px]">
                  {session.provider === "shopify" 
                    ? "Start shopping to see your harvest history here." 
                    : "Please sign in with your main account to view order history."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
