"use client";

import { useMemo, useState } from "react";
import { ProductActions } from "./ProductActions";
import { ProductImage } from "./ProductImage";
import { Badge } from "@/components/ui/Badge";
import { IconCheck } from "@/components/ui/icons";
import { Price } from "@/components/ui/Price";
import { formatPrice, stockLabel } from "@/lib/format";
import type { Comprable, StoreProduct, VariantOption } from "@/lib/types";

const mismaCombinacion = (a: Record<string, string>, b: Record<string, string>) =>
  Object.keys(b).every((eje) => a[eje] === b[eje]);

const etiqueta = (values: Record<string, string>) => Object.values(values).join(" / ");

const inicial = (variants: VariantOption[]) => variants.find((v) => v.stock > 0) ?? variants[0];

export const VariantPicker = ({ product }: { product: StoreProduct }) => {
  const [elegido, setElegido] = useState<Record<string, string>>(
    () => inicial(product.variants)?.values ?? {}
  );

  const variante = useMemo(
    () => product.variants.find((v) => mismaCombinacion(v.values, elegido)) ?? null,
    [product.variants, elegido]
  );

  /** Solo tiene sentido mostrar fotos si alguna variante trae la suya. */
  const conFoto = product.variants.some((v) => v.photo);

  const hayStockPara = (eje: string, valor: string) =>
    product.variants.some((v) => v.values[eje] === valor && v.stock > 0);

  /**
   * Al tocar un valor no se deja al cliente en una combinación que no existe:
   * se completan los otros ejes con la primera variante que sí exista,
   * prefiriendo las que tienen stock.
   */
  const elegir = (eje: string, valor: string) => {
    const candidatas = product.variants.filter((v) => v.values[eje] === valor);
    const exacta = candidatas.find((v) => mismaCombinacion(v.values, { ...elegido, [eje]: valor }));
    const destino = exacta ?? candidatas.find((v) => v.stock > 0) ?? candidatas[0];

    setElegido(destino ? destino.values : { ...elegido, [eje]: valor });
  };

  const comprable: Comprable | null = variante
    ? {
        id: variante.id,
        name: `${product.name} ${etiqueta(variante.values)}`.trim(),
        photo: variante.photo ?? product.photo,
        price: variante.price ?? 0,
        stock: variante.stock,
        branches: variante.branches,
      }
    : null;

  const stock = stockLabel(variante?.stock ?? 0);

  return (
    <div className="flex flex-col gap-7">
      {conFoto ? (
        <div>
          <h2 className="font-display text-base font-semibold text-ink">Elegí una opción</h2>

          <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {product.variants.map((v) => {
              const activa = variante?.id === v.id;
              const agotada = v.stock <= 0;

              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setElegido(v.values)}
                  aria-pressed={activa}
                  className={`group relative overflow-hidden rounded-card border-2 text-left transition-colors ${
                    activa ? "border-ink" : "border-line hover:border-ink-faint"
                  }`}
                >
                  <ProductImage
                    src={v.photo ?? product.photo}
                    alt={etiqueta(v.values)}
                    className={`aspect-square w-full ${agotada ? "opacity-40" : ""}`}
                  />

                  {activa ? (
                    <span className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-ink text-white">
                      <IconCheck className="h-3.5 w-3.5" />
                    </span>
                  ) : null}

                  <span className="block px-2 py-1.5">
                    <span className="block truncate font-display text-[11px] font-semibold text-ink">
                      {etiqueta(v.values)}
                    </span>
                    <span className="block text-[11px] text-ink-soft">
                      {agotada ? "Sin stock" : formatPrice(v.price ?? 0)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        product.axes.map((eje) => (
          <div key={eje.name}>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-base font-semibold text-ink">{eje.name}</h2>
              <span className="text-sm text-ink-soft">{elegido[eje.name] ?? "Elegí uno"}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {eje.values.map((valor) => {
                const activo = elegido[eje.name] === valor;
                const disponible = hayStockPara(eje.name, valor);

                return (
                  <button
                    key={valor}
                    type="button"
                    onClick={() => elegir(eje.name, valor)}
                    aria-pressed={activo}
                    className={`h-11 min-w-[56px] rounded-btn border-2 px-4 font-display text-sm font-semibold transition-colors ${
                      activo
                        ? "border-ink bg-ink text-white"
                        : disponible
                          ? "border-line bg-white text-ink hover:border-ink-faint"
                          : "border-line bg-surface text-ink-faint line-through"
                    }`}
                  >
                    {valor}
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}

      {variante ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-surface px-4 py-3">
          <div>
            <p className="font-display text-sm font-semibold text-ink">
              {etiqueta(variante.values)}
            </p>
            <Price value={variante.price ?? 0} oldValue={variante.oldPrice} />
          </div>
          <Badge tone={stock.tone}>{stock.text}</Badge>
        </div>
      ) : null}

      {variante && variante.branches.length > 0 ? (
        <div>
          <h2 className="font-display text-base font-semibold text-ink">Disponible en</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {variante.branches.map((branch) => (
              <li
                key={branch.id}
                className="flex items-center justify-between gap-3 rounded-btn border border-line bg-white px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-display text-sm font-semibold text-ink">{branch.name}</p>
                  <p className="truncate text-sm text-ink-soft">{branch.address}</p>
                </div>
                <Badge tone={branch.quantity <= 5 ? "low" : "ok"}>{branch.quantity} u.</Badge>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {comprable && comprable.stock > 0 ? <ProductActions product={comprable} /> : null}
    </div>
  );
};
