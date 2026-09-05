import { EmptyState } from "@/components/ui/EmptyState";
import { IconWifiOff } from "@/components/ui/icons";

export const metadata = { title: "Sin conexión" };

const OfflinePage = () => (
  <div className="mx-auto max-w-lg px-4 py-20">
    <EmptyState
      icon={<IconWifiOff className="h-7 w-7" />}
      title="Estás sin conexión"
      message="Revisá tu internet y volvé a intentar. Tu carrito quedó guardado."
      actionHref="/"
      actionLabel="Reintentar"
    />
  </div>
);

export default OfflinePage;
