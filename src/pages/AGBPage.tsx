import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Link>
        <h1 className="text-2xl font-bold mb-6">Allgemeine Geschäftsbedingungen (AGB) – NutrioTrack</h1>
        <div className="prose prose-sm dark:prose-invert space-y-6 text-muted-foreground">

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">1. Geltungsbereich</h2>
            <p>Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Anwendung NutrioTrack, der Website nutriotrack.com sowie aller zugehörigen Web-, App- und PWA-Versionen.</p>
            <p>Anbieter der Anwendung ist:</p>
            <p><strong>Harbor Studios</strong></p>
            <p>Calle Calima Sector 1, Riosol 167<br />35627 Costa Calma<br />Spanien</p>
            <p>E-Mail: <a href="mailto:support@harborstudios.app" className="text-primary hover:underline">support@harborstudios.app</a></p>
            <p>Website: <a href="https://harborstudios.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://harborstudios.app</a></p>
            <p>Mit der Nutzung von NutrioTrack erklärst du dich mit diesen AGB einverstanden.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">2. Beschreibung der Leistungen</h2>
            <p>NutrioTrack ist eine digitale Anwendung zur Erfassung, Analyse und Auswertung von Ernährungs- und Gesundheitsdaten.</p>
            <p>Die App ermöglicht insbesondere:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>das Erfassen von Mahlzeiten und Lebensmitteln</li>
              <li>das Analysieren von Nährwerten</li>
              <li>das Verfolgen persönlicher Ziele und Fortschritte</li>
              <li>das Speichern persönlicher Ernährungsdaten</li>
              <li>das Anzeigen von Statistiken und Badges</li>
            </ul>
            <p>Die Nutzung der App erfolgt ausschließlich zu Informations- und Selbstkontrollzwecken.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">3. Benutzerkonto</h2>
            <p>Für bestimmte Funktionen der App kann die Erstellung eines Benutzerkontos erforderlich sein.</p>
            <p>Der Nutzer verpflichtet sich:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>bei der Registrierung korrekte Angaben zu machen</li>
              <li>seine Zugangsdaten vertraulich zu behandeln</li>
              <li>keine unbefugten Zugriffe zuzulassen</li>
            </ul>
            <p>Der Nutzer ist für alle Aktivitäten verantwortlich, die über sein Konto erfolgen.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">4. Nutzung der Anwendung</h2>
            <p>Die Nutzung von NutrioTrack erfolgt auf eigene Verantwortung.</p>
            <p>Die Anwendung darf nicht verwendet werden:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>für rechtswidrige Zwecke</li>
              <li>zur Manipulation oder Störung der Plattform</li>
              <li>zur missbräuchlichen Nutzung der technischen Infrastruktur</li>
            </ul>
            <p>Harbor Studios behält sich das Recht vor, Konten bei Verstößen gegen diese Bedingungen zu sperren oder zu löschen.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">5. Gesundheitshinweis</h2>
            <p>NutrioTrack dient ausschließlich der persönlichen Dokumentation und Analyse von Ernährungsgewohnheiten.</p>
            <p>Die bereitgestellten Informationen stellen keine medizinische Beratung dar und ersetzen nicht die Beratung durch medizinisches Fachpersonal.</p>
            <p>Bei gesundheitlichen Fragen oder Beschwerden sollte immer ein Arzt oder qualifizierter Gesundheitsdienstleister konsultiert werden.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">6. Verfügbarkeit der Dienste</h2>
            <p>Wir bemühen uns, die Anwendung möglichst unterbrechungsfrei bereitzustellen.</p>
            <p>Eine permanente Verfügbarkeit kann jedoch nicht garantiert werden. Wartungsarbeiten, technische Probleme oder externe Einflüsse können zu vorübergehenden Einschränkungen führen.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">7. Haftungsbeschränkung</h2>
            <p>Harbor Studios haftet nur für Schäden, die durch vorsätzliches oder grob fahrlässiges Verhalten verursacht wurden.</p>
            <p>Für indirekte Schäden, Datenverlust oder Nutzungsausfälle wird keine Haftung übernommen, soweit gesetzlich zulässig.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">8. Urheberrechte</h2>
            <p>Alle Inhalte der Anwendung NutrioTrack, einschließlich Design, Software, Texte, Logos und Grafiken, sind urheberrechtlich geschützt.</p>
            <p>Eine Nutzung, Vervielfältigung oder Verbreitung ohne vorherige schriftliche Zustimmung von Harbor Studios ist nicht gestattet.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">9. Änderungen der AGB</h2>
            <p>Harbor Studios behält sich das Recht vor, diese AGB jederzeit zu ändern.</p>
            <p>Die jeweils aktuelle Version ist jederzeit innerhalb der App sowie auf der Website verfügbar.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">10. Anwendbares Recht</h2>
            <p>Es gilt das Recht des Landes Spanien, soweit dem keine zwingenden gesetzlichen Vorschriften entgegenstehen.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">11. Kontakt</h2>
            <p>Bei Fragen zu diesen AGB kannst du uns jederzeit kontaktieren:</p>
            <p><a href="mailto:support@harborstudios.app" className="text-primary hover:underline">support@harborstudios.app</a></p>
          </section>

        </div>
      </div>
    </div>
  );
}