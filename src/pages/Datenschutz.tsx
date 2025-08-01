import React from 'react';
import { Container } from '../components/Container';

export function Datenschutz() {
  return (
    <Container className="py-20">
      <h1 className="text-3xl font-bold text-white">Datenschutzerklärung</h1>
      <div className="mt-8 space-y-6 text-gray-400">
        <section>
          <h2 className="text-xl font-semibold text-white">1. Verantwortlicher</h2>
          <p className="mt-4">
            Verantwortlicher für die Datenverarbeitung auf dieser Website ist:
          </p>
          <p className="mt-2">
            Red-It<br />
            Manuel Kramm<br />
            Bahnhofstraße 7<br />
            45721 Haltern am See<br />
            E-Mail: register@red-it.org
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">2. Datenschutz auf einen Blick</h2>
          <p className="mt-4">
            Diese Website verarbeitet keine personenbezogenen Daten. Alle Tools und Funktionen arbeiten vollständig lokal in Ihrem Browser. Es werden keine Daten an Server übertragen oder gespeichert.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">3. Lokale Datenverarbeitung</h2>
          <p className="mt-4">
            Alle auf dieser Website bereitgestellten Tools (JSON Validator, Code Beautifier, Passwort-Generator, etc.) verarbeiten Ihre Daten ausschließlich lokal in Ihrem Browser. Die Daten verlassen niemals Ihr Gerät und werden nicht an externe Server übertragen.
          </p>
          <p className="mt-2">
            Für die lokale Speicherung von Einstellungen und Daten nutzen wir die Browser-APIs IndexedDB und LocalStorage. Diese Daten verbleiben auf Ihrem Gerät und können jederzeit über die Browser-Einstellungen gelöscht werden.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">4. Cookies und Tracking</h2>
          <p className="mt-2">
            Diese Website verwendet keine Cookies für Analyse-, Tracking- oder Werbezwecke. Es werden keine Benutzerprofile erstellt und keine Nutzungsdaten erfasst.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">5. Externe Links</h2>
          <p className="mt-4">
            Diese Website enthält Links zu externen Websites (z.B. Ko-fi). Beim Klick auf diese Links verlassen Sie unsere Website. Wir haben keinen Einfluss auf die Datenschutzpraktiken dieser externen Anbieter. Bitte informieren Sie sich über deren Datenschutzerklärungen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">6. Ihre Rechte</h2>
          <p className="mt-4">
            Da wir keine personenbezogenen Daten verarbeiten, fallen die meisten DSGVO-Rechte nicht an. Sollten Sie dennoch Fragen zum Datenschutz haben, können Sie uns unter register@red-it.org kontaktieren.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">7. Änderungen der Datenschutzerklärung</h2>
          <p className="mt-4">
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
          </p>
        </section>
      </div>
    </Container>
  );
}