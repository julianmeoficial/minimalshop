import type { StaticImageData } from 'next/image';

import camisetaBlanca from '@/public/images/camiseta-blanca.jpg';
import cuencosBlancos from '@/public/images/cuencos-blancos.jpg';
import envioKraft from '@/public/images/envio-kraft.jpg';
import heroJarrones from '@/public/images/hero-jarrones.jpg';
import linoDoblado from '@/public/images/lino-doblado.jpg';
import sombraPlanta from '@/public/images/sombra-planta.jpg';
import tallerCeramica from '@/public/images/taller-ceramica.jpg';
import tazaSombra from '@/public/images/taza-sombra.jpg';

/**
 * Editorial photography. Every image is published under the Unsplash License
 * (free for commercial and non-commercial use, no permission needed). Credits are
 * still shown on /creditos as a courtesy to each photographer.
 */
export interface EditorialPhoto {
  readonly src: StaticImageData;
  /** Spanish alt text. Empty string only when the image is purely decorative. */
  readonly alt: string;
  readonly author: string;
  readonly authorUrl: string;
  readonly sourceUrl: string;
}

const unsplash = (username: string) => `https://unsplash.com/@${username}`;
const photo = (slug: string) => `https://unsplash.com/photos/${slug}`;

export const photos = {
  hero: {
    src: heroJarrones,
    alt: 'Dos jarrones de cerámica blanca sobre un paño de lino, con luz suave de ventana.',
    author: '@wariontaipei',
    authorUrl: unsplash('wariontaipei'),
    sourceUrl: photo('minimalist-photography-of-two-white-ceramic-vases-8QIAj5tHDdc'),
  },
  taller: {
    src: tallerCeramica,
    alt: 'Manos con arcilla dando forma a una vasija en el torno.',
    author: '@courtneymcook',
    authorUrl: unsplash('courtneymcook'),
    sourceUrl: photo('person-holding-white-clay-pot-nXYmYO_-JUk'),
  },
  lino: {
    src: linoDoblado,
    alt: 'Textiles de lino doblados en tonos crudos sobre un banco de madera.',
    author: '@kekse_und_ich',
    authorUrl: unsplash('kekse_und_ich'),
    sourceUrl: photo('white-textile-on-brown-wooden-table-HbiRi1Owk9k'),
  },
  envio: {
    src: envioKraft,
    alt: 'Caja de cartón kraft abierta con una prenda envuelta en papel.',
    author: '@mildlee',
    authorUrl: unsplash('mildlee'),
    sourceUrl: photo('brown-cardboard-box-on-white-table-7KKy7-TeeVs'),
  },
  camiseta: {
    src: camisetaBlanca,
    alt: 'Camiseta blanca colgada de un gancho de madera contra un muro claro.',
    author: '@avtar9w',
    authorUrl: unsplash('avtar9w'),
    sourceUrl: photo('a-plain-white-t-shirt-hangs-on-a-wooden-hanger-8ACmRoleM24'),
  },
  sombra: {
    src: sombraPlanta,
    alt: 'Sombra de una planta proyectada por el sol sobre un muro blanco.',
    author: '@anna_khromova',
    authorUrl: unsplash('anna_khromova'),
    sourceUrl: photo('plant-shadow-on-white-wall-1BeIqdYh68w'),
  },
  cuencos: {
    src: cuencosBlancos,
    alt: 'Cuencos de cerámica blanca esmaltada apilados.',
    author: '@tomcrewceramics',
    authorUrl: unsplash('tomcrewceramics'),
    sourceUrl: photo('round-white-ceramic-bowls-04pszRu0g68'),
  },
  taza: {
    src: tazaSombra,
    alt: 'Taza de cerámica sobre una mesa blanca con su sombra alargada.',
    author: '@brunxs',
    authorUrl: unsplash('brunxs'),
    sourceUrl: photo('a-brown-cup-sitting-on-top-of-a-white-table-VegtG-B3Odc'),
  },
} as const satisfies Record<string, EditorialPhoto>;

export type PhotoKey = keyof typeof photos;
