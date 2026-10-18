import { AccountButton } from "./AccountButton";
import { CartButton } from "./CartButton";
import { Logo } from "./Logo";
import { MainNav } from "./MainNav";
import { SearchBar } from "./SearchBar";
import { TopBar } from "./TopBar";

/**
 * Flota sobre la página: no ocupa lugar en el flujo, el contenido pasa por
 * debajo. El alto se compensa con --header-h, que la portada anula para que
 * su imagen llegue hasta arriba.
 */
export const Header = () => (
  <header className="fixed inset-x-0 top-0 z-50">
    <TopBar />

    <div className="relative">
      <div className="relative px-4 py-3 md:px-8 md:py-4 lg:px-[72px]">
        <div className="mx-auto flex max-w-[1296px] items-center justify-between gap-3 rounded-pill border border-line bg-white/95 px-4 py-3 shadow-float backdrop-blur-md md:gap-6 md:px-10 md:py-5">
          <span className="md:hidden">
            <Logo iconOnly />
          </span>
          <span className="hidden md:block">
            <Logo />
          </span>

          <MainNav />

          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 md:gap-5">
            <SearchBar className="min-w-0 flex-1 md:max-w-[240px] md:flex-none md:grow-0 md:basis-[240px] lg:basis-[280px]" />
            <AccountButton />
            <CartButton />
          </div>
        </div>
      </div>
    </div>
  </header>
);
