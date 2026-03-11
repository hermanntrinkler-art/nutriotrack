import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Link>
        <h1 className="text-2xl font-bold mb-6">Allgemeine Geschäftsbedingungen</h1>
        <div className="prose prose-sm dark:prose-invert space-y-4 text-muted-foreground">
          <p className="text-sm italic text-muted-foreground/70">
            Die AGB-Texte werden in Kürze ergänzt.
          </p>
          <div className="space-y-2">
            <p><strong>Harbor Studios</strong></p>
            <p>E-Mail: support@harborstudios.app</p>
          </div>
        </div>
      </div>
    </div>
  );
}
