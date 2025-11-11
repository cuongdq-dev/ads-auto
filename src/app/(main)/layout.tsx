import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full md:w-auto">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8 space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
