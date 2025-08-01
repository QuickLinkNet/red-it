import React from 'react';
import { Container } from '../components/Container';

export function Impressum() {
  return (
    <Container className="py-20">
      <h1 className="text-3xl font-bold text-white">Impressum</h1>
      <div className="mt-8 space-y-6 text-gray-400">
        <section>
          <h2 className="text-xl font-semibold text-white">Angaben gemäß § 5 TMG</h2>
          <p className="mt-4">
            Red-It<br />
            Manuel Kramm<br />
            Bahnhofstraße 7<br />
            45721 Haltern am See
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">Kontakt</h2>
          <p className="mt-4">
            E-Mail: register@red-it.org
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p className="mt-4">
            Manuel Kramm<br />
            Bahnhofstraße 7<br />
            45721 Haltern am See
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">Haftung für Inhalte</h2>
          <p className="mt-4">
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
          <p className="mt-2">
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">Haftung für Links</h2>
          <p className="mt-4">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
          </p>
          <p className="mt-2">
            Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">Urheberrecht</h2>
          <p className="mt-4">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
          </p>
          <p className="mt-2">
            Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
          </p>
        </section>
      </div>
    </Container>
  );
}