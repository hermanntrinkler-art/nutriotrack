import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Link>
        <h1 className="text-2xl font-bold mb-6">Datenschutzerklärung – NutrioTrack</h1>
        <div className="prose prose-sm dark:prose-invert space-y-6 text-muted-foreground">

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">1. Verantwortlicher</h2>
            <p><strong>Harbor Studios</strong></p>
            <p>Calle Calima Sector 1, Riosol 167<br />35627 Costa Calma<br />Spanien</p>
            <p>E-Mail: <a href="mailto:support@harborstudios.app" className="text-primary hover:underline">support@harborstudios.app</a></p>
            <p>Website: <a href="https://harborstudios.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://harborstudios.app</a></p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">2. Allgemeine Hinweise</h2>
            <p>Der Schutz deiner personenbezogenen Daten ist uns ein wichtiges Anliegen. In dieser Datenschutzerklärung informieren wir dich darüber, welche Daten bei der Nutzung der App NutrioTrack sowie der Website nutriotrack.com erhoben, verarbeitet und gespeichert werden.</p>
            <p>Personenbezogene Daten sind alle Daten, mit denen du persönlich identifiziert werden kannst.</p>
            <p>Die Verarbeitung deiner Daten erfolgt ausschließlich im Rahmen der geltenden Datenschutzgesetze, insbesondere der Datenschutz-Grundverordnung (DSGVO).</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">3. Erhebung und Verarbeitung personenbezogener Daten</h2>
            <p>Bei der Nutzung von NutrioTrack können verschiedene Arten personenbezogener Daten verarbeitet werden. Dazu gehören insbesondere:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Kontodaten (z. B. E-Mail-Adresse oder Login-Daten)</li>
              <li>Profildaten (z. B. Benutzername oder Profilbild)</li>
              <li>Ernährungsdaten und Mahlzeiteninformationen</li>
              <li>Körperdaten wie Gewicht oder persönliche Ziele</li>
              <li>technische Daten zur Nutzung der App</li>
            </ul>
            <p>Diese Daten werden verarbeitet, um die Funktionen der App bereitzustellen und deine Nutzung zu ermöglichen.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">4. Nutzung der App NutrioTrack</h2>
            <p>Die App NutrioTrack ermöglicht es Nutzern, Mahlzeiten zu erfassen, Ernährungsinformationen zu analysieren und persönliche Fortschritte zu verfolgen.</p>
            <p>Die von dir eingegebenen Daten werden ausschließlich verwendet, um die Funktionen der App bereitzustellen, deine Fortschritte darzustellen und deine persönliche Nutzung der App zu ermöglichen.</p>
            <p>Eine Weitergabe deiner Daten an Dritte erfolgt grundsätzlich nicht, es sei denn:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>dies ist zur Bereitstellung technischer Dienste erforderlich</li>
              <li>du hast ausdrücklich eingewilligt</li>
              <li>eine gesetzliche Verpflichtung besteht.</li>
            </ul>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">5. Speicherung und Sicherheit</h2>
            <p>Deine Daten werden auf sicheren Servern gespeichert und durch geeignete technische und organisatorische Maßnahmen geschützt.</p>
            <p>Wir treffen angemessene Maßnahmen, um deine personenbezogenen Daten vor Verlust, Missbrauch oder unbefugtem Zugriff zu schützen.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">6. Rechte der Nutzer</h2>
            <p>Du hast im Zusammenhang mit deinen personenbezogenen Daten jederzeit folgende Rechte:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Auskunft über deine gespeicherten personenbezogenen Daten zu erhalten</li>
              <li>die Berichtigung unrichtiger oder unvollständiger Daten zu verlangen</li>
              <li>die Löschung deiner personenbezogenen Daten zu verlangen</li>
              <li>die Einschränkung der Verarbeitung deiner Daten zu verlangen</li>
              <li>der Verarbeitung deiner Daten zu widersprechen</li>
              <li>eine erteilte Einwilligung jederzeit mit Wirkung für die Zukunft zu widerrufen</li>
            </ul>
            <p>Anfragen zu deinen Rechten kannst du jederzeit per E-Mail richten an:</p>
            <p><a href="mailto:support@harborstudios.app" className="text-primary hover:underline">support@harborstudios.app</a></p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">7. Änderungen dieser Datenschutzerklärung</h2>
            <p>Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, um sie an rechtliche Anforderungen oder Änderungen der Funktionen von NutrioTrack anzupassen.</p>
            <p>Die jeweils aktuelle Version ist jederzeit innerhalb der App sowie auf unserer Website verfügbar.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">8. Datenlöschung</h2>
            <p>Informationen zur Löschung deines Benutzerkontos und deiner personenbezogenen Daten findest du auf unserer separaten Seite zur <Link to="/datenloeschung" className="text-primary hover:underline">Datenlöschung</Link>.</p>
            <p>Dort wird transparent beschrieben:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>welche Daten gespeichert werden</li>
              <li>welche Daten gelöscht werden</li>
              <li>wie du eine Löschanfrage stellen kannst.</li>
            </ul>
            <p>Nach Eingang einer Löschanfrage werden deine personenbezogenen Daten im Rahmen der gesetzlichen Vorgaben gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
