import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { href, routes } from "@/lib/routes";
import { LanguageSwitch } from "./LanguageSwitch";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = routes.map((r) => ({ href: href(locale, r.key), label: dict.nav[r.key] }));

  return (
    <header className="sticky top-0 z-40 border-b border-ink/15 bg-cream/95 backdrop-blur-sm">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:h-20 sm:gap-3 sm:px-6 lg:px-8">
        <Link
          href={href(locale, "home")}
          className="shrink-0 rounded-sm"
          aria-label={`NUKKAD — ${dict.nav.home}`}
        >
          <Logo
            variant="secondary"
            height={44}
            decorative
            priority
            className="h-7 w-auto min-[400px]:h-8 sm:h-11"
          />
        </Link>

        <nav aria-label={dict.common.mainNavigation} className="ml-auto hidden lg:block">
          <NavLinks items={items} />
        </nav>

        <LanguageSwitch current={locale} label={dict.common.language} className="ml-auto lg:ml-4" />
        <MobileMenu items={items} openLabel={dict.common.openMenu} closeLabel={dict.common.closeMenu} />
      </div>
    </header>
  );
}
