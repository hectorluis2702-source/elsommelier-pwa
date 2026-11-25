export type RegionTipo =
  | "tinto"
  | "blanco"
  | "espumoso"
  | "rosado"
  | "mixto"
  | "fortificado";

export type Vinedo = {
  nombre: string;
  nota?: string;
};

export type Zona = {
  nombre: string;
  vinedos: Vinedo[];
};

export type Region = {
  n: string;
  p: string;
  ll: [number, number];
  t: RegionTipo;
  uvas: string;
  d: string;
  /** Jerarquía Región → Zona → Viñedo */
  zonas?: Zona[];
};

export const TIPO_COLOR: Record<RegionTipo, string> = {
  tinto: "#B22222",
  blanco: "#2E8B57",
  espumoso: "#E8C840",
  rosado: "#D46090",
  mixto: "#E87040",
  fortificado: "#8B008B",
};

export const TIPO_LABEL: Record<RegionTipo, string> = {
  tinto: "Tinto",
  blanco: "Blanco",
  espumoso: "Espumoso",
  rosado: "Rosado",
  mixto: "Tinto & Blanco",
  fortificado: "Fortificado",
};

/** Datos preservados del mapa legacy + zonas/viñedos para navegación jerárquica */
export const REGIONES: Region[] = [
  {
    n: "Burdeos",
    p: "Francia",
    ll: [44.84, -0.58],
    t: "tinto",
    uvas: "Cabernet Sauvignon, Merlot, Cabernet Franc",
    d: "Capital mundial del vino tinto. Châteaux legendarios, clasificaciones de 1855. Dos riberas del Garona: Médoc al norte, Saint-Émilion y Pomerol al este. Clima oceánico templado.",
    zonas: [
      {
        nombre: "Médoc",
        vinedos: [
          { nombre: "Château Margaux", nota: "Premier Grand Cru Classé" },
          { nombre: "Château Latour", nota: "Pauillac" },
          { nombre: "Château Lafite Rothschild", nota: "Pauillac" },
        ],
      },
      {
        nombre: "Saint-Émilion",
        vinedos: [
          { nombre: "Château Ausone", nota: "Premier Grand Cru Classé A" },
          { nombre: "Château Cheval Blanc", nota: "Premier Grand Cru Classé A" },
        ],
      },
      {
        nombre: "Pomerol",
        vinedos: [{ nombre: "Pétrus", nota: "Ícono de Merlot" }],
      },
    ],
  },
  {
    n: "Borgoña",
    p: "Francia",
    ll: [47.05, 4.85],
    t: "mixto",
    uvas: "Pinot Noir, Chardonnay",
    d: "El terroir supremo. Cote de Nuits para Pinot Noir (Chambolle-Musigny, Gevrey-Chambertin), Cote de Beaune para Chardonnay (Meursault, Montrachet). Grand Cru vs Premier Cru: el universo más complejo del vino.",
    zonas: [
      {
        nombre: "Côte de Nuits",
        vinedos: [
          { nombre: "Romanée-Conti", nota: "Grand Cru" },
          { nombre: "Chambolle-Musigny", nota: "Pinot Noir" },
        ],
      },
      {
        nombre: "Côte de Beaune",
        vinedos: [
          { nombre: "Montrachet", nota: "Chardonnay Grand Cru" },
          { nombre: "Meursault", nota: "Blancos de estructura" },
        ],
      },
    ],
  },
  {
    n: "Champagne",
    p: "Francia",
    ll: [49.08, 3.95],
    t: "espumoso",
    uvas: "Pinot Noir, Chardonnay, Pinot Meunier",
    d: "La única región donde nace el verdadero Champagne. Método tradicional sobre suelos de creta yesosa únicos. Blanc de Blancs (100% Chardonnay) vs Blanc de Noirs. Prestige Cuvée vs NV.",
    zonas: [
      {
        nombre: "Montagne de Reims",
        vinedos: [{ nombre: "Verzenay", nota: "Pinot Noir grand cru" }],
      },
      {
        nombre: "Côte des Blancs",
        vinedos: [{ nombre: "Le Mesnil-sur-Oger", nota: "Chardonnay" }],
      },
    ],
  },
  {
    n: "Alsacia",
    p: "Francia",
    ll: [48.18, 7.45],
    t: "blanco",
    uvas: "Riesling, Gewürztraminer, Pinot Gris",
    d: "Frontera franco-alemana protegida por los Vosgos. Aromáticos únicos: Gewürztraminer especiado, Riesling seco y mineral. Vinos varietales sin roble, de identidad única en el mundo.",
  },
  {
    n: "Valle del Ródano",
    p: "Francia",
    ll: [44.9, 4.85],
    t: "tinto",
    uvas: "Syrah, Grenache, Mourvèdre, Viognier",
    d: "Norte: Syrah puro en Hermitage y Côte-Rôtie, vinos de poder tánico y longevidad. Sur: blends de Grenache en Châteauneuf-du-Pape. Clima mediterráneo con viento Mistral.",
    zonas: [
      {
        nombre: "Norte",
        vinedos: [
          { nombre: "Hermitage", nota: "Syrah" },
          { nombre: "Côte-Rôtie", nota: "Syrah + Viognier" },
        ],
      },
      {
        nombre: "Sur",
        vinedos: [{ nombre: "Châteauneuf-du-Pape", nota: "GSM blends" }],
      },
    ],
  },
  {
    n: "Rioja",
    p: "España",
    ll: [42.47, -2.45],
    t: "tinto",
    uvas: "Tempranillo, Garnacha, Mazuelo, Graciano",
    d: "La gran región clásica española. Crianza (2 años), Reserva (3 años), Gran Reserva (5 años). Tradición: roble americano. Revolución moderna: roble francés y vinos de viñedo único.",
    zonas: [
      {
        nombre: "Rioja Alta",
        vinedos: [{ nombre: "Haro", nota: "Clásicos de crianza" }],
      },
      {
        nombre: "Rioja Alavesa",
        vinedos: [{ nombre: "Laguardia", nota: "Tempranillo de altura" }],
      },
    ],
  },
  {
    n: "Priorat",
    p: "España",
    ll: [41.17, 0.72],
    t: "tinto",
    uvas: "Garnacha, Cariñena (Mazuelo)",
    d: "Suelo de llicorella (pizarra negra con mica) único en el mundo. Vinos de concentración extrema y mineralidad inigualable. DOCa junto a Rioja. Álvaro Palacios redescubrió esta región en 1989.",
  },
  {
    n: "Jerez",
    p: "España",
    ll: [36.68, -6.14],
    t: "fortificado",
    uvas: "Palomino Fino, Pedro Ximénez, Moscatel",
    d: "Cuna del Sherry. Sistema de soleras: mezcla de añadas para consistencia. Fino y Manzanilla: bajo flor de levadura. Amontillado y Oloroso: oxidativos. PX: el más dulce del mundo.",
  },
  {
    n: "Toscana",
    p: "Italia",
    ll: [43.4, 11.05],
    t: "tinto",
    uvas: "Sangiovese, Cabernet Sauvignon, Merlot",
    d: "Chianti Classico (Sangiovese en el corazón de Toscana), Brunello di Montalcino (el más longevo de Italia), Vino Nobile di Montepulciano. Super Tuscans: Sassicaia, Ornellaia, fuera del sistema DOC.",
    zonas: [
      {
        nombre: "Chianti Classico",
        vinedos: [{ nombre: "Greve in Chianti", nota: "Sangiovese" }],
      },
      {
        nombre: "Montalcino",
        vinedos: [{ nombre: "Brunello di Montalcino", nota: "100% Sangiovese" }],
      },
      {
        nombre: "Bolgheri",
        vinedos: [
          { nombre: "Sassicaia", nota: "Super Tuscan" },
          { nombre: "Ornellaia", nota: "Super Tuscan" },
        ],
      },
    ],
  },
  {
    n: "Piamonte",
    p: "Italia",
    ll: [44.7, 7.9],
    t: "tinto",
    uvas: "Nebbiolo, Barbera, Dolcetto, Moscato",
    d: 'Barolo y Barbaresco: "El Rey y la Reina del vino italiano". Nebbiolo da altísima acidez, taninos duros y aroma único de rosas, alquitrán y trufa. Requieren mínimo 10 años para develarse.',
    zonas: [
      {
        nombre: "Barolo",
        vinedos: [
          { nombre: "Serralunga d'Alba", nota: "Estructura" },
          { nombre: "La Morra", nota: "Elegancia" },
        ],
      },
      {
        nombre: "Barbaresco",
        vinedos: [{ nombre: "Barbaresco", nota: "Nebbiolo" }],
      },
    ],
  },
  {
    n: "Véneto",
    p: "Italia",
    ll: [45.45, 11.54],
    t: "mixto",
    uvas: "Corvina, Garganega, Glera",
    d: "Amarone della Valpolicella (uvas apasadas, 16%+ alcohol), Soave Classico (Garganega volcánico), Prosecco DOC/DOCG. La región más productiva de Italia con joyas de calidad extrema.",
  },
  {
    n: "Douro",
    p: "Portugal",
    ll: [41.15, -7.5],
    t: "fortificado",
    uvas: "Touriga Nacional, Touriga Franca, Tinta Roriz",
    d: "Valle en terrazas de granito y xisto (esquisto). Oporto Vintage (el más longevo), LBV, Tawny 10/20/30/40 años. Tintos secos Douro DOC: emergentes y de clase mundial.",
  },
  {
    n: "Mosel",
    p: "Alemania",
    ll: [49.95, 6.9],
    t: "blanco",
    uvas: "Riesling",
    d: "Viñedos en pendientes verticales de pizarra azul (Devonian slate). Riesling de alcohol bajo, acidez eléctrica y envejecimiento casi ilimitado. Escala Prädikat: Kabinett, Spätlese, Auslese, TBA.",
  },
  {
    n: "Rheingau",
    p: "Alemania",
    ll: [50.0, 8.0],
    t: "blanco",
    uvas: "Riesling, Spätburgunder",
    d: "Cuna histórica del Riesling alemán. Orientado al sur sobre el Rin. Schloss Johannisberg: primera vendimia tardía documentada del mundo (1775). Rieslings más estructurados y secos que el Mosel.",
  },
  {
    n: "Wachau",
    p: "Austria",
    ll: [48.35, 15.42],
    t: "blanco",
    uvas: "Grüner Veltliner, Riesling",
    d: "Valle del Danubio austriaco. Clasificación única: Steinfeder (ligero), Federspiel (medio), Smaragd (el más poderoso). Grüner Veltliner: pimienta blanca, elegancia herbácea, absolutamente único.",
  },
  {
    n: "Napa Valley",
    p: "EE.UU.",
    ll: [38.5, -122.4],
    t: "tinto",
    uvas: "Cabernet Sauvignon, Chardonnay, Merlot",
    d: "El Nuevo Mundo más prestigioso del planeta. Opus One, Screaming Eagle, Harlan Estate. 16 sub-AVAs. Oakville y Rutherford en el piso del valle: Cabernet de estructura tánica y fruta madura exuberante.",
    zonas: [
      {
        nombre: "Oakville",
        vinedos: [{ nombre: "Opus One", nota: "Cabernet blend" }],
      },
      {
        nombre: "Rutherford",
        vinedos: [{ nombre: "Inglenook", nota: "Histórico" }],
      },
    ],
  },
  {
    n: "Sonoma Coast",
    p: "EE.UU.",
    ll: [38.43, -122.72],
    t: "mixto",
    uvas: "Pinot Noir, Chardonnay, Zinfandel",
    d: "Más fresco y diverso que Napa. Russian River Valley para Pinot Noir de textura sedosa. Sonoma Coast con influencia del Pacífico: Chardonnay de mineralidad y elegancia europea.",
  },
  {
    n: "Willamette Valley",
    p: "EE.UU.",
    ll: [45.12, -123.05],
    t: "tinto",
    uvas: "Pinot Noir, Pinot Gris, Chardonnay",
    d: "Oregón como la alternativa borgoñona de América. Pinot Noir de acidez viva, taninos finos, aroma de frambuesa y tierra húmeda. Clima más fresco que Napa, suelos de volcanita Jory.",
  },
  {
    n: "Mendoza",
    p: "Argentina",
    ll: [-33.0, -68.83],
    t: "tinto",
    uvas: "Malbec, Cabernet Sauvignon, Torrontés",
    d: "La capital mundial del Malbec. Altitudes de 900-1400m sobre el nivel del mar. Luján de Cuyo: Malbec de cuerpo pleno. Valle de Uco: Malbec de elegancia y finura a 1200m+. Irresistibles para el paladar dominicano.",
    zonas: [
      {
        nombre: "Luján de Cuyo",
        vinedos: [{ nombre: "Catena Zapata", nota: "Malbec de altura" }],
      },
      {
        nombre: "Valle de Uco",
        vinedos: [{ nombre: "Zuccardi", nota: "Paraje Altamira" }],
      },
    ],
  },
  {
    n: "Valle del Maipo",
    p: "Chile",
    ll: [-33.75, -70.65],
    t: "tinto",
    uvas: "Cabernet Sauvignon, Carménère, Syrah",
    d: "Cuna del Cabernet Sauvignon chileno. Suelos de granito en el Alto Maipo (Pirque, Puente Alto). Concha y Toro Don Melchor y Almaviva: íconos del Nuevo Mundo. Carménère: la uva olvidada de Burdeos.",
  },
  {
    n: "Valle de Casablanca",
    p: "Chile",
    ll: [-33.3, -71.38],
    t: "blanco",
    uvas: "Sauvignon Blanc, Chardonnay, Pinot Noir",
    d: "Influencia oceánica del Pacífico a solo 90km de Santiago. Cool-climate: blancos frescos, aromáticos, de alta acidez. El mejor Sauvignon Blanc de Chile, compite con Nueva Zelanda en elegancia.",
  },
  {
    n: "Barossa Valley",
    p: "Australia",
    ll: [-34.53, 138.95],
    t: "tinto",
    uvas: "Shiraz, Cabernet Sauvignon, Grenache",
    d: "Shiraz australiano de cuerpo hercúleo. Cepas viejas centenarias de 80-160 años. Penfolds Grange: el vino más emblemático de Oceanía desde 1951. Granache-Shiraz-Mourvèdre (GSM): la gran trinidad australiana.",
  },
  {
    n: "Margaret River",
    p: "Australia",
    ll: [-33.95, 115.07],
    t: "mixto",
    uvas: "Cabernet Sauvignon, Chardonnay, Semillon",
    d: "Clima marítimo moderado en la punta suroeste de Australia. Cabernet-Merlot de estructura bordelesa con fruta australiana. Chardonnay de clase mundial. Vamoos, Leeuwin Estate Art Series: a la altura de Borgoña.",
  },
  {
    n: "Marlborough",
    p: "Nueva Zelanda",
    ll: [-41.5, 173.95],
    t: "blanco",
    uvas: "Sauvignon Blanc, Pinot Noir, Pinot Gris",
    d: "Definió para siempre el estilo mundial del Sauvignon Blanc: tropical (maracuyá, mango) y herbáceo (hierba cortada, pimiento) a la vez. Suelos de gravas aluviales, clima fresco y soleado. Cloudy Bay lo puso en el mapa.",
  },
  {
    n: "Stellenbosch",
    p: "Sudáfrica",
    ll: [-33.93, 18.86],
    t: "tinto",
    uvas: "Cabernet Sauvignon, Pinotage, Chenin Blanc",
    d: 'La región más importante de la viticultura sudafricana desde 1679. Pinotage: cruce único de Pinot Noir x Cinsault creado en SA (1925). Chenin Blanc llamado "Steen" localmente: el más versátil del mundo.',
  },
  {
    n: "Maipo/Colchagua",
    p: "Chile",
    ll: [-34.5, -71.2],
    t: "tinto",
    uvas: "Carménère, Cabernet Sauvignon, Merlot",
    d: "Colchagua: el valle más cálido del centro de Chile. Carménère de cuerpo pleno y pimienta verde característica. Apaltaen Colchagua: Viña Montes Alpha, Miguel Torres Chile. Excelente relación calidad-precio.",
  },
];
