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

export const collections = { personajes };
