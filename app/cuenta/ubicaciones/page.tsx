import type { Metadata } from "next";
import { AddressManager } from "@/components/account/AddressManager";
import { apiGet } from "@/lib/store-api";
import type { Address } from "@/lib/types";

export const metadata: Metadata = { title: "Ubicaciones" };

const AddressesPage = async () => {
  const result = await apiGet<Address[]>("/account/addresses");

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="font-display text-2xl font-semibold text-ink">Ubicaciones</h2>
        <p className="mt-1.5 text-base text-ink-soft">
          Guardá tus direcciones y el checkout las carga solas en el próximo pedido.
        </p>
      </header>

      <AddressManager addresses={result.data ?? []} />
    </div>
  );
};

export default AddressesPage;
