import { AccountButton } from "./AccountButton";
import { CartButton } from "./CartButton";
import { Logo } from "./Logo";
import { MainNav } from "./MainNav";
import { SearchBar } from "./SearchBar";
import { TopBar } from "./TopBar";

export const Header = () => (
  <>
    <TopBar />

    <div className="sticky top-0 z-50">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-b from-surface via-surface/75 to-transparent" />

      <div className="relative px-4 py-3 md:px-8 md:py-4 lg:px-[72px]">
        <div className="mx-auto flex max-w-[1296px] items-center justify-between gap-4 rounded-pill border border-line bg-white/95 px-4 py-3 shadow-float backdrop-blur-md md:gap-6 md:px-10 md:py-5">
          <span className="md:hidden">
            <Logo iconOnly />
          </span>
          <span className="hidden md:block">
            <Logo />
          </span>

          <MainNav />

          <div className="flex min-w-0 flex-1 items-center justify-end gap-3 md:gap-6">
            <SearchBar className="min-w-0 flex-1 md:max-w-[280px] md:flex-none md:grow-0 md:basis-[280px]" />
            <AccountButton />
            <CartButton />
          </div>
        </div>
      </div>
    </div>
  </>
);
