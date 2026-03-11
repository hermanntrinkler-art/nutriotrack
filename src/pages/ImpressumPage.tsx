import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Link>
        <h1 className="text-2xl font-bold mb-6">Impressum</h1>
        <div className="prose prose-sm dark:prose-invert space-y-6 text-muted-foreground">

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">1. Anbieter / Verantwortlicher</h2>
            <p><strong>Harbor Studios</strong></p>
            <p>Calle Calima Sector 1, Riosol 167<br />35627 Costa Calma<br />Spanien</p>
            <p>E-Mail: <a href="mailto:support@harborstudios.app" className="text-primary hover:underline">support@harborstudios.app</a></p>
            <p>Website: <a href="https://harborstudios.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://harborstudios.app</a></p>
            <p>Betreiber der Anwendung NutrioTrack.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">2. Verantwortlich für den Inhalt</h2>
            <p><strong>Harbor Studios</strong><br />Adresse wie oben.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">3. Geltungsbereich dieses Impressums</h2>
            <p>Dieses Impressum gilt für folgende digitale Angebote von Harbor Studios:</p>
            <p><strong>NutrioTrack</strong> – App zur Erfassung und Analyse von Ernährung, Mahlzeiten und persönlichen Fortschritten.</p>
            <p><a href="https://nutriotrack.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://nutriotrack.com</a></p>
            <p>sowie für alle zugehörigen:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Webanwendungen</li>
              <li>Mobile Apps</li>
              <li>Progressive Web Apps (PWA)</li>
            </ul>
            <p>und sonstige digitale Dienste im Zusammenhang mit NutrioTrack.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">4. Haftung für Inhalte</h2>
            <p>Die Inhalte unserer Anwendungen und Webseiten werden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.</p>
            <p>Als Diensteanbieter sind wir gemäß den allgemeinen gesetzlichen Bestimmungen für eigene Inhalte verantwortlich. Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">5. Haftung für externe Links</h2>
            <p>Unsere Angebote können Links zu externen Webseiten Dritter enthalten, auf deren Inhalte wir keinen Einfluss haben. Für diese fremden Inhalte übernehmen wir keine Gewähr. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">6. Urheberrecht</h2>
            <p>Die durch Harbor Studios erstellten Inhalte und Werke unterliegen dem geltenden Urheberrecht. Eine Vervielfältigung, Bearbeitung, Verbreitung oder sonstige Verwertung außerhalb der Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung von Harbor Studios.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">7. Datenschutz & Rechtliches</h2>
            <p>Informationen zur Verarbeitung personenbezogener Daten sowie zu unseren rechtlichen Bedingungen findest du in unserer Datenschutzerklärung:</p>
            <p><Link to="/datenschutz" className="text-primary hover:underline">https://nutriotrack.com/privacy</Link></p>
          </section>

        </div>
      </div>
    </div>
  );
}
