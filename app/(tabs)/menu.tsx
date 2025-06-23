import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, ChevronUp, Wine } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/Header';
import { ImageZoom } from '@/components/ImageZoom';
import { supabase } from '@/lib/supabase';


interface MenuItem {
  id: string;
  name_en: string;
  name_fr: string;
  name_nl: string;
  description_en: string;
  description_fr: string;
  description_nl: string;
  title_en?: string;
  title_fr?: string;
  title_nl?: string;
  subtitle_en?: string;
  subtitle_fr?: string;
  subtitle_nl?: string;
  price: number;
  price_display?: string;
  category: string;
  image_url: string | null;
  available: boolean;
}


  
export default function MenuScreen() {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('setmenus');
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const scrollViewRef = useRef<ScrollView>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState<any>(null);

// Categories

  const categories = [
    { id: 'setmenus', name: t('menu.categories.setmenus') },
    { id: 'coldmezzes', name: t('menu.categories.coldmezzes') },
    { id: 'hotmezzes', name: t('menu.categories.hotmezzes') },
    { id: 'salads', name: t('menu.categories.salads') },
    { id: 'lunchdishes', name: t('menu.categories.lunchdishes') },
    { id: 'dailyspecials', name: t('menu.categories.dailyspecials') },
    { id: 'sandwiches', name: t('menu.categories.sandwiches') },
    { id: 'skewers', name: t('menu.categories.skewers') },
    { id: 'beers', name: t('menu.categories.beers') },
    { id: 'wines', name: t('menu.categories.wines') },
    { id: 'softdrinks', name: t('menu.categories.softdrinks') },
    { id: 'hotdrinks', name: t('menu.categories.hotdrinks') },
    { id: 'desserts', name: t('menu.categories.desserts') },
    
  ];


  // Mock data for demonstration
  const mockMenuItems: MenuItem[] = [
    {
      id: '1',
      name_en: 'Hummus',
      name_fr: 'Houmous',
      name_nl: 'Hummus',
      description_en: 'Chickpeas puree with tahini (sesame paste)',
      description_fr: 'Aubergines miniatures farcies aux noix et poivrons marinées à l\'huile d\'olive ',
      description_nl: 'Romige kikkererwten dip met tahini, olijfolie en kruiden',
      price: 7.50,
      category: 'coldmezzes',
      image_url: require('@/assets/images/houmos.webp'),
      available: true,
    },
    {
      id: '2',
      name_en: 'Itch(vegan)',
      name_fr: 'Iche(vegan)',
      name_nl: 'Itch(vegan)',
      description_en: 'Bulgur cooked in tomato sauce with peppers, onion, parsley and pomegranate molasses ',
      description_fr: 'Boulgour cuit à la sauce tomate avec poivrons, oignons, persil et mélasse de grenade ',
      description_nl: 'Bulgur gekookt in tomatensaus met paprika, uien, peterselie en granaatappelmelasse',
      price: 7.50,
      category: 'coldmezzes',
      image_url: require('@/assets/images/iche.webp'),
      available: true,
    },
    
    
    {
      id: '5',
      name_en: 'Aish el Saraya (Vgn)  ',
      name_fr: 'Aish el Saraya (Vgn)  ',
      name_nl: 'Aish el Saraya (Vgn)  ',
      description_en: 'A lay of sweeten biscuit, a lay of vegan pudding, orange blossom water and Pistachio',
      description_fr: 'Une couche de biscuit sucré, une couche de pudding vegan, eau de fleur d\'oranger et Pistache',
      description_nl: 'Een laag zoete biscuit, een laag veganistische pudding, oranjebloesemwater en pistache',
      price: 3.50,
      category: 'desserts',
      image_url: require('@/assets/images/aish-el-saraya.webp'),
      available: true,
    },
    {
      id: '6',
      name_en: 'traditional-ice-cream  ',
      name_fr: 'glace traditionnelle ',
      name_nl: 'traditioneel ijs  ',
      description_en: 'A lay of sweeten biscuit, a lay of vegan pudding, orange blossom water and Pistachio',
      description_fr: 'Une couche de biscuit sucré, une couche de pudding vegan, eau de fleur d\'oranger et Pistache',
      description_nl: 'Een laag zoete biscuit, een laag veganistische pudding, oranjebloesemwater en pistache',
      price: 6,
      category: 'desserts',
      image_url: require('@/assets/images/traditional-ice-cream.webp'),
      available: true,
    },
    {
      id: '7',
      name_en: 'Menu East@West ',
      name_fr: 'Menu East@West ',
      name_nl: 'Menu East@West ',
      description_en: 'Houmous (chickpea purée with tahini), Moutabal (grilled eggplant with tahini), eggplants, onions, chickpeas and tomatoes, fattoush salad, 2x falafel, 2x rkakat, 2x beef kebab skewers, 2x chicken skewers, 2x desserts: Aish el Saraya (sweet biscuit, vegan pudding, orange blossom water, pistachio).',
      description_fr: 'Houmous (purée de pois chiches au tahini), Moutabal (aubergines grillées au tahini), aubergines, oignons, pois chiches et tomates, salade fattoush, 2x falafel, 2x rkakat, 2x brochettes de kebab, 2x brochettes chich taouk, 2x desserts : Aish el Saraya (biscuit sucré, pudding vegan, eau de fleur d\'oranger, pistache).',
      description_nl: 'Hoemoes (kikkererwtenpuree met tahin), Moutabal (gegrilde aubergine met tahin), aubergines, uien, kikkererwten en tomaten, fattoushsalade, 2x falafel, 2x rkakat, 2x kebabspiesen, 2x kipspiesen, 2x desserts: Aish el Saraya (zoete koek, vegan pudding, oranjebloesemwater, pistache).',
      subtitle_en: 'Set Menu East @ West 64€/2per.',
      subtitle_fr: 'Menu Set East @ West 64€/2per.',
      subtitle_nl: 'Set Menu East @ West 64€/2per.',
      price: 64,
      category: 'setmenus',
      image_url: require('@/assets/images/menu-east-at-west.webp'),
      available: true,
    },
    {
      id: '8',
      name_en: 'Menu Vegan',
      name_fr: 'Menu Vegan',
      name_nl: 'Menu Vegan',
      description_en: 'Hummus (chickpeas purée with tahini (sesame paste)). Moutabal (grilled eggplant caviar with tahini (sesame paste)). Moussaka (eggplant, onion, chickpeas and tomatoes). Fattoush salad (tomatoes, lettuce, red cabbage, radish, cucumber, onion, fried bread with pomegranate molasses and special herbs). 2x Falafel (deep-fried mashed chickpeas balls). 2x Vegan Kibbeh (deep-fried bulgur croquettes stuffed with onion, walnuts and pomegranate molasses). Makdous (baby eggplant stuffed with walnuts and pepper, marinated in olive oil). Itch (bulgur cooked in tomato sauce with paprika, onion, parsley and pomegranate molasses). 2x Dessert: Aish el Saraya (sweetened biscuit, vegan pudding, orange blossom water and pistachio).',
      description_fr: 'Houmous (purée de pois chiches au tahini (pâte de sésame)). Moutabal (caviar d\'aubergines grillées au tahini (pâte de sésame)). Moussaka (aubergines, oignons, pois chiches et tomates). Salade fattouche (tomates, laitue, chou rouge, radis, concombre, oignon, pain frit avec mélasse de grenade et herbes spéciales). 2x Falafel (boules de purée de pois chiches frites). 2x Kebbé vegan (croquettes de boulgour frites, farcies d\'oignons, noix et mélasse de grenade). Makdous (aubergines farcies aux noix et poivrons, marinées à l\'huile d\'olive). Itch (boulgour cuit dans une sauce tomate avec paprika, oignon, persil et mélasse de grenade). 2x Dessert : Aish el Saraya (biscuit sucré, pudding vegan, eau de fleur d\'oranger et pistache).',
      description_nl: 'Hoemoes (kikkererwtenpuree met tahin (sesampasta)). Moutabal (auberginekaviaar met tahin (sesampasta)). Moussaka (aubergine, ui, kikkererwten en tomaten). Fattoushsalade (tomaten, sla, rode kool, radijs, komkommer, ui, gefrituurd brood met granaatappelmolasse en speciale kruiden). 2x Falafel (gefrituurde kikkererwtenballetjes). 2x Vegan Kibbeh (gefrituurde bulgurkroketten gevuld met ui, walnoten en granaatappelmolasse). Makdous (baby-aubergines gevuld met walnoten en paprika\'s, tomaat en peterselie). Itch (bulgur gekookt in tomatensaus met paprika, ui, peterselie en granaatappelmolasse). 2x Dessert: Aish el Saraya (zoete biscuit, vegan pudding, oranjebloesemwater en pistache).',
      subtitle_en: 'Set Menu Vegan 61€/2per.',
      subtitle_fr: 'Menu Set Vegan 61€/2per.',
      subtitle_nl: 'Set Menu Vegan 61€/2per.',
      price: 61,
      category: 'setmenus',
      image_url: require('@/assets/images/menu-vegan.webp'),
      available: true,
    },
    {
      id: '9',
      name_en: 'Menu Lazeez (Vegan)',
      name_fr: 'Menu Lazeez (Vegan)',
      name_nl: 'Menu Lazeez (Vegan)',
      description_en: 'Hummus (chickpeas purée with tahini (sesame paste)). Moutabal (grilled eggplant caviar with tahini (sesame paste)). Foul moudamas (fava beans marinated in lemon juice, tomatoes, cumin, garlic, olive oil and tahini sauce). Muhammara (dip of grilled red peppers, pomegranate molasses and walnuts). Warak enab (vine leaves stuffed with rice and herbs, marinated in olive oil, mint and pomegranate molasses). Tabbouleh (parsley, tomatoes, onion, lemon juice, bulgur, mint and olive oil). Batata harra (fried potato cubes with red peppers, cilantro and garlic). 2x Falafel (deep-fried mashed chickpeas balls). 2x Dessert: Aish el Saraya (sweetened biscuit, vegan pudding, orange blossom water and pistachio).',
      description_fr: 'Houmous (purée de pois chiches au tahini (pâte de sésame)). Moutabal (caviar d\'aubergines grillées au tahini (pâte de sésame)). Foul moudamas (fèves marinées dans du jus de citron, tomates, cumin, ail, huile d\'olive et sauce tahini). Muhammara (purée de poivrons rouges grillés, mélasse de grenade et noix). Warak enab (feuilles de vigne farcies de riz et d\'herbes, marinées dans l\'huile d\'olive, la menthe et la mélasse de grenade). Taboulé (persil, tomates, oignon, jus de citron, boulgour, menthe et huile d\'olive). Batata harra (cubes de pommes de terre frites, poivrons rouges, coriandre et ail). 2x Falafel (boules de pois chiches frites). 2x Dessert : Aish el Saraya (biscuit sucré, pudding vegan, eau de fleur d\'oranger et pistache).',
      description_nl: 'Hoemoes (kikkererwtenpuree met tahin (sesampasta)). Moutabal (gegrilde auberginekaviaar met tahin (sesampasta)). Foul moudamas (tuinbonen gemarineerd in citroensap, tomaten, komijn, knoflook, olijfolie en tahinsaus). Muhammara (dip van gegrilde rode paprika\'s, granaatappelmolasse en walnoten). Warak enab (wijnbladeren gevuld met rijst en kruiden, gemarineerd in olijfolie, munt en granaatappelmolasse). Tabouleh (peterselie, tomaten, ui, citroensap, bulgur, munt en olijfolie). Batata harra (gebakken aardappelblokjes met rode paprika\'s, koriander en knoflook). 2x Falafel (gefrituurde kikkererwtenballetjes). 2x Dessert: Aish el Saraya (zoete biscuit, vegan pudding, oranjebloesemwater en pistache).',
      subtitle_en: 'Set Menu Lazeez Vegan 63€/2per.',
      subtitle_fr: 'Menu Set Lazeez Vegan 63€/2per.',
      subtitle_nl: 'Set Menu Lazeez Vegan 63€/2per.',
      price: 63,
      category: 'setmenus',
      image_url: require('@/assets/images/menu-vegan.webp'),
      available: true,
    },
    // New Salads category items
    {
      id: '10',
      name_en: 'Original Tabouleh (Vgn)',
      name_fr: 'Taboulé Original (Vgn)',
      name_nl: 'Originele Tabouleh (Vgn)',
      description_en: 'Parsley, tomato, onion, lemon juice, bulgur, mint and olive oil',
      description_fr: 'Persil, tomate, oignon, jus de citron, boulgour, menthe et huile d\'olive',
      description_nl: 'Peterselie, tomaat, ui, citroensap, bulgur, munt en olijfolie',
      price: 8,
      category: 'salads',
      image_url: require('@/assets/images/taboule.webp'),
      available: true,
    },
    {
      id: '11',
      name_en: 'Fattoush (Vegan)',
      name_fr: 'Fattoush (Vegan)',
      name_nl: 'Fattoush (Vegan)',
      description_en: 'Tomato, lettuce, red cabbage, radish, cucumber, onion, fried bread, etc.',
      description_fr: 'Tomate, laitue, chou rouge, radis, concombre, oignon, pain frit, etc.',
      description_nl: 'Tomaat, sla, rode kool, radijs, komkommer, ui, gebakken brood, etc.',
      price: 8,
      category: 'salads',
      image_url: require('@/assets/images/fattoush.webp'),
      available: true,
    },
    {
      id: '12',
      name_en: 'Falafel (Vgn)',
      name_fr: 'Falafel (Vgn)',
      name_nl: 'Falafel (Vgn)',
      description_en: 'Falafel, lettuce, cucumber, tomato, pickles and tahini sauce (sesame paste)',
      description_fr: 'Falafels, laitue, concombre, tomate, cornichons et sauce tahini (purée de sésame)',
      description_nl: 'Falafel, sla, komkommer, tomaat, augurken en tahinsaus (sesampasta)',
      price: 13,
      category: 'salads',
      image_url: require('@/assets/images/falafel.webp'),
      available: true,
    },
    // New Daily Specials category items
    {
      id: '13',
      name_en: 'Plate with meat',
      name_fr: 'Assiette avec viande',
      name_nl: 'Bord met vlees',
      description_en: 'Assortment of the day with meat',
      description_fr: 'Assortiment du jour avec viande',
      description_nl: 'Dagelijkse selectie met vlees',
      price: 24,
      category: 'dailyspecials',
      image_url: null,
      available: true,
    },
    {
      id: '14',
      name_en: 'Vegan plate',
      name_fr: 'Assiette Vegan',
      name_nl: 'Vegan bord',
      description_en: 'Vegan assortment of the day',
      description_fr: 'Assortiment vegan du jour',
      description_nl: 'Vegan dagelijkse selectie',
      price: 24,
      category: 'dailyspecials',
      image_url: null,
      available: true,
    },
    // New Sandwiches category items
    {
      id: '15',
      name_en: 'Hummus (Vegan)',
      name_fr: 'Houmous (Vegan)',
      name_nl: 'Hummus (Vegan)',
      description_en: 'Hummus, tomato, pickles and lettuce',
      description_fr: 'Houmous, tomate, cornichons et laitue',
      description_nl: 'Hummus, tomaat, augurken en sla',
      price: 6.50,
      category: 'sandwiches',
      image_url: require('@/assets/images/houmos.webp'),
      available: true,
    },
    {
      id: '16',
      name_en: 'Chich Taouk',
      name_fr: 'Chich Taouk',
      name_nl: 'Chich Taouk',
      description_en: 'Grilled chicken skewer, lettuce, tomato and garlic sauce',
      description_fr: 'Brochette de poulet grillé, laitue, tomate et sauce à l\'ail',
      description_nl: 'Gegrilde kipspies, sla, tomaat en knoflooksaus',
      price: 7.00,
      category: 'sandwiches',
      image_url: require('@/assets/images/poulet-torator.webp'),
      available: true,
    },
    {
      id: '17',
      name_en: 'Moutabal (Vegan)',
      name_fr: 'Moutabal (Vegan)',
      name_nl: 'Moutabal (Vegan)',
      description_en: 'Grilled eggplant caviar with tahini (sesame paste), tomato, pickles and parsley',
      description_fr: 'Caviar d\'aubergines grillées au tahini (pâte de sésame), tomate, cornichons et persil',
      description_nl: 'Gegrilde auberginekaviaar met tahini (sesampasta), tomaat, augurken en peterselie',
      price: 6.50,
      category: 'sandwiches',
      image_url: require('@/assets/images/eggplant.jpg'),
      available: true,
    },
    {
      id: '18',
      name_en: 'Toshka',
      name_fr: 'Toshka',
      name_nl: 'Toshka',
      description_en: 'Baked minced beef and Syrian cheese',
      description_fr: 'Bœuf haché cuit au four et fromage syrien',
      description_nl: 'Gebakken gehakt rundvlees en Syrische kaas',
      price: 7.00,
      category: 'sandwiches',
      image_url: null,
      available: true,
    },
    {
      id: '19',
      name_en: 'Falafel (Vegan)',
      name_fr: 'Falafel (Vegan)',
      name_nl: 'Falafel (Vegan)',
      description_en: 'Falafel, tomato, pickles and lettuce',
      description_fr: 'Falafel, tomate, cornichons et laitue',
      description_nl: 'Falafel, tomaat, augurken en sla',
      price: 7.00,
      category: 'sandwiches',
      image_url: require('@/assets/images/falafel.webp'),
      available: true,
    },
    {
      id: '20',
      name_en: 'Kebab',
      name_fr: 'Kebab',
      name_nl: 'Kebab',
      description_en: 'Grilled seasoned minced beef skewer, hummus, tomato, lettuce, onion and sumac',
      description_fr: 'Brochette de bœuf haché grillé assaisonné, houmous, tomate, laitue, oignon et sumac',
      description_nl: 'Gegrilde gekruide gehakte rundvleesspies, hummus, tomaat, sla, ui en sumak',
      price: 7.00,
      category: 'sandwiches',
      image_url: require('@/assets/images/Kebab-dish.webp'),
      available: true,
    },
    {
      id: '21',
      name_en: 'Vegan Grill (Vegan)',
      name_fr: 'Grill Vegan (Vegan)',
      name_nl: 'Vegan Grill (Vegan)',
      description_en: 'Grilled eggplant, paprika and onion with a special sauce and tomato',
      description_fr: 'Aubergines grillées, paprika et oignon avec une sauce spéciale et tomate',
      description_nl: 'Gegrilde aubergine, paprika en ui met een speciale saus en tomaat',
      price: 7.00,
      category: 'sandwiches',
      image_url: require('@/assets/images/eggplant.jpg'),
      available: true,
    },
    {
      id: '22',
      name_en: 'Makdous (Vegan) (C)',
      name_fr: 'Makdous (Vegan) (C)',
      name_nl: 'Makdous (Vegan) (C)',
      description_en: 'Baby eggplants stuffed with walnuts and peppers, tomato and parsley',
      description_fr: 'Aubergines miniatures farcies aux noix et poivrons, tomate et persil',
      description_nl: 'Baby-aubergines gevuld met walnoten en paprika\'s, tomaat en peterselie',
      price: 7.00,
      category: 'sandwiches',
      image_url: require('@/assets/images/makdous.webp'),
      available: true,
    },
    {
      id: '23',
      name_en: 'Torator Chicken',
      name_fr: 'Poulet Torator',
      name_nl: 'Torator Kip',
      description_en: 'Torator chicken, parsley, tomato and walnuts',
      description_fr: 'Poulet torator, persil, tomate et noix',
      description_nl: 'Torator kip, peterselie, tomaat en walnoten',
      price: 7.00,
      category: 'sandwiches',
      image_url: require('@/assets/images/poulet-torator.webp'),
      available: true,
    },
    {
      id: '24',
      name_en: 'Cheese (Veget)',
      name_fr: 'Fromage (Veget)',
      name_nl: 'Kaas (Veget)',
      description_en: 'Syrian white cheese, mint, red pepper and olive oil',
      description_fr: 'Fromage blanc syrien, menthe, poivron rouge et huile d\'olive',
      description_nl: 'Syrische witte kaas, munt, rode paprika en olijfolie',
      price: 6.50,
      category: 'sandwiches',
      image_url: null,
      available: true,
    },
    // New Soft Drinks category items
    {
      id: '25',
      name_en: 'Home Made "Rose Of Damascus" Juice',
      name_fr: 'Jus Maison "Rose de Damas"',
      name_nl: 'Huisgemaakte "Roos van Damascus" Sap',
      description_en: 'Rose of Damas',
      description_fr: 'Rose de Damas',
      description_nl: 'Roos van Damascus',
      price: 5,
      category: 'softdrinks',
      image_url: require('@/assets/images/soft-drinks.webp'),
      available: true,
    },
    {
      id: '26',
      name_en: 'Coca-Cola | Cola Zero | Sprite',
      name_fr: 'Coca-Cola | Cola Zero | Sprite',
      name_nl: 'Coca-Cola | Cola Zero | Sprite',
      description_en: '',
      description_fr: '',
      description_nl: '',
      price: 3.50,
      category: 'softdrinks',
      image_url: require('@/assets/images/soft-drinks.webp'),
      available: true,
    },
    {
      id: '27',
      name_en: 'Schweppes (Agrumes | Virgin Mojito)',
      name_fr: 'Schweppes (Agrumes | Virgin Mojito)',
      name_nl: 'Schweppes (Citrus | Virgin Mojito)',
      description_en: '',
      description_fr: '',
      description_nl: '',
      price: 4,
      category: 'softdrinks',
      image_url: require('@/assets/images/soft-drinks.webp'),
      available: true,
    },
    {
      id: '28',
      name_en: 'Ayran',
      name_fr: 'Ayran',
      name_nl: 'Ayran',
      description_en: '',
      description_fr: '',
      description_nl: '',
      price: 3.50,
      category: 'softdrinks',
      image_url: require('@/assets/images/soft-drinks.webp'),
      available: true,
    },
    {
      id: '29',
      name_en: 'Water (Spa) 0.5L',
      name_fr: 'Eau (Spa) 0,5L',
      name_nl: 'Water (Spa) 0,5L',
      description_en: '',
      description_fr: '',
      description_nl: '',
      price: 4,
      category: 'softdrinks',
      image_url: require('@/assets/images/soft-drinks.webp'),
      available: true,
    },
    {
      id: '30',
      name_en: 'Fanta Orange | Ice-Tea',
      name_fr: 'Fanta Orange | Thé Glacé',
      name_nl: 'Fanta Sinaasappel | IJsthee',
      description_en: '',
      description_fr: '',
      description_nl: '',
      price: 3,
      category: 'softdrinks',
      image_url: require('@/assets/images/soft-drinks.webp'),
      available: true,
    },
    {
      id: '31',
      name_en: 'Schweppes (Indian Tonic)',
      name_fr: 'Schweppes (Indian Tonic)',
      name_nl: 'Schweppes (Indian Tonic)',
      description_en: '',
      description_fr: '',
      description_nl: '',
      price: 4,
      category: 'softdrinks',
      image_url: require('@/assets/images/soft-drinks.webp'),
      available: true,
    },
    // New Hot Drinks category items
    {
      id: '32',
      name_en: 'Arabian Coffee',
      name_fr: 'Café arabe',
      name_nl: 'Arabische koffie',
      description_en: '',
      description_fr: '',
      description_nl: '',
      price: 3.50,
      category: 'hotdrinks',
      image_url: null,
      available: true,
    },
    {
      id: '33',
      name_en: 'Café | Espresso',
      name_fr: 'Café | Expresso',
      name_nl: 'Koffie | Espresso',
      description_en: '',
      description_fr: '',
      description_nl: '',
      price: 3.25,
      category: 'hotdrinks',
      image_url: null,
      available: true,
    },
    {
      id: '34',
      name_en: 'Tea (mint tea | black tea | chamomile)',
      name_fr: 'Thé (thé à la menthe | thé noir | camomille)',
      name_nl: 'Thee (muntthee | zwarte thee | kamillethee)',
      description_en: '',
      description_fr: '',
      description_nl: '',
      price: 3.25,
      category: 'hotdrinks',
      image_url: null,
      available: true,
    },

    
    
     // New Wines category items
     //category red wines
     {
      id: '35',
      title_en: 'Red Wines',
      title_fr: 'Vins Rouges',
      title_nl: 'Rode Wijnen',
      name_en: 'Chateau Ksara',
      name_fr: 'Chateau Ksara',
      name_nl: 'Chateau Ksara',
      description_en: 'Le prieuré glass | bottle',
      description_fr: 'Le prieuré glass | bouteille',
      description_nl: 'Le prieuré glas | fles',
      price_display: '6 | 29 €',
      price: 6, // keep this for logic/calculations
      category: 'wines',
      image_url: null,
      available: true,
     
    }
    
    ,
    {
      id: '36',
      title_en: 'Red Wines',
      title_fr: 'Vins Rouges',
      title_nl: 'Rode Wijnen',
      name_en: 'Chateau Ksara',
      name_fr: 'Chateau Ksara',
      name_nl: 'Chateau Ksara',
      description_en: 'Reserve du couvent bottle',
      description_fr: 'Reserve du couvent bouteille',
      description_nl: 'Reserve du couvent fles',
      price: 33, 
      category: 'wines',
      image_url: null,
      available: true,
     
    },
    {
      id: '37',
      title_en: 'Red Wines',
      title_fr: 'Vins Rouges',
      title_nl: 'Rode Wijnen',
      name_en: 'Chateau Kefraya',
      name_fr: 'Chateau Kefraya',
      name_nl: 'Chateau Kefraya',
      description_en: 'Bretéche bottle',
      description_fr: 'Bretéche bouteille',
      description_nl: 'Bretéche fles',
      price: 36,
      category: 'wines',
      image_url: null,
      available: true,
     
    },
    
    //category white wines
      {
        id: '39',
        title_en: 'White Wines',
        title_fr: 'Vins Blancs',
        title_nl: 'Witte Wijnen',
        name_en: 'Chateau Ksara',
        name_fr: 'Chateau Ksara',
        name_nl: 'Chateau Ksara',
        description_en: 'Blanc de Blanc bottle ',
        description_fr: 'Blanc de Blanc bouteille',
        description_nl: 'Blanc de Blanc fles',
        price: 36,
        category: 'wines',
        image_url: null,
        available: true,
      },
      {
        id: '40',
        title_en: 'White Wines',
        title_fr: 'Vins Blancs',
        title_nl: 'Witte Wijnen',
        name_en: 'Chateau Ksara',
        name_fr: 'Chateau Ksara',
        name_nl: 'Chateau Ksara',
        description_en: 'Blanc de l\'observatoire glass | bottle',
        description_fr: 'Blanc de l\'observatoire glass | bouteille',
        description_nl: 'Blanc de l\'observatoire glas | fles',
        price: 6,
        price_display: '6 | 29 €',
        category: 'wines',
        image_url: null,
        available: true,
      },
      {
        id: '41',
        title_en: 'White Wines',
        title_fr: 'Vins Blancs',
        title_nl: 'Witte Wijnen',
        name_en: 'Chateau Kefraya',
        name_fr: 'Chateau Kefraya',
        name_nl: 'Chateau Kefraya',
        description_en: 'Bretéche bottle ',
        description_fr: 'Bretéche bouteille',
        description_nl: 'Blanc de Blanc fles',
        price: 36,
        category: 'wines',
        image_url: null,
        available: true,
      },
      {
        id: '42',
        title_en: 'Rosé',
        title_fr: 'Rosé',
        title_nl: 'Rosé',
        name_en: 'Chateau Ksara Rosé (Bottle)',
        name_fr: 'Chateau Ksara Rosé (Bouteille)',
        name_nl: 'Chateau Ksara Rosé (Fles)',
        description_en: 'Chateau Ksara Rosé (Bottle)',
        description_fr: 'Chateau Ksara Rosé (Bouteille)',
        description_nl: 'Chateau Ksara Rosé (Fles)',
        price: 36,
        category: 'wines',
        image_url: null,
        available: true,
      },
    // Lunch Dishes
    {
      id: 'lunch1',
      name_en: 'Vegan (Vegan)',
      name_fr: 'Vegan (Vegan)',
      name_nl: 'Vegan (Vegan)',
      description_en: 'Grilled eggplant, paprika, tomato and onion with a special sauce, accompanied by hummus, moutabal, Fattoush',
      description_fr: 'Aubergine grillée, poivron, tomate et oignon avec une sauce spéciale, accompagnée de houmous, moutabal, Fattoush',
      description_nl: 'Gegrilde aubergine, paprika, tomaat en ui met een speciale saus, geserveerd met hummus, moutabal, Fattoush',
      price: 18.50,
      category: 'lunchdishes',
      image_url: require('@/assets/images/plat-vegan.webp'),
      available: true,
    },
    {
      id: 'lunch2',
      name_en: 'Sujuk',
      name_fr: 'Sujuk',
      name_nl: 'Sujuk',
      description_en: 'Baked Lebanese bread stuffed with seasoned minced beef, tomato and pickles accompanied by hummus, moutabal, Fattoush',
      description_fr: 'Pain libanais garni de bœuf haché assaisonné, tomate et cornichons, accompagné de houmous, moutabal, Fattoush',
      description_nl: 'Libanees brood gevuld met gekruid gehakt, tomaat en augurken, geserveerd met hummus, moutabal, Fattoush',
      price: 20.80,
      category: 'lunchdishes',
      image_url: require('@/assets/images/toshka-leban.webp'),
      available: true,
    },
    {
      id: 'lunch3',
      name_en: 'Toshka',
      name_fr: 'Toshka',
      name_nl: 'Toshka',
      description_en: 'Baked Lebanese bread stuffed with minced beef and Syrian cheese accompanied by hummus, moutabal, Fattoush',
      description_fr: 'Pain libanais garni de bœuf haché et fromage syrien, accompagné de houmous, moutabal, Fattoush',
      description_nl: 'Libanees brood gevuld met gehakt en Syrische kaas, geserveerd met hummus, moutabal, Fattoush',
      price: 20.80,
      category: 'lunchdishes',
      image_url: require('@/assets/images/toshka-leban.webp'),
      available: true,
    },
    {
      id: 'lunch4',
      name_en: 'Chich Taouk',
      name_fr: 'Chich Taouk',
      name_nl: 'Chich Taouk',
      description_en: '2 grilled chicken skewers accompanied by hummus, itch (bulgur), Fattoush, pickles, garlic sauce',
      description_fr: '2 brochettes de poulet grillé, accompagnées de houmous, itch (boulgour), Fattoush, cornichons et sauce',
      description_nl: '2 gegrilde kipspiesen geserveerd met hummus, itch (bulgur), Fattoush, augurken, knoflooksaus',
      price: 19.00,
      category: 'lunchdishes',
      image_url: require('@/assets/images/chich-taouk.webp'),
      available: true,
    },
    {
      id: 'lunch5',
      name_en: 'Aleppo mix',
      name_fr: 'Aleppo mix',
      name_nl: 'Aleppo mix',
      description_en: '1 Kebab skewer, 1 chich taouk skewer, Rkakat, kibbeh, chicken tarator, muhammara and Fattoush',
      description_fr: '1 brochette de kebab, 1 brochette chich taouk, Rkakat, kibbeh, tarator de poulet, muhammara et Fattoush',
      description_nl: '1 kebabspies, 1 chich taoukspies, Rkakat, kibbeh, kiptarator, muhammara en Fattoush',
      price: 23.50,
      category: 'lunchdishes',
      image_url: require('@/assets/images/aleppo-mix.webp'),
      available: true,
    },
    {
      id: 'lunch6',
      name_en: 'Falafel (Vegan)',
      name_fr: 'Falafel (Vegan)',
      name_nl: 'Falafel (Vegan)',
      description_en: '4 pieces of falafel accompanied by hummus, moutabal, Fattoush, tahini sauce (sesame paste), pickles',
      description_fr: '4 pièces de falafel accompagnées de houmous, moutabal, Fattoush, sauce tahini (purée de sésame), cornichons',
      description_nl: '4 stuks falafel geserveerd met hummus, moutabal, Fattoush, tahinsaus (sesampasta), augurken',
      price: 18.00,
      category: 'lunchdishes',
      image_url: require('@/assets/images/falafel-lunch.webp'),
      available: true,
    },
    {
      id: 'lunch7',
      name_en: 'Kebab',
      name_fr: 'Kebab',
      name_nl: 'Kebab',
      description_en: '2 grilled and seasoned minced beef skewers accompanied by hummus, Fattoush',
      description_fr: '2 brochettes de bœuf haché grillé assaisonné, accompagnées de houmous, Fattoush',
      description_nl: '2 gegrilde en gekruide rundergehaktspiesen geserveerd met hummus, Fattoush',
      price: 19.00,
      category: 'lunchdishes',
      image_url: require('@/assets/images/Kebab-dish.webp'),
      available: true,
    },
    {
      id: 'lunch8',
      name_en: 'Grill Mix',
      name_fr: 'Grill Mix',
      name_nl: 'Grill Mix',
      description_en: '1 Kebab skewer and 1 chich taouk skewer accompanied by hummus, itch (bulgur), Fattoush',
      description_fr: '1 brochette de kebab et 1 brochette chich taouk accompagnées de houmous, itch (boulgour), Fattoush',
      description_nl: '1 kebabspies en 1 chich taoukspies geserveerd met hummus, itch (bulgur), Fattoush',
      price: 19.00,
      category: 'lunchdishes',
      image_url: require('@/assets/images/Kebab-dish.webp'),
      available: true,
    },
    {
    id: 'lunch9',
    name_en: '2x Kebab',
    name_fr: '2x Kebab',
    name_nl: '2x Kebab',
    description_en: 'Pickles and garlic sauce ',
    description_fr: 'Cornichons et sauce à l\'ail',
    description_nl: 'Augurken en knoflooksaus',
    price: 10,
    category: 'skewers',
    image_url: require('@/assets/images/kebabx2.webp'),
    available: true,
  },
  {
    id: 'lunch10',
    name_en: '2x Chich Taouk',
    name_fr: '2x Chich Taouk',
    name_nl: '2x Chich Taouk',
    description_en: 'Pickles and garlic sauce ',
    description_fr: 'Cornichons et sauce à l\'ail',
    description_nl: 'Augurken en knoflooksaus',
    price: 10,
    category: 'skewers',
    image_url: require('@/assets/images/chich-taoukx2.webp'),
    available: true,
  },
  {
    id: 'lunch11',
    name_en: 'Lebanese beer ',
    name_fr: 'Bière libanaise',
    name_nl: 'Libanees bier',
    description_en: 'Lebanese beer ',
    description_fr: 'Bière libanaise',
    description_nl: 'Libanees bier',
    price: 4.50,
    category: 'beers',
    image_url: require('@/assets/images/lebanese-beer.webp'),
    available: true,
  },
  {
    id: 'lunch12',
    name_en: 'Hoegaarden white beer',
    name_fr: 'Bière blanche Hoegaarden',
    name_nl: 'Witte Hoegaarden bier',
    description_en: 'Hoegaarden white beer',
    description_fr: 'Bière blanche Hoegaarden',
    description_nl: 'Witte Hoegaarden bier',
    price: 4.50,
    category: 'beers',
    image_url: require('@/assets/images/hoegaarden.webp'),
    available: true,
  },
  {
    id: 'lunch13',
    name_en: 'Jupiler beer ',
    name_fr: 'Jupiler bière',
    name_nl: 'Jupiler bier',
    description_en: 'Jupiler beer',
    description_fr: 'Jupiler bière',
    description_nl: 'Jupiler bier',
    price: 3.50,
    category: 'beers',
    image_url: require('@/assets/images/jupiler.webp'),
    available: true,
  },
  {
    id: 'lunch14',
    name_en: 'Leffe brown beer I Lindemans kriek ',
    name_fr: 'Bière brune Leffe I Lindemans kriek',
    name_nl: 'Bruine Leffe I Lindemans kriek',
    description_en: 'Leffe brown beer I Lindemans kriek',
    description_fr: 'Bière brune Leffe I Lindemans kriek',
    description_nl: 'Bruine Leffe I Lindemans kriek',
    price: 5,
    category: 'beers',
    image_url: require('@/assets/images/lindermans.webp'),
    available: true,
  },
  {
    id: 'cold1',
    name_en: 'Tarator chicken',
    name_fr: 'Poulet Tarator',
    name_nl: 'Tarator kip',
    description_en: 'Mashed cooked chicken and tahini (sesame paste)',
    description_fr: 'Poulet cuit écrasé et tahini (purée de sésame)',
    description_nl: 'Gekookte kip met tahinsaus (sesampasta)',
    price: 8.5,
    category: 'coldmezzes',
    image_url: require('@/assets/images/cold mezzes/poulet-torator.webp'),
    available: true,
  },
  {
    id: 'cold2',
    name_en: 'Muhammara (Vegan)',
    name_fr: 'Muhammara (Vegan)',
    name_nl: 'Muhammara (Vegan)',
    description_en: 'Dip of grilled red peppers, pomegranate molasses and walnuts',
    description_fr: 'Crème de poivrons rouges grillés, mélasse de grenade et noix',
    description_nl: 'Dip van gegrilde rode paprika\'s, granaatappelmelasse en walnoten',
    price: 8,
    category: 'coldmezzes',
    image_url: require('@/assets/images/cold mezzes/Muhamara.webp'),
    available: true,
  },
  {
    id: 'cold3',
    name_en: 'Makdous (Vegan)',
    name_fr: 'Makdous (Vegan)',
    name_nl: 'Makdous (Vegan)',
    description_en: 'Baby eggplants stuffed with walnuts and peppers, marinated in olive oil',
    description_fr: 'Mini aubergines farcies aux noix et poivrons, marinées dans l\'huile d\'olive',
    description_nl: 'Kleine aubergines gevuld met walnoten en paprika\'s, gemarineerd in olijfolie',
    price: 7,
    category: 'coldmezzes',
    image_url: require('@/assets/images/cold mezzes/Makdous.webp'),
    available: true,
  },
  {
    id: 'cold4',
    name_en: 'Itch (Vegan)',
    name_fr: 'Itch (Vegan)',
    name_nl: 'Itch (Vegan)',
    description_en: 'Bulgur cooked in tomato sauce with peppers, onion, parsley and pomegranate molasses',
    description_fr: 'Boulgour mijoté dans une sauce tomate avec poivrons, oignon, persil et mélasse de grenade',
    description_nl: 'Bulgur gekookt in tomatensaus met paprika, ui, peterselie en granaatappelmelasse',
    price: 7.5,
    category: 'coldmezzes',
    image_url: require('@/assets/images/cold mezzes/iche.webp'),
    available: true,
  },
  {
    id: 'cold5',
    name_en: 'Hummus (Vegan)',
    name_fr: 'Houmous (Vegan)',
    name_nl: 'Hummus (Vegan)',
    description_en: 'Chickpeas puree with tahini (sesame paste)',
    description_fr: 'Purée de pois chiches avec tahini (purée de sésame)',
    description_nl: 'Kikkererwtenpuree met tahinsaus (sesampasta)',
    price: 7.5,
    category: 'coldmezzes',
    image_url: require('@/assets/images/cold mezzes/Houmos.webp'),
    available: true,
  },
  {
    id: 'cold6',
    name_en: 'Moutabal (Vegan)',
    name_fr: 'Moutabal (Vegan)',
    name_nl: 'Moutabal (Vegan)',
    description_en: 'Grilled eggplant caviar with tahini (sesame paste)',
    description_fr: 'Caviar d\'aubergine grillée avec tahini (purée de sésame)',
    description_nl: 'Gegrilde auberginekaviaar met tahinsaus (sesampasta)',
    price: 8,
    category: 'coldmezzes',
    image_url: require('@/assets/images/cold mezzes/Moutabal.webp'),
    available: true,
  },
  {
    id: 'cold7',
    name_en: 'Warak enab (Vegan)',
    name_fr: 'Warak enab (Vegan)',
    name_nl: 'Warak enab (Vegan)',
    description_en: 'Vine leaves stuffed with rice, herbs, marinated in olive oil, mint, pomegranate molasses',
    description_fr: 'Feuilles de vigne farcies de riz et d\'herbes, marinées à l\'huile d\'olive, à la menthe et à la mélasse de grenade',
    description_nl: 'Wijnbladeren gevuld met rijst en kruiden, gemarineerd in olijfolie, munt en granaatappelmelasse',
    price: 7,
    category: 'coldmezzes',
    image_url: require('@/assets/images/cold mezzes/warak-enab.webp'),
    available: true,
  },
  {
    id: 'cold8',
    name_en: 'Moussakaa (Vegan)',
    name_fr: 'Moussakaa (Vegan)',
    name_nl: 'Moussakaa (Vegan)',
    description_en: 'Eggplant, onion, chickpeas and tomato',
    description_fr: 'Aubergine, oignon, pois chiches et tomate',
    description_nl: 'Aubergine, ui, kikkererwten en tomaat',
    price: 7.5,
    category: 'coldmezzes',
    image_url: require('@/assets/images/cold mezzes/Mousaka.webp'),
    available: true,
  },
  {
    id: 'hot1',
    name_en: 'Grilled Syrian cheese (Vgtrn)',
    name_fr: 'Fromage syrien grillé (Vgtrn)',
    name_nl: 'Gegrilde Syrische kaas (Vgtrn)',
    description_en: 'Grilled Syrian cheese',
    description_fr: 'Fromage syrien grillé',
    description_nl: 'Gegrilde Syrische kaas',
    price: 8.5,
    category: 'hotmezzes',
    image_url: require('@/assets/images/hot mezzes/fromage-grille.webp'),
    available: true,
  },
  {
    id: 'hot2',
    name_en: 'Kibbeh Veganist x2pcs',
    name_fr: 'Kebbé veganiste x2pcs',
    name_nl: 'Kibbeh veganist x2st',
    description_en: 'Fried bulgar croquettes stuffed with onion, walnuts and pomegranate molasses.',
    description_fr: 'Croquettes de boulgour frites farcies aux oignons, noix et mélasse de grenade.',
    description_nl: 'Gebakken bulgurkroketten gevuld met ui, walnoten en granaatappelmelasse.',
    price: 5,
    category: 'hotmezzes',
    image_url: require('@/assets/images/hot mezzes/kebbe-veganist.webp'),
    available: true,
  },
  {
    id: 'hot3',
    name_en: 'Falafel x2pcs (Vegan)',
    name_fr: 'Falafel x2pcs (Vegan)',
    name_nl: 'Falafel x2st (Vegan)',
    description_en: 'Deep-fried mashed chickpeas balls served with tahini sauce (sesame paste)',
    description_fr: 'Boulettes de pois chiches frites servies avec sauce tahini (purée de sésame)',
    description_nl: 'Gefrituurde kikkererwtenballetjes geserveerd met tahinsaus (sesampasta)',
    price: 3,
    category: 'hotmezzes',
    image_url: require('@/assets/images/hot mezzes/falafel x2p.webp'),
    available: true,
  },
  {
    id: 'hot4',
    name_en: 'Toshka',
    name_fr: 'Toshka',
    name_nl: 'Toshka',
    description_en: 'Baked Lebanese bread stuffed with minced beef and Syrian cheese',
    description_fr: 'Pain libanais garni de bœuf haché et fromage syrien',
    description_nl: 'Libanees brood gevuld met gehakt en Syrische kaas',
    price: 12.5,
    category: 'hotmezzes',
    image_url: require('@/assets/images/hot mezzes/toshka.webp'),
    available: true,
  },
  {
    id: 'hot5',
    name_en: 'Rkakat 2pcs (Vgtrn)',
    name_fr: 'Rkakat 2pcs (Vgtrn)',
    name_nl: 'Rkakat 2st (Vgtrn)',
    description_en: 'Rolled puff pastry stuffed with cheese (fried)',
    description_fr: 'Feuilletés roulés farcis au fromage (frits)',
    description_nl: 'Opgerolde bladerdeeg gevuld met kaas (gefrituurd)',
    price: 4,
    category: 'hotmezzes',
    image_url: require('@/assets/images/hot mezzes/Rkakat.webp'),
    available: true,
  },
  {
    id: 'hot6',
    name_en: 'Batata Harra (Vegan)',
    name_fr: 'Batata Harra (Vegan)',
    name_nl: 'Batata Harra (Vegan)',
    description_en: 'Fried potatoes cubes with red peppers, cilantro and garlic',
    description_fr: 'Cubes de pommes de terre frites avec poivrons rouges, coriandre et ail',
    description_nl: 'Gebakken aardappelblokjes met rode paprika, koriander en knoflook',
    price: 7,
    category: 'hotmezzes',
    image_url: require('@/assets/images/hot mezzes/Batata-Harra.webp'),
    available: true,
  },
  {
    id: 'hot7',
    name_en: 'Kibbeh x2pcs',
    name_fr: 'Kebbé x2pcs',
    name_nl: 'Kibbeh x2st',
    description_en: 'Fried bulgar croquettes stuffed with minced beef, onion and walnuts.',
    description_fr: 'Croquettes de boulgour frites farcies au bœuf haché, oignon et noix.',
    description_nl: 'Gebakken bulgurkroketten gevuld met gehakt, ui en walnoten.',
    price: 5,
    category: 'hotmezzes',
    image_url: require('@/assets/images/hot mezzes/kebbe x2p.webp'),
    available: true,
  },
  {
    id: 'hot8',
    name_en: 'Sujuk',
    name_fr: 'Sujuk',
    name_nl: 'Sujuk',
    description_en: 'Baked Lebanese bread stuffed with seasoned minced beef, tomato and pickles.',
    description_fr: 'Pain libanais garni de bœuf haché assaisonné, tomate et cornichons.',
    description_nl: 'Libanees brood gevuld met gekruid gehakt, tomaat en augurken.',
    price: 12.5,
    category: 'hotmezzes',
    image_url: require('@/assets/images/hot mezzes/sujuk.webp'),
    available: true,
  },
  {
    id: 'hot9',
    name_en: 'Arayes Cheese',
    name_fr: 'Arayes Fromage',
    name_nl: 'Arayes Kaas',
    description_en: 'Baked Lebanese bread stuffed with Syrian cheese',
    description_fr: 'Pain libanais garni de fromage syrien',
    description_nl: 'Libanees brood gevuld met Syrische kaas',
    price: 10,
    category: 'hotmezzes',
    image_url: require('@/assets/images/hot mezzes/arayes-cheese.webp'),
    available: true,
  },
  {
    id: 'hot10',
    name_en: 'Foul Moudamas (Vgn)',
    name_fr: 'Foul Moudamas (Vgn)',
    name_nl: 'Foul Moudamas (Vgn)',
    description_en: 'Fava beans marinated in lemon juice, tomatoes, cumin, garlic, olive oil and tahini sauce (sesame paste)',
    description_fr: 'Fèves marinées dans du jus de citron, tomates, cumin, ail, huile d\'olive et sauce tahini (purée de sésame)',
    description_nl: 'Tuinbonen gemarineerd in citroensap, tomaten, komijn, knoflook, olijfolie en tahinsaus (sesampasta)',
    price: 8,
    category: 'hotmezzes',
    image_url: require('@/assets/images/hot mezzes/foul-moudamas.webp'),
    available: true,
  },
  {
    id: 'hot11',
    name_en: 'Nakanek',
    name_fr: 'Nakanek',
    name_nl: 'Nakanek',
    description_en: 'Mini sausages with pomegranate molasses',
    description_fr: 'Mini saucisses à la mélasse de grenade',
    description_nl: 'Miniworstjes met granaatappelmolasse',
    price: 9,
    category: 'hotmezzes',
    image_url: require('@/assets/images/hot mezzes/nakanek.webp'),
    available: true,
  }
  ];

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      // For now, use mock data. In production, uncomment the Supabase query
      // const { data, error } = await supabase
      //   .from('menu_items')
      //   .select('*')
      //   .eq('available', true);

      // if (error) throw error;
      // setMenuItems(data || []);

      setMenuItems(mockMenuItems);
    } catch (error) {
      console.error('Error loading menu items:', error);
      setMenuItems(mockMenuItems);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedName = (item: MenuItem) => {
    switch (i18n.language) {
      case 'fr': return item.name_fr;
      case 'nl': return item.name_nl;
      default: return item.name_en;
    }
  };

  const getLocalizedDescription = (item: MenuItem) => {
    const description = (() => {
      switch (i18n.language) {
        case 'fr': return item.description_fr;
        case 'nl': return item.description_nl;
        default: return item.description_en;
      }
    })();

    // Return null if description is empty or only whitespace to prevent empty text nodes
    return description && description.trim() ? description : null;
  };

  const getLocalizedSubtitle = (item: MenuItem) => {
    if (!item.subtitle_en) return null;
    const subtitle = (() => {
      switch (i18n.language) {
        case 'fr': return item.subtitle_fr;
        case 'nl': return item.subtitle_nl;
        default: return item.subtitle_en;
      }
    })();

    // Return null if subtitle is empty or only whitespace to prevent empty text nodes
    return subtitle && subtitle.trim() ? subtitle : null;
  };

  const getLocalizedTitle = (item: MenuItem) => {
    if (!item.title_en) return null;
    const title = (() => {
      switch (i18n.language) {
        case 'fr': return item.title_fr;
        case 'nl': return item.title_nl;
        default: return item.title_en;
      }
    })();

    // Return null if title is empty or only whitespace to prevent empty text nodes
    return title && title.trim() ? title : null;
  };

  const getWineImage = (title: string | null, id?: string) => {
    if (id === '42') {
      return require('@/assets/images/rosé.webp');
    }
    if (!title) return null;
    if (title.toLowerCase().includes('red')) {
      return require('@/assets/images/red-trans.webp');
    }
    if (title.toLowerCase().includes('white')) {
      return require('@/assets/images/white-trans.webp');
    }
    return null;
  };

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getDisplayDescription = (item: MenuItem) => {
    const fullDescription = getLocalizedDescription(item);
    if (!fullDescription) return null;

    const isExpanded = expandedItems.has(item.id);

    if (isExpanded) {
      return fullDescription;
    }

    return truncateText(fullDescription);
  };

  const getReadMoreText = (isExpanded: boolean) => {
    switch (i18n.language) {
      case 'fr': return isExpanded ? 'Lire moins' : 'Lire plus';
      case 'nl': return isExpanded ? 'Minder lezen' : 'Meer lezen';
      default: return isExpanded ? 'Read less' : 'Read more';
    }
  };

  const getSandwichesSubtitle = () => {
    switch (i18n.language) {
      case 'fr': return 'À emporter seulement';
      case 'nl': return 'Alleen afhaal';
      default: return 'Take away only';
    }
  };

  const filteredItems = menuItems.filter(item => item.category === selectedCategory);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flex: 1,
    },
    headerSection: {
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: 28,
      textAlign: 'center',
      fontFamily: theme.fonts.headingBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
      fontFamily: theme.fonts.body,
      color: theme.colors.textSecondary,
    },
    categoriesContainer: {
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
      overflow: 'hidden',
    },
    categoriesScrollView: {
      paddingHorizontal: theme.spacing.md,
    },
    categoryButton: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xl,
      backgroundColor: theme.colors.surface,
      marginRight: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      minWidth: 120,
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    categoryButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      ...theme.shadows.md,
    },
    categoryText: {
      fontSize: 14,
      fontFamily: theme.fonts.bodySemiBold,
      color: theme.colors.text,
      textAlign: 'center',
    },
    categoryTextActive: {
      color: '#FFFFFF',
    },
    menuItemsContainer: {
      padding: theme.spacing.md,
    },
    sandwichesSubtitle: {
      fontSize: 16,
      fontFamily: theme.fonts.bodyItalic,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      width: '100%',
    },
    // Single column layout for sandwiches category
    sandwichesContainer: {
      padding: theme.spacing.md,
    },
    sandwichesItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    sandwichesItemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.xs,
    },
    sandwichesItemName: {
      fontSize: 16,
      fontFamily: theme.fonts.headingSemiBold,
      color: theme.colors.text,
      flex: 1,
      marginRight: theme.spacing.xs,
    },
    sandwichesItemPrice: {
      fontSize: 16,
      fontFamily: theme.fonts.bodyBold,
      color: '#CD853F',
    },
    sandwichesItemDescription: {
      fontSize: 14,
      lineHeight: 18,
      fontFamily: theme.fonts.body,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    // Single column layout for soft drinks category
    softDrinksContainer: {
      padding: theme.spacing.md,
    },
    softDrinksItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    softDrinksItemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.xs,
    },
    softDrinksItemName: {
      fontSize: 16,
      fontFamily: theme.fonts.headingSemiBold,
      color: theme.colors.text,
      flex: 1,
      marginRight: theme.spacing.xs,
    },
    softDrinksItemPrice: {
      fontSize: 16,
      fontFamily: theme.fonts.bodyBold,
      color: '#CD853F',
    },
    softDrinksItemDescription: {
      fontSize: 14,
      lineHeight: 18,
      fontFamily: theme.fonts.body,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    // Single column layout for hot drinks category
    hotDrinksContainer: {
      padding: theme.spacing.md,
    },
    hotDrinksItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    hotDrinksItemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.xs,
    },
    hotDrinksItemName: {
      fontSize: 16,
      fontFamily: theme.fonts.headingSemiBold,
      color: theme.colors.text,
      flex: 1,
      marginRight: theme.spacing.xs,
    },
    hotDrinksItemPrice: {
      fontSize: 16,
      fontFamily: theme.fonts.bodyBold,
      color: '#CD853F',
    },
    hotDrinksItemDescription: {
      fontSize: 14,
      lineHeight: 18,
      fontFamily: theme.fonts.body,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    menuItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
      overflow: 'hidden',
      ...theme.shadows.md,
    },
    itemImage: {
      width: '100%',
      height: 200,
      resizeMode: 'contain',
    },
    itemContent: {
      padding: theme.spacing.lg,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    itemName: {
      fontSize: 18,
      fontFamily: theme.fonts.headingSemiBold,
      color: theme.colors.text,
      flex: 1,
    },
    itemTitle: {
      fontSize: 22,
      fontFamily: theme.fonts.headingBold,
      color: theme.colors.primary,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    itemPrice: {
      fontSize: 18,
      fontFamily: theme.fonts.bodyBold,
      color: theme.colors.primary,
    },
    itemSubtitle: {
      fontSize: 14,
      fontFamily: theme.fonts.body,
      color: theme.colors.textSecondary,
    },
    itemDescription: {
      fontSize: 14,
      lineHeight: 20,
      fontFamily: theme.fonts.body,
      color: theme.colors.textSecondary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    loadingText: {
      fontSize: 16,
      fontFamily: theme.fonts.body,
      color: theme.colors.textSecondary,
    },
    readMoreButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.primaryLight + '15',
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.primary + '30',
      alignSelf: 'flex-start',
      ...theme.shadows.sm,
    },
    readMoreText: {
      fontSize: 14,
      fontFamily: theme.fonts.bodySemiBold,
      color: theme.colors.primary,
      marginRight: theme.spacing.xs,
    },
    readMoreIcon: {
      marginLeft: theme.spacing.xs,
    },
    titleGroupContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    titleIcon: {
      marginRight: theme.spacing.sm,
    },
    wineImage: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
      marginLeft: theme.spacing.sm,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: theme.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fullWineImage: {
      width: 300,
      height: 300,
      resizeMode: 'contain',
    },
    lunchDishesContainer: {
      padding: theme.spacing.md,
    },
    lunchDishesItem: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
      overflow: 'hidden',
      ...theme.shadows.sm,
    },
    lunchDishesImage: {
      width: 80,
      height: 80,
      borderTopLeftRadius: theme.borderRadius.md,
      borderBottomLeftRadius: theme.borderRadius.md,
      marginRight: theme.spacing.md,
      backgroundColor: '#eee',
    },
    lunchDishesContent: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      paddingRight: theme.spacing.md,
    },
    lunchDishesHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    lunchDishesName: {
      fontSize: 16,
      fontFamily: theme.fonts.headingSemiBold,
      color: theme.colors.text,
    },
    lunchDishesPrice: {
      fontSize: 16,
      fontFamily: theme.fonts.bodyBold,
      color: theme.colors.primary,
    },
    lunchDishesDescription: {
      fontSize: 14,
      fontFamily: theme.fonts.body,
      color: theme.colors.textSecondary,
    },
    coldMezzesContainer: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    coldMezzesItem: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
      overflow: 'hidden',
      ...theme.shadows.sm,
    },
    coldMezzesImage: {
      width: 80,
      height: 80,
      borderTopLeftRadius: theme.borderRadius.md,
      borderBottomLeftRadius: theme.borderRadius.md,
      marginRight: theme.spacing.md,
      backgroundColor: '#eee',
    },
    coldMezzesContent: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      paddingRight: theme.spacing.md,
    },
    coldMezzesHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    coldMezzesName: {
      fontSize: 16,
      fontFamily: theme.fonts.headingSemiBold,
      color: theme.colors.text,
    },
    coldMezzesPrice: {
      fontSize: 16,
      fontFamily: theme.fonts.bodyBold,
      color: theme.colors.primary,
    },
    coldMezzesDescription: {
      fontSize: 14,
      fontFamily: theme.fonts.body,
      color: theme.colors.textSecondary,
    },
    hotMezzesContainer: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderSandwichesColumn = () => (
    <View style={styles.sandwichesContainer}>
      <Text style={styles.sandwichesSubtitle}>{getSandwichesSubtitle()}</Text>
      {filteredItems.map(item => (
        <View key={item.id} style={styles.sandwichesItem}>
          <View style={styles.sandwichesItemHeader}>
            <Text style={styles.sandwichesItemName}>{getLocalizedName(item)}</Text>
            <Text style={styles.sandwichesItemPrice}>
              {item.price_display || `${item.price.toFixed(2)}${t('common.currency')}`}
            </Text>
          </View>
          {getLocalizedDescription(item) && (
            <Text style={styles.sandwichesItemDescription}>{getLocalizedDescription(item)}</Text>
          )}
        </View>
      ))}
    </View>
  );

  const renderSoftDrinksColumn = () => (
    <View style={styles.softDrinksContainer}>
      {filteredItems.map(item => (
        <View key={item.id} style={styles.softDrinksItem}>
          <View style={styles.softDrinksItemHeader}>
            <Text style={styles.softDrinksItemName}>{getLocalizedName(item)}</Text>
            <Text style={styles.softDrinksItemPrice}>
              {item.price_display || `${item.price.toFixed(2)}${t('common.currency')}`}
            </Text>
          </View>
          {getLocalizedDescription(item) && (
            <Text style={styles.softDrinksItemDescription}>{getLocalizedDescription(item)}</Text>
          )}
        </View>
      ))}
    </View>
  );

  const renderHotDrinksColumn = () => (
    <View style={styles.hotDrinksContainer}>
      {filteredItems.map(item => (
        <View key={item.id} style={styles.hotDrinksItem}>
          <View style={styles.hotDrinksItemHeader}>
            <Text style={styles.hotDrinksItemName}>{getLocalizedName(item)}</Text>
            <Text style={styles.hotDrinksItemPrice}>
              {item.price_display || `${item.price.toFixed(2)}${t('common.currency')}`}
            </Text>
          </View>
          {getLocalizedDescription(item) && (
            <Text style={styles.hotDrinksItemDescription}>{getLocalizedDescription(item)}</Text>
          )}
        </View>
      ))}
    </View>
  );

  const renderLunchDishesColumn = () => (
    <View style={styles.lunchDishesContainer}>
      {filteredItems.map(item => (
        <View key={item.id} style={styles.lunchDishesItem}>
          {item.image_url && (
            <TouchableOpacity onPress={() => {
              setModalImage(item.image_url);
              setModalVisible(true);
            }}>
              <Image
                source={typeof item.image_url === 'string' ? { uri: item.image_url } : item.image_url}
                style={styles.lunchDishesImage}
                alt={getLocalizedName(item)}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
          <View style={styles.lunchDishesContent}>
            <View style={styles.lunchDishesHeader}>
              <Text style={styles.lunchDishesName}>{getLocalizedName(item)}</Text>
              <Text style={styles.lunchDishesPrice}>{`${item.price}€`}</Text>
            </View>
            <Text style={styles.lunchDishesDescription}>{getLocalizedDescription(item)}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderColdMezzesColumn = () => (
    <View style={styles.coldMezzesContainer}>
      {filteredItems.map(item => (
        <View key={item.id} style={styles.coldMezzesItem}>
          {item.image_url && (
            <TouchableOpacity onPress={() => {
              setModalImage(item.image_url);
              setModalVisible(true);
            }}>
              <Image
                source={typeof item.image_url === 'string' ? { uri: item.image_url } : item.image_url}
                style={styles.coldMezzesImage}
                alt={getLocalizedName(item)}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
          <View style={styles.coldMezzesContent}>
            <View style={styles.coldMezzesHeader}>
              <Text style={styles.coldMezzesName}>{getLocalizedName(item)}</Text>
              <Text style={styles.coldMezzesPrice}>{`${item.price}€`}</Text>
            </View>
            <Text style={styles.coldMezzesDescription}>{getLocalizedDescription(item)}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderHotMezzesColumn = () => (
    <View style={styles.coldMezzesContainer}>
      {filteredItems.map(item => (
        <View key={item.id} style={styles.coldMezzesItem}>
          {item.image_url && (
            <TouchableOpacity onPress={() => {
              setModalImage(item.image_url);
              setModalVisible(true);
            }}>
              <Image
                source={typeof item.image_url === 'string' ? { uri: item.image_url } : item.image_url}
                style={styles.coldMezzesImage}
                alt={getLocalizedName(item)}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
          <View style={styles.coldMezzesContent}>
            <View style={styles.coldMezzesHeader}>
              <Text style={styles.coldMezzesName}>{getLocalizedName(item)}</Text>
              <Text style={styles.coldMezzesPrice}>{`${item.price}€`}</Text>
            </View>
            <Text style={styles.coldMezzesDescription}>{getLocalizedDescription(item)}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderRegularMenu = () => (
    <View style={styles.menuItemsContainer}>
      {filteredItems.map((item, index) => (
        <View key={item.id}>
          {/* Show title only for the first item in a group with the same title */}
          {getLocalizedTitle(item) &&
            (index === 0 || getLocalizedTitle(filteredItems[index - 1]) !== getLocalizedTitle(item)) && (
              <View style={styles.titleContainer}>
                <Text style={styles.itemTitle}>{getLocalizedTitle(item)}</Text>
                <TouchableOpacity onPress={() => {
                  setModalImage(getWineImage(getLocalizedTitle(item), item.id));
                  setModalVisible(true);
                }}>
                  <Image source={getWineImage(getLocalizedTitle(item), item.id)} style={styles.wineImage} />
                </TouchableOpacity>
              </View>
            )}
          {/* Wrap items with the same title in a container */}
          {getLocalizedTitle(item) &&
            (index === 0 || getLocalizedTitle(filteredItems[index - 1]) !== getLocalizedTitle(item)) && (
              <View style={styles.titleGroupContainer}>
                {filteredItems.slice(index).map((groupItem, groupIndex) => {
                  // Stop when we reach an item with a different title
                  if (getLocalizedTitle(groupItem) !== getLocalizedTitle(item)) {
                    return null;
                  }
                  return (
                    <View key={groupItem.id} style={styles.menuItem}>
                      {groupItem.image_url && (
                        <ImageZoom
                          source={typeof groupItem.image_url === 'string' ? { uri: groupItem.image_url } : groupItem.image_url}
                          style={styles.itemImage}
                          alt={getLocalizedName(groupItem)}
                          resizeMode="contain"
                        />
                      )}
                      <View style={styles.itemContent}>
                        <View style={styles.itemHeader}>
                          <Text style={styles.itemName}>{getLocalizedName(groupItem)}</Text>
                          <Text style={styles.itemPrice}>
                            {groupItem.price_display || `${groupItem.price.toFixed(2)}${t('common.currency')}`}
                          </Text>
                        </View>
                        {getLocalizedSubtitle(groupItem) && (
                          <Text style={styles.itemSubtitle}>{getLocalizedSubtitle(groupItem)}</Text>
                        )}
                        {getDisplayDescription(groupItem) && (
                          <Text style={styles.itemDescription}>{getDisplayDescription(groupItem)}</Text>
                        )}
                        {getLocalizedDescription(groupItem) && getLocalizedDescription(groupItem)!.length > 80 && (
                          <TouchableOpacity
                            style={styles.readMoreButton}
                            onPress={() => toggleExpanded(groupItem.id)}
                          >
                            <Text style={styles.readMoreText}>
                              {getReadMoreText(expandedItems.has(groupItem.id))}
                            </Text>
                            <View style={styles.readMoreIcon}>
                              {expandedItems.has(groupItem.id) ? (
                                <ChevronUp size={16} color={theme.colors.primary} />
                              ) : (
                                <ChevronDown size={16} color={theme.colors.primary} />
                              )}
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          {/* Render items without titles normally */}
          {!getLocalizedTitle(item) && (
            <View style={styles.menuItem}>
              {item.image_url && (
                <ImageZoom
                  source={typeof item.image_url === 'string' ? { uri: item.image_url } : item.image_url}
                  style={styles.itemImage}
                  alt={getLocalizedName(item)}
                  resizeMode="contain"
                />
              )}
              <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{getLocalizedName(item)}</Text>
                  <Text style={styles.itemPrice}>
                    {item.price_display || `${item.price.toFixed(2)}${t('common.currency')}`}
                  </Text>
                </View>
                {getLocalizedSubtitle(item) && (
                  <Text style={styles.itemSubtitle}>{getLocalizedSubtitle(item)}</Text>
                )}
                {getDisplayDescription(item) && (
                  <Text style={styles.itemDescription}>{getDisplayDescription(item)}</Text>
                )}
                {getLocalizedDescription(item) && getLocalizedDescription(item)!.length > 80 && (
                  <TouchableOpacity
                    style={styles.readMoreButton}
                    onPress={() => toggleExpanded(item.id)}
                  >
                    <Text style={styles.readMoreText}>
                      {getReadMoreText(expandedItems.has(item.id))}
                    </Text>
                    <View style={styles.readMoreIcon}>
                      {expandedItems.has(item.id) ? (
                        <ChevronUp size={16} color={theme.colors.primary} />
                      ) : (
                        <ChevronDown size={16} color={theme.colors.primary} />
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>{t('menu.title')}</Text>
          <Text style={styles.subtitle}>{t('menu.subtitle')}</Text>
        </View>

        <View style={styles.categoriesContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollView}
            decelerationRate="fast"
            snapToInterval={140}
            snapToAlignment="start"
            scrollEventThrottle={16}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.categoryTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {selectedCategory === 'coldmezzes' ? renderColdMezzesColumn() :
          selectedCategory === 'sandwiches' ? renderSandwichesColumn() :
            selectedCategory === 'softdrinks' ? renderSoftDrinksColumn() :
              selectedCategory === 'hotdrinks' ? renderHotDrinksColumn() :
                selectedCategory === 'lunchdishes' ? renderLunchDishesColumn() :
                  selectedCategory === 'hotmezzes' ? renderHotMezzesColumn() :
                    renderRegularMenu()}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            {modalImage && (
              <Image source={modalImage} style={styles.fullWineImage} />
            )}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}