import { SIZE_LABELS } from "@/lib/config";
import { SPECIES_LABELS, ageLabel, memberCode } from "@/lib/pets";
import {
  IconAlert,
  IconCalendar,
  IconFemale,
  IconMale,
  IconPaw,
  IconRuler,
  IconWeight,
} from "@/components/ui/icons";
import type { Pet } from "@/lib/types";

/** Trama diagonal finita: le da el aire de credencial impresa a la franja. */
const GUILLOCHE = "repeating-linear-gradient(115deg,#fff 0 1px,transparent 1px 7px)";

const VACIO = "—";

const SEX_ICON = { MALE: IconMale, FEMALE: IconFemale } as const;

const Dato = ({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string | null;
  Icon: (p: { className?: string }) => React.ReactNode;
}) => (
  <div className="min-w-0">
    <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
      <Icon className="h-3.5 w-3.5 shrink-0 text-brand-500" />
      {label}
    </dt>
    <dd
      className={`mt-0.5 truncate font-display text-sm font-semibold tabular-nums ${
        value ? "text-ink" : "text-ink-soft"
      }`}
    >
      {value ?? VACIO}
    </dd>
  </div>
);

const Foto = ({ pet }: { pet: Pet }) => (
  <div className="h-[108px] w-[86px] shrink-0 overflow-hidden rounded-[10px] border border-line bg-surface">
    {pet.photo ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={pet.photo}
        alt={pet.name}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    ) : (
      <span className="grid h-full w-full place-items-center bg-brand-50 text-brand-300">
        <IconPaw className="h-9 w-9" />
      </span>
    )}
  </div>
);

export const PetCarnet = ({ pet, footer }: { pet: Pet; footer?: React.ReactNode }) => {
  const sexo = pet.sex && pet.sex !== "UNKNOWN" ? pet.sex : null;
  const SexIcon = sexo ? SEX_ICON[sexo] : IconPaw;

  const subtitulo =
    [pet.species ? SPECIES_LABELS[pet.species] : null, pet.breed].filter(Boolean).join(" · ") ||
    "Sin especie ni raza";

  return (
    <article
      data-carnet={pet.id}
      className="overflow-hidden rounded-card border border-line bg-white shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)]"
    >
      <div className="relative flex items-center justify-between gap-3 bg-ink px-4 py-2.5">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: GUILLOCHE }}
        />
        <span className="relative flex min-w-0 items-center gap-2">
          <span className="h-3.5 w-3.5 shrink-0 rounded-[3px] bg-brand-500" />
          <span className="truncate font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
            Carnet de mascota
          </span>
        </span>
        <span className="relative shrink-0 font-display text-[11px] font-semibold tabular-nums tracking-[0.12em] text-brand-300">
          {pet.id > 0 ? `N° ${memberCode(pet.id)}` : "NUEVA"}
        </span>
      </div>

      <div className="flex gap-4 p-4">
        <Foto pet={pet} />

        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="truncate font-display text-xl font-semibold leading-tight text-ink">
            {pet.name || "Sin nombre"}
          </h3>
          <p className="mt-0.5 truncate text-sm text-ink-soft">{subtitulo}</p>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
            <Dato label="Edad" value={ageLabel(pet.ageMonths)} Icon={IconCalendar} />
            <Dato
              label="Tamaño"
              value={pet.size ? SIZE_LABELS[pet.size] : null}
              Icon={IconRuler}
            />
            <Dato
              label="Peso"
              value={pet.weightKg ? `${pet.weightKg} kg` : null}
              Icon={IconWeight}
            />
            <Dato
              label="Sexo"
              value={sexo ? (sexo === "MALE" ? "Macho" : "Hembra") : null}
              Icon={SexIcon}
            />
          </dl>
        </div>
      </div>

      {pet.allergies ? (
        <div className="border-t border-dashed border-line bg-brand-50/60 px-4 py-2.5">
          <p className="flex items-start gap-2 text-xs leading-snug text-brand-700">
            <IconAlert className="mt-px h-4 w-4 shrink-0" />
            <span className="min-w-0">
              <span className="font-semibold uppercase tracking-[0.08em]">Alergias</span>
              {" · "}
              {pet.allergies}
            </span>
          </p>
        </div>
      ) : null}

      {footer ? (
        <div className="no-imprimir border-t border-line px-4 py-2.5">{footer}</div>
      ) : null}
    </article>
  );
};
