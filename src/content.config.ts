import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const personajes = defineCollection({
  loader: file('src/data/personajes.json'),
  schema: z.object({
    id: z.string(),
    nombre: z.string(),
    nombre_japones: z.string().nullable(),
    tipo: z.enum(['aliado', 'demonio', 'secundario']),
    imagen_url: z.string().url().nullable(),
    descripcion: z.string(),
    fuente: z.string(),
    url_fuente: z.string().url().nullable(),
  }),
});

const capitulos = defineCollection({
  loader: file('src/data/capitulos.json', {
    parser: (texto) =>
      JSON.parse(texto).map((capitulo: { numero: number }) => ({
        id: String(capitulo.numero),
        ...capitulo,
      })),
  }),
  schema: z.object({
    id: z.string(),
    numero: z.number().int().positive(),
    titulo: z.string(),
    titulo_ingles: z.string(),
    titulo_japones: z.string(),
    titulo_romaji: z.string(),
    volumen: z.number().int().positive(),
    sinopsis: z.string().nullable(),
    fuente: z.string(),
  }),
});

const episodios = defineCollection({
  loader: file('src/data/episodios.json', {
    parser: (texto) =>
      JSON.parse(texto).map((episodio: { numero: number }) => ({
        id: String(episodio.numero),
        ...episodio,
      })),
  }),
  schema: z.object({
    id: z.string(),
    numero: z.number().int().positive(),
    titulo: z.string(),
    titulo_ingles: z.string(),
    titulo_japones: z.string(),
    titulo_romaji: z.string(),
    fecha_emision: z.string(),
    fecha_emision_japon: z.string(),
    sinopsis: z.string(),
    fuente: z.string(),
  }),
});

const galeria = defineCollection({
  loader: file('src/data/galeria.json', {
    parser: (texto) =>
      JSON.parse(texto).map(
        (registro: { imagen_url: string }, indice: number) => ({
          id: String(indice),
          ...registro,
        }),
      ),
  }),
  schema: z.object({
    id: z.string(),
    imagen_url: z.string().url(),
    titulo: z.string(),
    descripcion: z.string(),
    fuente: z.string(),
    url_fuente: z.string().url(),
  }),
});

export const collections = { personajes, capitulos, episodios, galeria };
