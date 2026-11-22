import type { Metadata } from "next";
import { getBlocks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales et politique de données personnelles de VibeLab Africa.",
};

function formatPhone(n: string) {
  const d = n.replace(/[^\d]/g, "");
  return d ? `+${d}` : "";
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="m-0 text-[22px] font-semibold text-ivory">{title}</h2>
      {children}
    </section>
  );
}

export default async function MentionsLegalesPage() {
  const { legal, contact } = await getBlocks();
  const email = contact.email || "[EMAIL À REMPLACER]";

  return (
    <div className="mx-auto max-w-[820px]" style={{ padding: "clamp(130px,15vw,180px) clamp(20px,4vw,40px) 0" }}>
      <span className="vl-eyebrow">Informations légales</span>
      <h1
        className="mt-4 mb-12 leading-[1.03] font-semibold tracking-[-0.035em]"
        style={{ fontSize: "clamp(40px,6vw,64px)" }}
      >
        Mentions légales
      </h1>

      <div className="flex flex-col gap-10 text-[17px] leading-[1.7] text-muted [&_p]:m-0 [&_p]:whitespace-pre-line">
        <Section title="Éditeur du site">
          <p>VibeLab Africa, une marque de Global Trading Africa.</p>
          <p>
            Forme juridique : {legal.formeJuridique}
            <br />
            Siège social : {legal.siege}
            <br />
            RC : {legal.rc} · ICE : {legal.ice}
            <br />
            Directeur de la publication : {legal.directeur}
          </p>
        </Section>

        <Section title="Contact">
          <p>
            E-mail : {email}
            <br />
            WhatsApp : {formatPhone(contact.whatsappNumber) || "[NUMÉRO À REMPLACER]"}
          </p>
        </Section>

        <Section title="Hébergement">
          <p>{legal.hebergeur}</p>
        </Section>

        <Section title="Propriété intellectuelle">
          <p>
            Les textes, le logo, les visuels et le design de ce site appartiennent à Global Trading Africa, sauf mention
            contraire. Les captures des réalisations sont présentées avec l&apos;accord des clients concernés. Toute
            reproduction sans autorisation est interdite.
          </p>
        </Section>

        <Section title="Données personnelles">
          <p>
            Les informations envoyées via le formulaire « Démarrer un projet » servent uniquement à répondre à votre
            demande et à établir un devis. Elles sont enregistrées dans une base de données accessible seulement à
            l&apos;éditeur, et ne sont ni vendues ni cédées à des tiers.
          </p>
          <p>
            Conformément à la loi n° 09-08 relative à la protection des personnes physiques à l&apos;égard du traitement
            des données à caractère personnel, vous disposez d&apos;un droit d&apos;accès, de rectification et
            d&apos;opposition. Pour l&apos;exercer, écrivez à {email}.
          </p>
          <p>Durée de conservation : {legal.conservation}</p>
        </Section>

        <Section title="Cookies">
          <p>{legal.cookies}</p>
        </Section>

        <p className="font-mono text-[12.5px]">Dernière mise à jour : {legal.miseAJour}</p>
      </div>
    </div>
  );
}
