import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { BRANCHES, CONTACT, STORE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Condiciones de compra, promociones, delivery, retiro en tienda, cambios y servicio de peluquería de PET SMART.",
};

const ACTUALIZADO = "18 de octubre de 2026";

interface SeccionProps {
  id: string;
  titulo: string;
  children: React.ReactNode;
}

const Seccion = ({ id, titulo, children }: SeccionProps) => (
  <section id={id} className="scroll-mt-40 border-t border-line pt-8 first:border-0 first:pt-0">
    <h2 className="font-display text-xl font-semibold text-ink md:text-2xl">{titulo}</h2>
    <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-ink-body md:text-base">
      {children}
    </div>
  </section>
);

const INDICE = [
  { id: "quienes", label: "Quiénes somos" },
  { id: "precios", label: "Precios y promociones" },
  { id: "pedidos", label: "Pedidos y stock" },
  { id: "pagos", label: "Pagos" },
  { id: "entrega", label: "Delivery y retiro" },
  { id: "cambios", label: "Cambios y devoluciones" },
  { id: "peluqueria", label: "Peluquería" },
  { id: "cuentas", label: "Cuentas y datos" },
  { id: "reclamos", label: "Reclamos" },
];

const TermsPage = () => (
  <>
    <PageHero
      eyebrow="Legales"
      title="Términos y condiciones"
      subtitle={`Las reglas con las que trabajamos. Última actualización: ${ACTUALIZADO}.`}
    />

    <div className="bg-white px-4 py-10 md:px-8 md:py-14 lg:px-[72px]">
      <div className="mx-auto grid max-w-[1296px] grid-cols-1 gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
        <nav
          aria-label="Contenido"
          className="rounded-card border border-line bg-surface p-4 lg:sticky lg:top-[calc(var(--header-h)+1rem)]"
        >
          <p className="font-display text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Contenido
          </p>
          <ul className="mt-3 flex flex-col gap-1.5">
            {INDICE.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-sm text-ink-body transition-colors hover:text-brand-600"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex min-w-0 flex-col gap-8">
          <Seccion id="quienes" titulo="Quiénes somos">
            <p>
              {STORE.name} es un negocio de venta de productos para mascotas y servicio de
              peluquería canina y felina en Cochabamba, Bolivia. Atendemos en{" "}
              {BRANCHES.map((b) => b.name).join(" y ")} y por esta tienda online.
            </p>
            <p>
              Al hacer un pedido, reservar un turno o crear una cuenta en este sitio, aceptás
              estas condiciones. Si no estás de acuerdo con alguna, escribinos antes de comprar
              al {CONTACT.phoneLabel}.
            </p>
          </Seccion>

          <Seccion id="precios" titulo="Precios y promociones">
            <p>
              Todos los precios están expresados en bolivianos (Bs) e incluyen los impuestos que
              correspondan.
            </p>
            <p>
              <strong className="text-ink">
                Las promociones publicadas en esta web son exclusivas de la web.
              </strong>{" "}
              No se aplican en el mostrador, no se acumulan con otras promociones, descuentos de
              temporada o acuerdos particulares, y no son canjeables por dinero. Para que un
              descuento web sea válido tiene que estar vigente en el momento en que se registra el
              pedido y figurar en el detalle de ese pedido.
            </p>
            <p>
              Cada promoción tiene fecha de inicio y de fin, y puede tener un límite de unidades
              por persona o por stock disponible. Terminada la vigencia, el producto vuelve a su
              precio habitual sin aviso previo.
            </p>
            <p>
              Hacemos lo posible por mantener los precios al día. Si por un error de carga o una
              falla del sistema un producto apareciera con un precio equivocado, te lo avisamos
              antes de preparar el pedido y podés confirmarlo al precio correcto o cancelarlo sin
              costo. Un precio mal publicado no nos obliga a vender a ese valor.
            </p>
            <p>
              Las fotos son de referencia. Los envases, colores y presentaciones pueden variar
              según el lote que manda el proveedor.
            </p>
          </Seccion>

          <Seccion id="pedidos" titulo="Pedidos y stock">
            <p>
              Un pedido hecho en la web es una <em>solicitud de compra</em>. Queda confirmado
              recién cuando verificamos el stock real y te lo avisamos por WhatsApp o por correo.
            </p>
            <p>
              El stock que ves es el del sistema y puede cambiar entre que lo mirás y lo pedís,
              porque también vendemos en el mostrador. Si falta algo, te ofrecemos reemplazarlo,
              esperar reposición o descontarlo del total.
            </p>
            <p>
              Podemos no dar curso a un pedido cuando los datos de contacto son falsos o
              incompletos, cuando no logramos comunicarnos, cuando hay un uso abusivo de
              promociones, o cuando el pedido tiene un destino fuera de nuestra zona de cobertura.
            </p>
          </Seccion>

          <Seccion id="pagos" titulo="Pagos">
            <p>Aceptamos efectivo, QR y transferencia bancaria.</p>
            <p>
              Los pedidos con <strong className="text-ink">delivery se pagan por adelantado</strong>.
              Te enviamos el QR por el chat y salimos a entregar cuando recibimos el comprobante.
            </p>
            <p>
              Los pedidos con <strong className="text-ink">retiro en tienda</strong> podés pagarlos
              por adelantado o al retirarlos; vos elegís al cerrar el pedido.
            </p>
            <p>
              Guardamos los comprobantes de pago como respaldo. No pedimos ni guardamos datos de
              tarjetas: si alguien te los pide a nombre nuestro, no se los des y avisanos.
            </p>
          </Seccion>

          <Seccion id="entrega" titulo="Delivery y retiro en tienda">
            <p>
              Entregamos dentro de la zona que acordemos por WhatsApp. El costo del envío, si
              corresponde, se informa antes de confirmar el pedido.
            </p>
            <p>
              Los plazos de entrega son estimados y dependen del tránsito, el clima y la
              disponibilidad. Hacemos lo posible por cumplirlos, pero una demora razonable no da
              lugar a compensación.
            </p>
            <p>
              Para entregar necesitamos una dirección correcta y alguien que reciba. Si no hay
              nadie, coordinamos un segundo intento; a partir del tercero puede aplicarse un costo
              adicional de envío.
            </p>
            <p>
              Los pedidos para retirar quedan reservados <strong className="text-ink">5 días
              corridos</strong>. Pasado ese plazo, los productos vuelven al stock. Si ya estaban
              pagados, el importe queda como crédito a tu favor.
            </p>
          </Seccion>

          <Seccion id="cambios" titulo="Cambios y devoluciones">
            <p>
              Revisá tu pedido al recibirlo. Si algo llegó roto, vencido o equivocado, avisanos
              dentro de las <strong className="text-ink">24 horas</strong> con una foto y lo
              resolvemos: lo cambiamos o te devolvemos el importe.
            </p>
            <p>
              Fuera de ese caso, aceptamos cambios dentro de los{" "}
              <strong className="text-ink">7 días corridos</strong>, presentando el recibo y con el
              producto sin abrir, sin usar y en su envase original.
            </p>
            <p>
              Por razones de sanidad e inocuidad <strong className="text-ink">no se aceptan
              cambios ni devoluciones</strong> de: alimento a granel o fraccionado, alimento con el
              envase abierto, medicamentos, antiparasitarios y vacunas, productos de higiene
              abiertos, ni productos en promoción o liquidación.
            </p>
            <p>
              Los productos se venden tal como los entrega el fabricante. Cualquier garantía por
              defecto de fábrica, composición o efecto del producto corresponde al fabricante;
              nosotros te acompañamos en el reclamo, pero no respondemos por el uso que se le dé
              al producto ni por reacciones particulares de cada animal. Ante cualquier síntoma,
              consultá con un veterinario: no damos diagnósticos ni tratamientos.
            </p>
          </Seccion>

          <Seccion id="peluqueria" titulo="Peluquería">
            <p>
              Los precios publicados son <strong className="text-ink">estimados</strong> y se
              calculan por tamaño del animal. El precio final puede variar según el estado real
              del pelo: nudos, enredos severos, suciedad excesiva o pelo muy largo requieren más
              tiempo y producto. Si hay diferencia, te la informamos antes de empezar.
            </p>
            <p>
              Para atender a tu mascota necesitamos que esté{" "}
              <strong className="text-ink">sana y con las vacunas al día</strong>. Avisanos antes
              del turno si tiene alguna condición de salud, alergia, cirugía reciente, problemas de
              piel, miedo al secador o historial de mordida.
            </p>
            <p>
              Podemos suspender o interrumpir un servicio si el animal muestra agresividad, pánico
              o signos de dolor, o si detectamos una condición que haga riesgoso continuar. En ese
              caso se cobra únicamente lo efectivamente realizado.
            </p>
            <p>
              Durante el baño y el corte pueden aparecer problemas de piel que estaban tapados por
              el pelo (dermatitis, heridas, parásitos, bultos). Te los mostramos al entregarla.
              Que se hagan visibles después del corte no significa que se hayan producido en el
              servicio.
            </p>
            <p>
              En pelajes muy enredados, el rapado puede ser la única opción segura. En esos casos
              lo conversamos antes, pero el resultado estético queda sujeto al estado del pelo.
            </p>
            <p>
              Llegá a horario. Pasados <strong className="text-ink">15 minutos</strong> de tolerancia
              podemos reprogramar el turno. Si no vas a poder venir, avisanos con al menos{" "}
              <strong className="text-ink">2 horas</strong> de anticipación. Las ausencias
              repetidas sin aviso pueden requerir seña para reservar.
            </p>
            <p>
              Pasada <strong className="text-ink">1 hora</strong> del horario de entrega acordado
              sin que retires a tu mascota ni respondas los mensajes, puede aplicarse un cargo por
              guardería.
            </p>
            <p>
              Si no te gusta el resultado, decínoslo{" "}
              <strong className="text-ink">en el momento de la entrega</strong>: lo corregimos sin
              cargo en lo que sea posible. Un reclamo hecho días después, con el pelo ya crecido o
              intervenido en otro lado, no puede verificarse.
            </p>
            <p>
              Podemos tomar fotos del antes y después con fines de registro y difusión. Si no
              querés que usemos las fotos de tu mascota, decínoslo y no las publicamos.
            </p>
          </Seccion>

          <Seccion id="cuentas" titulo="Cuentas y datos personales">
            <p>
              Para hacer pedidos desde tu cuenta necesitamos que confirmes tu correo con el código
              que te enviamos. Es lo que nos permite saber que el pedido lo hizo una persona real.
            </p>
            <p>
              Sos responsable de los datos que cargás y de mantener tu contraseña a salvo. Si
              detectás un uso raro de tu cuenta, avisanos.
            </p>
            <p>
              Usamos tus datos únicamente para procesar pedidos, coordinar turnos y comunicarnos
              con vos. No los vendemos ni los cedemos a terceros ajenos a la operación. Podés
              pedirnos que corrijamos o eliminemos tu cuenta escribiéndonos al{" "}
              {CONTACT.phoneLabel}.
            </p>
            <p>
              Podemos suspender cuentas que hagan un uso abusivo del sistema: pedidos falsos,
              reventa de promociones, o reclamos reiterados sin sustento.
            </p>
          </Seccion>

          <Seccion id="reclamos" titulo="Reclamos y contacto">
            <p>
              Cualquier reclamo se atiende por WhatsApp al {CONTACT.phoneLabel} o en cualquiera de
              nuestras sucursales, presentando el recibo o el código del pedido.
            </p>
            <p>
              Intentamos resolver todo de buena fe y en el momento. Estas condiciones se rigen por
              la legislación boliviana vigente.
            </p>
            <p>
              Podemos actualizar estos términos cuando cambien nuestros procesos. La versión que
              se aplica a tu compra es la que estaba publicada el día en que la hiciste.
            </p>
            <p className="pt-2">
              <Link href="/sucursales" className="font-semibold text-brand-600 hover:underline">
                Ver nuestras sucursales y horarios
              </Link>
            </p>
          </Seccion>
        </div>
      </div>
    </div>
  </>
);

export default TermsPage;
