import { Header, MobileNav } from "@/components/shared";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
