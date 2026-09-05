/** Campo de formulario con la caja y la tipografía del sistema. */

interface Props {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  autoComplete?: string;
  hint?: string;
}

export const FormField = ({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
  autoComplete,
  hint,
}: Props) => (
  <label className="block">
    <span className="font-display text-xs font-semibold text-ink-soft">{label}</span>
    <input
      name={name}
      type={type}
      required={required}
      placeholder={placeholder}
      defaultValue={defaultValue}
      autoComplete={autoComplete}
      className="mt-1.5 w-full rounded-btn border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ink"
    />
    {hint ? <span className="mt-1.5 block text-xs text-ink-soft">{hint}</span> : null}
  </label>
);
