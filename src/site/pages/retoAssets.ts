const sharedAssetPath = '/assets/pame-flores-crea/500-extra';
const assetPath = '/assets/pame-flores-crea';

export const RETO_ASSETS = {
  logo: `${sharedAssetPath}/logo-pame-flores-crea.png`,
  hero: `${assetPath}/pame/pame-ballena-libro-sensorial.webp`,
  pame: `${sharedAssetPath}/familia-pame.jpg`,
  confirmation: `${sharedAssetPath}/pame-vip-creativa.webp`,
  classes: [
    `${assetPath}/campaigns/reto/clase-ruta-juguetes-educativos.webp`,
    `${assetPath}/campaigns/reto/clase-ingresos-libros-sensoriales.webp`,
    `${assetPath}/campaigns/reto/clase-clientes-libros-sensoriales.webp`,
    `${assetPath}/campaigns/reto/clase-jugueteria-rentable.webp`,
  ],
  testimonials: [`${assetPath}/social-proof/testimonios-alumnas-clases.webp`],
} as const;
