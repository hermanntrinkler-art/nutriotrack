import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DatenloeschungPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Link>
        <h1 className="text-2xl font-bold mb-6">Datenlöschung</h1>
        <div className="prose prose-sm dark:prose-invert space-y-4 text-muted-foreground">
          <p>
            Du hast das Recht, die Löschung deiner personenbezogenen Daten zu verlangen. 
            Um eine Datenlöschung zu beantragen, sende bitte eine E-Mail an:
          </p>
          <p><strong>support@harborstudios.app</strong></p>
          <p>
            Bitte gib in deiner Anfrage die E-Mail-Adresse an, mit der du dich registriert hast. 
            Wir werden deine Anfrage innerhalb von 30 Tagen bearbeiten.
          </p>
          <div className="mt-6 space-y-2">
            <p><strong>Harbor Studios</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
