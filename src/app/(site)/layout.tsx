import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSettings } from "@/lib/data";

export const revalidate = 300;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (
    <>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter s={s} />
    </>
  );
}
