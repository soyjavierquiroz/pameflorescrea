# Assets de CONQUISTA LA JUGUETERÍA RENTABLE

La página obtiene todas las rutas desde `src/site/pages/retoAssets.ts`. Las rutas de las tablas son relativas a `public/assets/pame-flores-crea/`. Los números de día se definen en el orden de `RETO_ASSETS.classes`, no en los nombres de archivo.

## Assets nuevos compartidos

| Sección | Ruta | Origen | Motivo |
| --- | --- | --- | --- |
| Hero | `pame/pame-ballena-libro-sensorial.webp` | `hero.webp` | Retrato de Pame con ballena de tela y libro sensorial; sin texto ni fecha. Versión de 1080 × 1350 de la misma toma de `oferta/pame-oferta.webp` (540 × 675). Se conserva separada por su mayor resolución. |
| Prueba social | `social-proof/testimonios-alumnas-clases.webp` | `testimonios.webp` | Collage de comentarios sobre las clases de Pame; sin fecha ni nombre exclusivo del reto. Se muestra completo, sin cortar ni separar. |

## Assets específicos del reto

| Sección | Ruta | Origen | Motivo |
| --- | --- | --- | --- |
| Día 1 | `campaigns/reto/clase-ruta-juguetes-educativos.webp` | `class-1.webp` | Arte con título de la clase y «CLASE 1». |
| Día 2 | `campaigns/reto/clase-ingresos-libros-sensoriales.webp` | `class-2.webp` | Arte con título de la clase y «CLASE 2». |
| Día 3 | `campaigns/reto/clase-clientes-libros-sensoriales.webp` | `class-3.webp` | Arte con título de la clase y «CLASE 3». |
| Día 4 | `campaigns/reto/clase-jugueteria-rentable.webp` | `class-4.webp` | Arte con título de la clase y «CLASE 4». |

Ninguno de los seis WebP nuevos contiene fechas. Las piezas de clase llevan texto incrustado y solo tienen sentido dentro de este programa de cuatro clases. Ningún archivo nuevo coincide por SHA-256 con un archivo de `500-extra/` u `oferta/`.

## Assets existentes usados sin mover

| Sección | Ruta actual |
| --- | --- |
| Logo | `500-extra/logo-pame-flores-crea.png` |
| Historia de Pame | `500-extra/familia-pame.jpg` |
| Confirmación | `500-extra/pame-vip-creativa.webp` |

## Pendientes

- No llegó una imagen exclusiva de confirmación; se sigue usando el retrato existente.
- No llegaron imágenes adicionales para una galería independiente; `/reto` no renderiza una sección de galería separada.
- `brand/` y `projects/` quedan preparados para futuros assets, sin copias del logo ni fotografías de proyecto en esta entrega.
