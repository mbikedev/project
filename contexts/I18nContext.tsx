import React, { createContext, useContext, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import polyfill for Intl.PluralRules
import 'intl-pluralrules/polyfill';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        menu: 'Menu',
        reservations: 'Reservations',
        takeaway: 'Takeaway',
        admin: 'Admin',
      },
      // Home page
      home: {
        welcome: 'Welcome to East At West',        
        description: `Welcome to our website, celebrating the captivating world of Lebanese cuisine! At " East @ West " we are dedicated to present the rich flavors, vibrant colors, and cultural heritage of Lebanese culinary traditions, in the heart of Brussels!
Lebanese cuisine is a true culinary masterpiece, fusing the best of Mediterranean, Arabic, and Levantine flavors. We invite you to embark on a journey that will introduce you to an array of aromatic spices, fresh ingredients, healthy meals and a diverse range of dishes that are as exquisite as they are satisfying.`,
// business hours
        openingHours: 'Opening Hours',
        address: 'Address',
        phone: 'Phone',
        email: 'Email',
        hours: {
          monday: 'Monday: 11:30 AM - 10:00 PM',
          tuesday: 'Tuesday: 11:30 AM - 10:00 PM',
          wednesday: 'Wednesday: 11:30 AM - 10:00 PM',
          thursday: 'Thursday: 11:30 AM - 10:00 PM',
          friday: 'Friday: 11:30 AM - 11:00 PM',
          saturday: 'Saturday: 11:30 AM - 11:00 PM',
          sunday: 'Sunday: 12:00 PM - 10:00 PM',
        },
        // Contact information
        contact: {
          address: 'Bld de l\'Empereur 26, 1000 Brussels, Belgium',
          phone: '+32 465 20 60 24',
          email: 'contact@eastatwest.com',
        },
      },
      // Menu page
      menu: {
        title: 'Our Menu',
        subtitle: 'Discover authentic Lebanese flavors',
        categories: {
          setmenus: 'Set Menus',
          coldmezzes: 'Cold Mezzes',
          hotmezzes: 'Hot Mezzes',
          salads: 'Salads',
          lunchdishes: 'Lunch Dishes',
          dailyspecials: 'Daily Specials',
          sandwiches: 'Sandwiches',
          skewers: 'Skewers',
          softdrinks: 'Soft Drinks',
          hotdrinks: 'Hot Drinks & Tea',
          beers: 'Beers',     
          wines: 'Wines',
          desserts: 'Desserts',
        }, 

      },
      // Reservations page
      reservations: {
        title: 'How to make a reservation?',
        chooseDate: 'Choose a Date',
        yourName: 'Your Name',
        yourEmail: 'Your Email',
        contactQuestion: 'How can we contact you?',
        chooseTime: 'Choose a time',
        totalGuests: 'Total Guests',
        additionalInfo: 'Additional Information',
        bookTable: 'BOOK A TABLE',
        request: 'REQUEST',
        cancellation: 'CANCELLATION',
        businessHours: 'Business Hours',
        bookingTimes: 'Booking times',
        lunch: 'LUNCH',
        dinner: 'DINNER',
        lastReservation: 'Last reservation at',
        saturday: 'Saturday',
        namePlaceholder: 'Name here',
        emailPlaceholder: 'Email here',
        phonePlaceholder: 'Phone Number here',
        timePlaceholder: 'Start time here',
        untilPlaceholder: 'End time here',
        messagePlaceholder: 'Enter Your Message here',
        success: 'Reservation confirmed! Check your email for details.',
        error: 'Failed to make reservation. Please try again.',
        confirmationTitle: 'Reservation Confirmed!',
        confirmationMessage: 'Thank you for your reservation. You will receive a confirmation email shortly with all the details.',
        reservationNumber: 'Reservation Number',
      },
      // Takeaway page
      takeaway: {
        title: 'Order Takeaway',
        subtitle: 'Enjoy our delicious food at home',
        orderOnline: 'Order Online',
        callToOrder: 'Call to Order',
        pickupTime: 'Pickup in 20-30 minutes',
        deliveryArea: 'We deliver within 5km of our restaurant',
        minOrder: 'Minimum order: €25',
      },
      common: {
        currency: '€',
        loading: 'Loading...',
        error: 'An error occurred',
        retry: 'Try Again',
        close: 'Close',
        save: 'Save',
        cancel: 'Cancel',
        settings: 'Settings',
        language: 'Language',
        theme: 'Theme',
        light: 'Light',
        dark: 'Dark',
        system: 'System',
      },
    },
  },
  // French translations
  fr: {
    translation: {
      nav: {
        home: 'Accueil',
        menu: 'Menu',
        reservations: 'Réservations',
        takeaway: 'À Emporter',
        admin: 'Admin',
      },
      // Home page
      home: {
        welcome: 'Bienvenue chez East At West',
        subtitle: 'Chez "East @ West", nous nous consacrons à présenter les saveurs riches, les couleurs vibrantes et l\'héritage culturel des traditions culinaires libanaises, au cœur de Bruxelles !',
        description: 'La cuisine libanaise est un véritable chef-d\'œuvre culinaire, fusionnant le meilleur des saveurs méditerranéennes, arabes et levantines. Nous vous invitons à embarquer dans un voyage qui vous fera découvrir un éventail d\'épices aromatiques, d\'ingrédients frais, de repas sains et une gamme diversifiée de plats aussi exquis que satisfaisants.',
        // business hours
        openingHours: 'Heures d\'ouverture',
        address: 'Adresse',
        phone: 'Téléphone',
        email: 'Email',
        hours: {
          monday: 'Lundi: 11h30 - 22h00',
          tuesday: 'Mardi: 11h30 - 22h00',
          wednesday: 'Mercredi: 11h30 - 22h00',
          thursday: 'Jeudi: 11h30 - 22h00',
          friday: 'Vendredi: 11h30 - 23h00',
          saturday: 'Samedi: 11h30 - 23h00',
          sunday: 'Dimanche: 12h00 - 22h00',
        },
        // Contact information
        contact: {
          address: 'Bld de l\'Empereur 26, 1000 Bruxelles, Belgique',
          phone: '+32 465 20 60 24',
          email: 'contact@eastatwest.com',
        },
      },
      // Menu page
      menu: {
        title: 'Notre Menu',
        subtitle: 'Découvrez les saveurs authentiques du Liban',
        categories: {
          coldmezzes: 'Mets Froides',
          hotmezzes: 'Mezzes Chauds',
          setmenus: 'Menus',
          sandwiches: 'Sandwiches',
          salads: 'Salades',
          dailyspecials: 'Spécialités du Jour',
          softdrinks: 'Boissons Fraîches',
          hotdrinks: 'Boissons Chaudes',
          desserts: 'Desserts',
          beers: 'Bières',
        },
        // Menu items

      },
      // Reservations page
      reservations: {
        title: 'Comment faire une réservation?',
        chooseDate: 'Choisir une Date',
        yourName: 'Votre Nom',
        yourEmail: 'Votre Email',
        contactQuestion: 'Comment pouvons-nous vous contacter?',
        chooseTime: 'Choisir une heure',
        totalGuests: 'Nombre d\'Invités',
        additionalInfo: 'Informations Supplémentaires',
        bookTable: 'RÉSERVER UNE TABLE',
        request: 'DEMANDE',
        cancellation: 'ANNULATION',
        businessHours: 'Heures d\'Ouverture',
        bookingTimes: 'Heures de réservation',
        lunch: 'DÉJEUNER',
        dinner: 'DÎNER',
        lastReservation: 'Dernière réservation à',
        saturday: 'Samedi',
        namePlaceholder: 'Nom ici',
        emailPlaceholder: 'Email ici',
        phonePlaceholder: 'Numéro de téléphone ici',
        timePlaceholder: 'Heure de début ici',
        untilPlaceholder: 'Heure de fin ici',
        messagePlaceholder: 'Entrez votre message ici',
        success: 'Réservation confirmée! Vérifiez votre email pour les détails.',
        error: 'Échec de la réservation. Veuillez réessayer.',
        confirmationTitle: 'Réservation Confirmée!',
        confirmationMessage: 'Merci pour votre réservation. Vous recevrez un email de confirmation avec tous les détails.',
        reservationNumber: 'Numéro de Réservation',
      },
      // Takeaway page
      takeaway: {
        title: 'Commander à Emporter',
        subtitle: 'Dégustez notre délicieuse cuisine chez vous',
        orderOnline: 'Commander en Ligne',
        callToOrder: 'Appeler pour Commander',
        pickupTime: 'Récupération en 20-30 minutes',
        deliveryArea: 'Nous livrons dans un rayon de 5km de notre restaurant',
        minOrder: 'Commande minimum: 25€',
      },
      // Common translations
      common: {
        currency: '€',
        loading: 'Chargement...',
        error: 'Une erreur s\'est produite',
        retry: 'Réessayer',
        close: 'Fermer',
        save: 'Enregistrer',
        cancel: 'Annuler',
        settings: 'Paramètres',
        language: 'Langue',
        theme: 'Thème',
        light: 'Clair',
        dark: 'Sombre',
        system: 'Système',
      },
    },
  },
  // Dutch translations
  nl: {
    translation: {
      nav: {
        home: 'Home',
        menu: 'Menu',
        reservations: 'Reserveringen',
        takeaway: 'Afhaal',
        admin: 'Admin',
      },
      // Home page
      home: {
        welcome: 'Welkom op onze website, ter viering van de boeiende wereld van de Libanese keuken!',
        subtitle: 'Bij "East @ West" zijn we toegewijd aan het presenteren van de rijke smaken, levendige kleuren en cultureel erfgoed van Libanese culinaire tradities, in het hart van Brussel!',
        description: 'De Libanese keuken is een waar culinair meesterwerk, dat het beste van mediterrane, Arabische en Levantijnse smaken samenbrengt. We nodigen u uit om een reis te ondernemen die u zal introduceren tot een scala van aromatische kruiden, verse ingrediënten, gezonde maaltijden en een diverse reeks gerechten die even voortreffelijk als bevredigend zijn.',
        openingHours: 'Openingstijden',
        address: 'Adres',
        phone: 'Telefoon',
        email: 'Email',
        // business hours
        hours: {
          monday: 'Maandag: 11:30 - 22:00',
          tuesday: 'Dinsdag: 11:30 - 22:00',
          wednesday: 'Woensdag: 11:30 - 22:00',
          thursday: 'Donderdag: 11:30 - 22:00',
          friday: 'Vrijdag: 11:30 - 23:00',
          saturday: 'Zaterdag: 11:30 - 23:00',
          sunday: 'Zondag: 12:00 - 22:00',
        },
        // Contact information
        contact: {
          address: 'Keizerslaan 26, 1000 Brussel, België',
          phone: '+32 465 20 60 24',
          email: 'contact@eastatwest.com',
        },
      },
      // Menu page
      menu: {
        title: 'Ons Menu',
        subtitle: 'Ontdek authentieke Libanese smaken',
        categories: {
          coldmezzes: 'Koude Mezze',
          hotmezzes: 'Warme Mezze',
          setmenus: 'Set Menus',
          sandwiches: 'Sandwiches',
          salads: 'Salades',
          dailyspecials: 'Dagspecialiteiten',
          softdrinks: 'Frisdranken',
          hotdrinks: 'Warme Dranken',
          desserts: 'Desserts',
          beers: 'Bieren',
        },
        // Menu items
        items: {
          hummus: {
            name: 'Hummus',
            description: 'Romige kikkererwten dip met tahini, olijfolie en kruiden',
          },
          tabbouleh: {
            name: 'Tabbouleh',
            description: 'Verse peterselie salade met tomaten, munt en bulgur',
          },
          fattoush: {
            name: 'Fattoush',
            description: 'Gemengde salade met knapperige pita brood en sumac dressing',
          },
          shawarma: {
            name: 'Kip Shawarma',
            description: 'Gemarineerde kip met knoflooksaus en groenten',
          },
          kebab: {
            name: 'Lam Kebab',
            description: 'Gegrilde lam spiesjes met kruiden en specerijen',
          },
          baklava: {
            name: 'Baklava',
            description: 'Lagen van phyllo deeg met noten en honing',
          },
        },
      },
      // Reservations page
      reservations: {
        title: 'Hoe maak je een reservering?',
        chooseDate: 'Kies een Datum',
        yourName: 'Uw Naam',
        yourEmail: 'Uw Email',
        contactQuestion: 'Hoe kunnen we u bereiken?',
        chooseTime: 'Kies een tijd',
        totalGuests: 'Totaal Gasten',
        additionalInfo: 'Aanvullende Informatie',
        bookTable: 'TAFEL RESERVEREN',
        request: 'VERZOEK',
        cancellation: 'ANNULERING',
        businessHours: 'Openingstijden',
        bookingTimes: 'Reserveringstijden',
        lunch: 'LUNCH',
        dinner: 'DINER',
        lastReservation: 'Laatste reservering om',
        saturday: 'Zaterdag',
        namePlaceholder: 'Naam hier',
        emailPlaceholder: 'Email hier',
        phonePlaceholder: 'Telefoonnummer hier',
        timePlaceholder: 'Starttijd hier',
        untilPlaceholder: 'Eindtijd hier',
        messagePlaceholder: 'Voer uw bericht hier in',
        success: 'Reservering bevestigd! Controleer uw email voor details.',
        error: 'Reservering mislukt. Probeer het opnieuw.',
        confirmationTitle: 'Reservering Bevestigd!',
        confirmationMessage: 'Bedankt voor uw reservering. U ontvangt binnenkort een bevestigingsmail met alle details.',
        reservationNumber: 'Reserveringsnummer',
      },
      // Takeaway page
      takeaway: {
        title: 'Afhaal Bestellen',
        subtitle: 'Geniet van ons heerlijke eten thuis',
        orderOnline: 'Online Bestellen',
        callToOrder: 'Bellen om te Bestellen',
        pickupTime: 'Ophalen in 20-30 minuten',
        deliveryArea: 'We bezorgen binnen 5km van ons restaurant',
        minOrder: 'Minimum bestelling: €25',
      },
      // Common translations
      common: {
        currency: '€',
        loading: 'Laden...',
        error: 'Er is een fout opgetreden',
        retry: 'Opnieuw Proberen',
        close: 'Sluiten',
        save: 'Opslaan',
        cancel: 'Annuleren',
        settings: 'Instellingen',
        language: 'Taal',
        theme: 'Thema',
        light: 'Licht',
        dark: 'Donker',
        system: 'Systeem',
      },
    },
  },
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
  });

// I18nContext type
interface I18nContextType {
  changeLanguage: (lng: string) => void;
  currentLanguage: string;
}

// I18nContext
const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    loadLanguage();
  }, []);

  // Load language
  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage && ['en', 'fr', 'nl'].includes(savedLanguage)) {
        i18n.changeLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Failed to load language:', error);
    }
  };

  // Change language
  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      await AsyncStorage.setItem('language', lng);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  // Return I18nContext
  return (
    <I18nContext.Provider value={{ changeLanguage, currentLanguage: i18n.language }}>
      {children}
    </I18nContext.Provider>
  );
}

// useI18n hook
export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}