export default function RootLoading() {
  return (
    <div className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 font-headline font-bold text-primary tracking-widest text-[10px] uppercase opacity-60">
        Cultivating your experience...
      </p>
    </div>
  );
}
