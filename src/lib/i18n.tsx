import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type Language = 'de' | 'en';

const translations = {
  de: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.meals': 'Mahlzeiten',
    'nav.history': 'Verlauf',
    'nav.weight': 'Gewicht',
    'nav.profile': 'Profil',

    // Auth
    'auth.login': 'Anmelden',
    'auth.register': 'Registrieren',
    'auth.logout': 'Abmelden',
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.confirmPassword': 'Passwort bestätigen',
    'auth.name': 'Name',
    'auth.forgotPassword': 'Passwort vergessen?',
    'auth.resetPassword': 'Passwort zurücksetzen',
    'auth.newPassword': 'Neues Passwort',
    'auth.noAccount': 'Noch kein Konto?',
    'auth.hasAccount': 'Bereits ein Konto?',
    'auth.sendResetLink': 'Link senden',
    'auth.resetSent': 'Link wurde gesendet! Prüfe deine E-Mails.',
    'auth.welcomeBack': 'Willkommen zurück',
    'auth.createAccount': 'Konto erstellen',
    'auth.subtitle': 'Dein smarter Ernährungsbegleiter',
    'auth.checkEmail': 'Bitte bestätige deine E-Mail-Adresse.',

    // Onboarding
    'onboarding.title': 'Lass uns loslegen!',
    'onboarding.subtitle': 'Ein paar Angaben, damit wir dein Ziel berechnen können.',
    'onboarding.sex': 'Geschlecht',
    'onboarding.male': 'Männlich',
    'onboarding.female': 'Weiblich',
    'onboarding.other': 'Divers',
    'onboarding.age': 'Alter',
    'onboarding.height': 'Größe (cm)',
    'onboarding.currentWeight': 'Aktuelles Gewicht (kg)',
    'onboarding.startWeight': 'Startgewicht (kg)',
    'onboarding.goalWeight': 'Zielgewicht (kg)',
    'onboarding.activityLevel': 'Aktivitätslevel',
    'onboarding.sedentary': 'Kaum aktiv',
    'onboarding.lightlyActive': 'Leicht aktiv',
    'onboarding.moderatelyActive': 'Moderat aktiv',
    'onboarding.veryActive': 'Sehr aktiv',
    'onboarding.extremelyActive': 'Extrem aktiv',
    'onboarding.goalType': 'Ziel',
    'onboarding.lose': 'Abnehmen',
    'onboarding.maintain': 'Halten',
    'onboarding.gain': 'Zunehmen',
    'onboarding.next': 'Weiter',
    'onboarding.back': 'Zurück',
    'onboarding.finish': 'Fertig',
    'onboarding.step': 'Schritt',
    'onboarding.of': 'von',
    'onboarding.bodyInfo': 'Körperdaten',
    'onboarding.goals': 'Deine Ziele',
    'onboarding.activity': 'Aktivität',

    // Dashboard
    'dashboard.hello': 'Hallo',
    'dashboard.today': 'Heute',
    'dashboard.remaining': 'übrig',
    'dashboard.eaten': 'gegessen',
    'dashboard.goal': 'Ziel',
    'dashboard.calories': 'Kalorien',
    'dashboard.protein': 'Protein',
    'dashboard.fat': 'Fett',
    'dashboard.carbs': 'Kohlenhydrate',
    'dashboard.kcal': 'kcal',
    'dashboard.grams': 'g',
    'dashboard.recentMeals': 'Letzte Mahlzeiten',
    'dashboard.noMeals': 'Noch keine Mahlzeiten heute.',
    'dashboard.addMeal': 'Mahlzeit hinzufügen',
    'dashboard.weightProgress': 'Gewichtsverlauf',
    'dashboard.weekSummary': 'Wochenzusammenfassung',
    'dashboard.hints': 'Deine Tipps',

    // Meals
    'meals.title': 'Mahlzeit erfassen',
    'meals.takePhoto': 'Foto aufnehmen',
    'meals.uploadImage': 'Bild hochladen',
    'meals.manualEntry': 'Manuell eingeben',
    'meals.breakfast': 'Frühstück',
    'meals.lunch': 'Mittagessen',
    'meals.dinner': 'Abendessen',
    'meals.snack': 'Snack',
    'meals.analyzing': 'Wird analysiert...',
    'meals.results': 'Erkannte Lebensmittel',
    'meals.foodName': 'Lebensmittel',
    'meals.quantity': 'Menge',
    'meals.unit': 'Einheit',
    'meals.save': 'Speichern',
    'meals.cancel': 'Abbrechen',
    'meals.addItem': 'Hinzufügen',
    'meals.deleteItem': 'Entfernen',
    'meals.confirmSave': 'Mahlzeit speichern',
    'meals.editHint': 'Du kannst alle Werte vor dem Speichern anpassen.',
    'meals.saved': 'Mahlzeit gespeichert!',
    'meals.selectType': 'Mahlzeittyp wählen',

    // Weight
    'weight.title': 'Gewichtstracking',
    'weight.current': 'Aktuell',
    'weight.start': 'Start',
    'weight.goalLabel': 'Ziel',
    'weight.difference': 'Differenz',
    'weight.addEntry': 'Gewicht eintragen',
    'weight.kg': 'kg',
    'weight.note': 'Notiz (optional)',
    'weight.history': 'Verlauf',

    // History
    'history.title': 'Verlauf',
    'history.daily': 'Tag',
    'history.weekly': 'Woche',
    'history.monthly': 'Monat',
    'history.average': 'Durchschnitt',
    'history.total': 'Gesamt',

    // Profile
    'profile.title': 'Profil',
    'profile.settings': 'Einstellungen',
    'profile.language': 'Sprache',
    'profile.german': 'Deutsch',
    'profile.english': 'Englisch',
    'profile.auto': 'Automatisch',
    'profile.editGoals': 'Ziele bearbeiten',
    'profile.account': 'Konto',

    // Hints
    'hint.caloriesRemaining': 'Du kannst heute noch {value} kcal essen.',
    'hint.proteinMissing': 'Dir fehlen noch {value} g Protein.',
    'hint.fatAlmost': 'Du hast dein Fettziel fast erreicht!',
    'hint.underGoal': 'Heute warst du unter deinem Ziel – super!',
    'hint.overGoal': 'Du hast dein Kalorienziel heute überschritten.',

    // Common
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'common.of': 'von',
  },
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.meals': 'Meals',
    'nav.history': 'History',
    'nav.weight': 'Weight',
    'nav.profile': 'Profile',

    'auth.login': 'Sign In',
    'auth.register': 'Sign Up',
    'auth.logout': 'Sign Out',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.name': 'Name',
    'auth.forgotPassword': 'Forgot password?',
    'auth.resetPassword': 'Reset Password',
    'auth.newPassword': 'New Password',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.sendResetLink': 'Send Link',
    'auth.resetSent': 'Link sent! Check your email.',
    'auth.welcomeBack': 'Welcome back',
    'auth.createAccount': 'Create Account',
    'auth.subtitle': 'Your smart nutrition companion',
    'auth.checkEmail': 'Please confirm your email address.',

    'onboarding.title': "Let's get started!",
    'onboarding.subtitle': 'A few details so we can calculate your goals.',
    'onboarding.sex': 'Sex',
    'onboarding.male': 'Male',
    'onboarding.female': 'Female',
    'onboarding.other': 'Other',
    'onboarding.age': 'Age',
    'onboarding.height': 'Height (cm)',
    'onboarding.currentWeight': 'Current Weight (kg)',
    'onboarding.startWeight': 'Starting Weight (kg)',
    'onboarding.goalWeight': 'Goal Weight (kg)',
    'onboarding.activityLevel': 'Activity Level',
    'onboarding.sedentary': 'Sedentary',
    'onboarding.lightlyActive': 'Lightly Active',
    'onboarding.moderatelyActive': 'Moderately Active',
    'onboarding.veryActive': 'Very Active',
    'onboarding.extremelyActive': 'Extremely Active',
    'onboarding.goalType': 'Goal',
    'onboarding.lose': 'Lose Weight',
    'onboarding.maintain': 'Maintain',
    'onboarding.gain': 'Gain Weight',
    'onboarding.next': 'Next',
    'onboarding.back': 'Back',
    'onboarding.finish': 'Finish',
    'onboarding.step': 'Step',
    'onboarding.of': 'of',
    'onboarding.bodyInfo': 'Body Info',
    'onboarding.goals': 'Your Goals',
    'onboarding.activity': 'Activity',

    'dashboard.hello': 'Hello',
    'dashboard.today': 'Today',
    'dashboard.remaining': 'remaining',
    'dashboard.eaten': 'eaten',
    'dashboard.goal': 'Goal',
    'dashboard.calories': 'Calories',
    'dashboard.protein': 'Protein',
    'dashboard.fat': 'Fat',
    'dashboard.carbs': 'Carbs',
    'dashboard.kcal': 'kcal',
    'dashboard.grams': 'g',
    'dashboard.recentMeals': 'Recent Meals',
    'dashboard.noMeals': 'No meals logged today.',
    'dashboard.addMeal': 'Add Meal',
    'dashboard.weightProgress': 'Weight Progress',
    'dashboard.weekSummary': 'Weekly Summary',
    'dashboard.hints': 'Your Tips',

    'meals.title': 'Log Meal',
    'meals.takePhoto': 'Take Photo',
    'meals.uploadImage': 'Upload Image',
    'meals.manualEntry': 'Manual Entry',
    'meals.breakfast': 'Breakfast',
    'meals.lunch': 'Lunch',
    'meals.dinner': 'Dinner',
    'meals.snack': 'Snack',
    'meals.analyzing': 'Analyzing...',
    'meals.results': 'Detected Foods',
    'meals.foodName': 'Food',
    'meals.quantity': 'Quantity',
    'meals.unit': 'Unit',
    'meals.save': 'Save',
    'meals.cancel': 'Cancel',
    'meals.addItem': 'Add Item',
    'meals.deleteItem': 'Remove',
    'meals.confirmSave': 'Save Meal',
    'meals.editHint': 'You can adjust all values before saving.',
    'meals.saved': 'Meal saved!',
    'meals.selectType': 'Select meal type',

    'weight.title': 'Weight Tracking',
    'weight.current': 'Current',
    'weight.start': 'Start',
    'weight.goalLabel': 'Goal',
    'weight.difference': 'Difference',
    'weight.addEntry': 'Log Weight',
    'weight.kg': 'kg',
    'weight.note': 'Note (optional)',
    'weight.history': 'History',

    'history.title': 'History',
    'history.daily': 'Day',
    'history.weekly': 'Week',
    'history.monthly': 'Month',
    'history.average': 'Average',
    'history.total': 'Total',

    'profile.title': 'Profile',
    'profile.settings': 'Settings',
    'profile.language': 'Language',
    'profile.german': 'German',
    'profile.english': 'English',
    'profile.auto': 'Automatic',
    'profile.editGoals': 'Edit Goals',
    'profile.account': 'Account',

    'hint.caloriesRemaining': 'You can still eat {value} kcal today.',
    'hint.proteinMissing': 'You still need {value} g of protein.',
    'hint.fatAlmost': "You've almost reached your fat goal!",
    'hint.underGoal': 'You stayed under your goal today – great!',
    'hint.overGoal': "You've exceeded your calorie goal today.",

    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.of': 'of',
  },
} as const;

type TranslationKey = keyof typeof translations.de;

interface I18nContextType {
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

function detectLanguage(): Language {
  const browserLang = navigator.language.slice(0, 2);
  return browserLang === 'de' ? 'de' : 'en';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('nutrilens-language');
    if (stored === 'de' || stored === 'en') return stored;
    return detectLanguage();
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nutrilens-language', lang);
  }, []);

  const t = useCallback((key: TranslationKey, params?: Record<string, string | number>): string => {
    let text: string = translations[language][key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  }, [language]);

  return (
    <I18nContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider');
  return ctx;
}
