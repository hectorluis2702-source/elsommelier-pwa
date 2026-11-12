/** Nueva sección Videos — contenido editorial del templo */
export type VideoItem = {
  id: string;
  titulo: string;
  descripcion: string;
  duracion: string;
  categoria: "cata" | "maridaje" | "regiones" | "academia";
  /** Placeholder visual tone until real video embeds are wired */
  tone: string;
};

export const VIDEOS: VideoItem[] = [
  {
    id: "cata-01",
    titulo: "Como catar un vino en 5 minutos",
    descripcion:
      "Vista, nariz y boca: el ritual esencial del sommelier, explicado para el paladar caribeno.",
    duracion: "5:20",
    categoria: "cata",
    tone: "from-[#2a0808] to-[#0a0a0a]",
  },
  {
    id: "maridaje-01",
    titulo: "Mofongo y Albarino",
    descripcion:
      "Por que la acidez gallega abraza el ajo y el platano como un mar que besa la costa.",
    duracion: "7:12",
    categoria: "maridaje",
    tone: "from-[#1a2a18] to-[#0a0a0a]",
  },
  {
    id: "regiones-01",
    titulo: "Viaje a Rioja",
    descripcion:
      "Crianza, Reserva y Gran Reserva: la escalera temporal del Tempranillo espanol.",
    duracion: "9:45",
    categoria: "regiones",
    tone: "from-[#2a1018] to-[#0a0a0a]",
  },
  {
    id: "academia-01",
    titulo: "Aromas terciarios",
    descripcion:
      "Como el tiempo en barrica y botella transforma un vino y crea complejidad unica.",
    duracion: "8:00",
    categoria: "academia",
    tone: "from-[#1a1828] to-[#0a0a0a]",
  },
  {
    id: "cata-02",
    titulo: "Decantar o no decantar",
    descripcion:
      "Cuando abrir el vino con anticipacion cambia todo — y cuando es un error.",
    duracion: "4:38",
    categoria: "cata",
    tone: "from-[#281808] to-[#0a0a0a]",
  },
  {
    id: "maridaje-02",
    titulo: "Sancocho y Syrah",
    descripcion:
      "Especias, caldo profundo y un tinto del Rodano norte: el maridaje inesperado.",
    duracion: "6:05",
    categoria: "maridaje",
    tone: "from-[#2a1408] to-[#0a0a0a]",
  },
];

export const VIDEO_CATEGORIAS: { id: VideoItem["categoria"] | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "cata", label: "Cata" },
  { id: "maridaje", label: "Maridaje" },
  { id: "regiones", label: "Regiones" },
  { id: "academia", label: "Academia" },
];
