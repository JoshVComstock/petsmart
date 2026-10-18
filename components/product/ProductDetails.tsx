import Markdown from "react-markdown";

/**
 * Ficha larga del producto. El texto lo escribe la tienda en Markdown desde
 * el ERP, así que acá solo se le da estilo: nada de HTML crudo.
 */
export const ProductDetails = ({ markdown }: { markdown: string }) => (
  <section className="mt-12 border-t border-line pt-8">
    <h2 className="font-display text-xl font-semibold text-ink md:text-2xl">
      Sobre este producto
    </h2>

    <div className="mt-5 max-w-[68ch] text-base leading-relaxed text-ink-body">
      <Markdown
        components={{
          h1: ({ children }) => (
            <h3 className="mt-8 font-display text-lg font-semibold text-ink first:mt-0">
              {children}
            </h3>
          ),
          h2: ({ children }) => (
            <h3 className="mt-8 font-display text-lg font-semibold text-ink first:mt-0">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="mt-6 font-display text-base font-semibold text-ink first:mt-0">
              {children}
            </h4>
          ),
          p: ({ children }) => <p className="mt-3">{children}</p>,
          ul: ({ children }) => <ul className="mt-3 flex flex-col gap-1.5">{children}</ul>,
          ol: ({ children }) => (
            <ol className="mt-3 flex list-decimal flex-col gap-1.5 pl-5">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="relative pl-5 before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand-400">
              {children}
            </li>
          ),
          strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
          blockquote: ({ children }) => (
            <blockquote className="mt-4 rounded-card border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700 [&>p]:mt-0">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              rel="noopener noreferrer"
              className="font-semibold text-brand-600 underline underline-offset-2"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="mt-6 border-line" />,
        }}
      >
        {markdown}
      </Markdown>
    </div>
  </section>
);
