import { IconCheck } from "@/components/ui/icons";

/** Aviso de resultado de un formulario. Nada si todavía no se envió. */

interface Props {
  ok: boolean;
  message: string;
}

export const FormMessage = ({ ok, message }: Props) => {
  if (!message) return null;

  return (
    <p
      role="status"
      className={`flex items-start gap-2 rounded-btn px-4 py-3 text-sm ${
        ok ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
      }`}
    >
      {ok ? <IconCheck className="mt-0.5 h-4 w-4 shrink-0" /> : null}
      {message}
    </p>
  );
};
