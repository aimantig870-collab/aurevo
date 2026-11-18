import Image from "next/image";
import Link from "next/link";

export function Logo({ light = false, className = "h-9 w-auto" }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label="Aurevo — home" className="inline-flex items-center">
      <Image src={light ? "/art/logo/logo-primary-light.svg" : "/art/logo/logo-primary.svg"} alt="Aurevo" width={680} height={160} className={className} priority />
    </Link>
  );
}
