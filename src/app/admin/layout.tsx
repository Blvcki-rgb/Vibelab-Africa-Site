import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Admin VibeLab" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-screen">{children}</div>;
}
