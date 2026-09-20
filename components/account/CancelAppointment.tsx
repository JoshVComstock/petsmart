"use client";

import { useActionState } from "react";
import { cancelAppointmentAction } from "@/lib/actions/grooming";

export const CancelAppointment = ({ id }: { id: number }) => {
  const [state, submit, sending] = useActionState(cancelAppointmentAction, {
    ok: false,
    message: "",
  });

  return (
    <form action={submit} className="flex items-center gap-3">
      <input type="hidden" name="id" value={id} />
      {state.message && !state.ok ? (
        <span className="text-sm text-brand-600">{state.message}</span>
      ) : null}
      <button
        type="submit"
        disabled={sending}
        className="rounded-btn border border-line px-5 py-2.5 font-display text-sm font-semibold text-ink-body transition-colors hover:bg-surface disabled:opacity-50"
      >
        {sending ? "Cancelando…" : "Cancelar turno"}
      </button>
    </form>
  );
};
