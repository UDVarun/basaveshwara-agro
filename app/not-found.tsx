import Link from "next/link";
import { MoveLeft, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-8 mx-auto">
          <HelpCircle className="w-8 h-8 text-agro-muted opacity-30" />
        </div>
        
        <h1 className="text-6xl font-headline font-bold text-agro-ink mb-4 tracking-tighter">404</h1>
        <h2 className="text-xl font-headline font-semibold text-agro-ink mb-4 tracking-tight">Coordinates Not Found</h2>
        <p className="text-agro-muted mb-10 font-body leading-relaxed opacity-60">
          The requested resource is missing from the institutional directory. It may have been relocated or purged.
        </p>
        
        <Link 
          href="/"
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-agro-ink transition-all rounded-sm group"
        >
          <MoveLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Return to Core
        </Link>
      </div>
      
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none">
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-agro-muted">Basaveshwara Agro Protocol</span>
      </div>
    </div>
  );
}
