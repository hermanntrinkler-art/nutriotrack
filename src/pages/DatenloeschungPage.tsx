import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DatenloeschungPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Link>
        <h1 className="text-2xl font-bold mb-6">Datenlöschung – NutrioTrack</h1>
        <div className="prose prose-sm dark:prose-invert space-y-6 text-muted-foreground">

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">1. Allgemeine Hinweise</h2>
            <p>Bei NutrioTrack hast du jederzeit die Möglichkeit, dein Benutzerkonto sowie alle damit verbundenen personenbezogenen Daten löschen zu lassen.</p>
            <p>Wir respektieren dein Recht auf Datenlöschung gemäß der Datenschutz-Grundverordnung (DSGVO).</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">2. Welche Daten gespeichert werden</h2>
            <p>Im Zusammenhang mit der Nutzung von NutrioTrack können folgende Daten gespeichert werden:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Kontodaten (z. B. E-Mail-Adresse oder Login-Daten)</li>
              <li>Profildaten (z. B. Benutzername oder Profilbild)</li>
              <li>Ernährungsdaten und erfasste Mahlzeiten</li>
              <li>Körper- und Fortschrittsdaten (z. B. Gewicht oder persönliche Ziele)</li>
              <li>technische Nutzungsdaten zur Bereitstellung der App</li>
            </ul>
            <p>Diese Daten werden ausschließlich zur Bereitstellung der Funktionen von NutrioTrack verwendet.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">3. Löschung deines Kontos</h2>
            <p>Du kannst dein Benutzerkonto und alle damit verbundenen Daten jederzeit löschen lassen.</p>
            <p>Dafür stehen dir folgende Möglichkeiten zur Verfügung:</p>
            <h3 className="text-base font-semibold text-foreground">Löschung innerhalb der App</h3>
            <p>Du kannst dein Konto direkt in der NutrioTrack-App löschen. Gehe dazu in dein <strong>Profil</strong> und tippe ganz unten auf <strong>„Konto löschen"</strong>. Nach Bestätigung werden alle deine Daten unwiderruflich gelöscht.</p>
            <h3 className="text-base font-semibold text-foreground">Löschung per Anfrage</h3>
            <p>Alternativ kannst du eine Löschanfrage per E-Mail senden an:</p>
            <p><a href="mailto:support@harborstudios.app" className="text-primary hover:underline">support@harborstudios.app</a></p>
            <p>Bitte gib in deiner Anfrage die E-Mail-Adresse an, mit der dein Konto registriert wurde.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">4. Was bei der Löschung passiert</h2>
            <p>Nach Eingang deiner Anfrage werden folgende Daten gelöscht:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>dein Benutzerkonto</li>
              <li>alle gespeicherten Ernährungs- und Mahlzeitendaten</li>
              <li>Profildaten und Fortschrittsdaten</li>
              <li>weitere personenbezogene Daten, die mit deinem Konto verknüpft sind</li>
            </ul>
            <p>Die Löschung erfolgt so schnell wie möglich, spätestens jedoch innerhalb der gesetzlich vorgesehenen Fristen.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">5. Gesetzliche Aufbewahrungspflichten</h2>
            <p>In bestimmten Fällen können Daten aufgrund gesetzlicher Verpflichtungen für einen bestimmten Zeitraum gespeichert bleiben.</p>
            <p>In solchen Fällen wird die Verarbeitung dieser Daten eingeschränkt und sie werden ausschließlich zur Erfüllung gesetzlicher Verpflichtungen gespeichert.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">6. Kontakt</h2>
            <p>Wenn du Fragen zur Datenlöschung oder zur Verarbeitung deiner Daten hast, kannst du uns jederzeit kontaktieren:</p>
            <p><strong>Harbor Studios</strong></p>
            <p>Calle Calima Sector 1, Riosol 167<br />35627 Costa Calma<br />Spanien</p>
            <p><a href="mailto:support@harborstudios.app" className="text-primary hover:underline">support@harborstudios.app</a></p>
          </section>

        </div>
      </div>
    </div>
  );
}