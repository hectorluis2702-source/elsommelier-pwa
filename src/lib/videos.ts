/** Videoteca — clips reales de enología (Pexels MP4) */
export type VideoItem = {
  id: string;
  titulo: string;
  descripcion: string;
  duracion: string;
  categoria: "cata" | "maridaje" | "regiones" | "academia";
  tone: string;
  /** Direct MP4 URL — playable in-app */
  src: string;
  poster: string;
};

export const VIDEOS: VideoItem[] = [
  {
    id: "cata-01",
    titulo: "Como catar un vino en 5 minutos",
    descripcion:
      "Vista, nariz y boca: el ritual esencial del sommelier, explicado para el paladar caribeno.",
    duracion: "0:45",
    categoria: "cata",
    tone: "from-[#2a0808] to-[#0a0a0a]",
    src: "https://videos.pexels.com/video-files/4763824/4763824-hd_1280_720_24fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "maridaje-01",
    titulo: "Mofongo y Albarino",
    descripcion:
      "Por que la acidez gallega abraza el ajo y el platano como un mar que besa la costa.",
    duracion: "0:40",
    categoria: "maridaje",
    tone: "from-[#1a2a18] to-[#0a0a0a]",
    src: "https://videos.pexels.com/video-files/3571264/3571264-hd_1280_720_30fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "regiones-01",
    titulo: "Viaje a Rioja",
    descripcion:
      "Crianza, Reserva y Gran Reserva: la escalera temporal del Tempranillo espanol.",
    duracion: "0:50",
    categoria: "regiones",
    tone: "from-[#2a1018] to-[#0a0a0a]",
    src: "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "academia-01",
    titulo: "Aromas terciarios",
    descripcion:
      "Como el tiempo en barrica y botella transforma un vino y crea complejidad unica.",
    duracion: "0:45",
    categoria: "academia",
    tone: "from-[#1a1828] to-[#0a0a0a]",
    src: "https://videos.pexels.com/video-files/4763824/4763824-hd_1280_720_24fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "cata-02",
    titulo: "Decantar o no decantar",
    descripcion:
      "Cuando abrir el vino con anticipacion cambia todo — y cuando es un error.",
    duracion: "0:40",
    categoria: "cata",
    tone: "from-[#281808] to-[#0a0a0a]",
    src: "https://videos.pexels.com/video-files/3571264/3571264-hd_1280_720_30fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "maridaje-02",
    titulo: "Sancocho y Syrah",
    descripcion:
      "Especias, caldo profundo y un tinto del Rodano norte: el maridaje inesperado.",
    duracion: "0:50",
    categoria: "maridaje",
    tone: "from-[#2a1408] to-[#0a0a0a]",
    src: "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=80",
  },
];

export const VIDEO_CATEGORIAS: { id: VideoItem["categoria"] | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "cata", label: "Cata" },
  { id: "maridaje", label: "Maridaje" },
  { id: "regiones", label: "Regiones" },
  { id: "academia", label: "Academia" },
];
