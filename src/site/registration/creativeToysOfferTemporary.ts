import { isAdsRoutePath } from '../../core/routing/adsRoute';

export const TEMPORARY_OFFER_CHECKOUT_URL = 'https://crm.pameflorescrea.com/pagos';
export const TEMPORARY_OFFER_SUPPORT_WHATSAPP_URL =
  'https://api.whatsapp.com/send?phone=+593992526260&text=Tengo%20preguntas.%20%C2%BFPueden%20ayudarme?';
export const TEMPORARY_OFFER_SLUG = 'certificacion-jugueteria-creativa';

export function shouldTrackTemporaryOfferCheckout(pathname: string): boolean {
  return isAdsRoutePath(pathname);
}

export function buildTemporaryOfferCheckoutEventData({
  eventId,
  eventSourceUrl,
}: {
  eventId: string;
  eventSourceUrl: string;
}) {
  return {
    event_id: eventId,
    event_source_url: eventSourceUrl,
    offer_slug: TEMPORARY_OFFER_SLUG,
    content_name: 'Certificación de Juguetería Creativa Profesional',
    content_ids: [TEMPORARY_OFFER_SLUG],
    value: 197,
    currency: 'USD',
    checkout_url: TEMPORARY_OFFER_CHECKOUT_URL,
  };
}
