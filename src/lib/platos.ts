import { PLATO_IMAGES } from "./media";

export type Plato = {
  id: string;
  nombre: string;
  tone: string;
  desc: string;
  image: string;
};

export const PLATOS_TRADICIONALES: Plato[] = [
  {
    id: "mofongo",
    nombre: "Mofongo",
    tone: "from-[#3d2a14] to-[#1a1008]",
    desc: "Platano frito majado con ajo",
    image: PLATO_IMAGES.mofongo,
  },
  {
    id: "sancocho",
    nombre: "Sancocho",
    tone: "from-[#4a3018] to-[#1f1208]",
    desc: "Guiso caribeno de raices y carnes",
    image: PLATO_IMAGES.sancocho,
  },
  {
    id: "chivo-guisado",
    nombre: "Chivo guisado",
    tone: "from-[#4a1a12] to-[#1a0806]",
    desc: "Estofado intenso de chivo",
    image: PLATO_IMAGES["chivo-guisado"],
  },
  {
    id: "pastelon",
    nombre: "Pastelon",
    tone: "from-[#5a3a18] to-[#221408]",
    desc: "Lasana de platano maduro",
    image: PLATO_IMAGES.pastelon,
  },
  {
    id: "mangu",
    nombre: "Mangu",
    tone: "from-[#3a3a20] to-[#181808]",
    desc: "Pure de platano verde",
    image: PLATO_IMAGES.mangu,
  },
  {
    id: "pollo-guisado",
    nombre: "Pollo guisado",
    tone: "from-[#5a2818] to-[#1f0c08]",
    desc: "Pollo en salsa criolla",
    image: PLATO_IMAGES["pollo-guisado"],
  },
  {
    id: "pescado-al-coco",
    nombre: "Pescado al coco",
    tone: "from-[#1a3540] to-[#0a181c]",
    desc: "Pescado en crema de coco",
    image: PLATO_IMAGES["pescado-al-coco"],
  },
  {
    id: "chicharron",
    nombre: "Chicharron",
    tone: "from-[#5a3010] to-[#201008]",
    desc: "Cerdo crocante frito",
    image: PLATO_IMAGES.chicharron,
  },
  {
    id: "la-bandera",
    nombre: "La Bandera",
    tone: "from-[#3a1a20] to-[#14080c]",
    desc: "Arroz, habichuelas y carne",
    image: PLATO_IMAGES["la-bandera"],
  },
  {
    id: "locrio-de-pollo",
    nombre: "Locrio de pollo",
    tone: "from-[#4a3810] to-[#1a1406]",
    desc: "Arroz amarillo con pollo",
    image: PLATO_IMAGES["locrio-de-pollo"],
  },
  {
    id: "asopao",
    nombre: "Asopao",
    tone: "from-[#3a2818] to-[#140e08]",
    desc: "Guiso espeso de arroz",
    image: PLATO_IMAGES.asopao,
  },
  {
    id: "yaroa",
    nombre: "Yaroa",
    tone: "from-[#4a2a10] to-[#1a1006]",
    desc: "Capas de papa, carne y queso",
    image: PLATO_IMAGES.yaroa,
  },
];

export const PRESUPUESTOS = [
  { value: "cualquiera", label: "Sin limite" },
  { value: "menos de $20 USD", label: "Hasta $20 USD" },
  { value: "$20 a $50 USD", label: "$20 - $50 USD" },
  { value: "$50 a $100 USD", label: "$50 - $100 USD" },
  { value: "mas de $100 USD", label: "Mas de $100 USD" },
];
