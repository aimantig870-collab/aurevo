import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="grid min-h-screen place-items-center bg-night px-6 text-center text-crema">
      <div><p className="eyebrow text-aurum">404</p><h1 className="h-display mt-3 text-6xl">The light moved on.</h1><p className="mt-4 text-oat">We couldn’t find that page.</p><Link href="/" className="btn btn-gold mt-8">Back to Aurevo</Link></div>
    </main>
  );
}
