import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ContentProvider } from "@/components/ContentProvider";
import { getPublicContent } from "@/lib/content";

/** Mise en page du site public : menu flottant + pied de page. */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const content = await getPublicContent();
  return (
    <ContentProvider value={content}>
      <Nav />
      <main>{children}</main>
      <Footer />
    </ContentProvider>
  );
}
