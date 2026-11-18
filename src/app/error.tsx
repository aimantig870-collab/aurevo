"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main id="main" className="grid min-h-screen place-items-center bg-night px-6 text-center text-crema">
      <div><p className="eyebrow text-aurum">Something spilled</p><h1 className="h-display mt-3 text-5xl">Please try again.</h1><button onClick={reset} className="btn btn-gold mt-8">Retry</button></div>
    </main>
  );
}
