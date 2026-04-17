"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // This effect runs when the route changes (pathname or searchParams)
    // We can't easily detect the "start" of a transition without wrapping links,
    // but we can show the bar once the loading skeleton is visible if needed.
    // However, for Next.js 15, the best way for immediate feedback is to reset
    // when we detect a change is happening.
    
    // Reset state on actual mount of new page
    setProgress(0);
    setVisible(false);
  }, [pathname, searchParams]);

  // A more robust way in Next.js 15 is to provide a global transition bar 
  // that responds to the native routing.
  
  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-[9999] h-0.5 pointer-events-none transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div 
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
      <style jsx global>{`
        /* Minimal loading animation fallback for Next.js routing */
        #nprogress {
          pointer-events: none;
        }
        #nprogress .bar {
          background: var(--color-primary);
          position: fixed;
          z-index: 1031;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
        }
      `}</style>
    </div>
  );
}
