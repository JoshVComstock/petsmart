import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";

const TiendaLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-full flex-col">
    <Header />
    <main className="min-h-[70vh] flex-1">{children}</main>
    <Footer />
    <BottomNav />
    <WhatsAppFab />
  </div>
);

export default TiendaLayout;
