import type { Metadata } from "next";
import { DeliveryLinks } from "@/components/sections/DeliveryLinks";
import { ContactActions, SeatingPolicy } from "@/components/sections/VisitDetails";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/lib/content";
import { formatPhone, telHref } from "@/lib/format";
import { resolveLocale } from "@/lib/locale-params";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { dict } = await resolveLocale(params);
  return { title: dict.pages.contactTitle, description: dict.pages.contactIntro };
}

/** Phone, WhatsApp and email only — no forms, so nothing to spam and no data to store. */
export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <>
      <PageHeader
        eyebrow="Baat karein?"
        title={dict.pages.contactTitle}
        intro={<p>{dict.pages.contactIntro}</p>}
      />
      <Container className="space-y-10 py-14">
        <div className="space-y-4 text-lg">
          <p>
            <a href={telHref(site.phone)} className="font-display text-4xl text-red">
              {formatPhone(site.phone)}
            </a>
          </p>
          {site.email && (
            <p>
              <a
                href={`mailto:${site.email}`}
                className="font-semibold text-red underline underline-offset-4"
              >
                {site.email}
              </a>
            </p>
          )}
          <ContactActions dict={dict} size="lg" />
          <DeliveryLinks dict={dict} className="text-ink-muted" />
        </div>
        <SeatingPolicy locale={locale} dict={dict} />
      </Container>
    </>
  );
}
