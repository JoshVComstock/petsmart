/** Forma que devuelven todas las Server Actions, para useActionState. */
export interface FormState {
  ok: boolean;
  /** Mensaje para mostrarle a la persona. Vacío = todavía no se envió nada. */
  message: string;
}

export const IDLE: FormState = { ok: false, message: "" };

/** Lee un campo de texto del formulario, ya recortado. */
export const field = (form: FormData, name: string): string =>
  String(form.get(name) ?? "").trim();
