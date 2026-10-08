import { withAdsRoutePrefix } from '../../core/routing/adsRoute';

export type WhatsappMode = 'hidden' | 'optional' | 'required';

export interface CampaignConfig {
  campaignId: string;
  landingSlug: string;
  captureListSlug: string;
  eventName: string;
  source: string;
  organicLandingPath: string;
  adsLandingPath: string;
  organicConfirmationPath: string;
  adsConfirmationPath: string;
  registrationStorageKey: string;
  pendingConversionStorageKey: string;
  eventIdPrefix: string;
  whatsapp: WhatsappMode;
  includeCampaignId: boolean;
  form: {
    ariaLabel: string;
    labelMode: 'visible' | 'sr-only';
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    whatsappPlaceholder?: string;
    buttonText: string;
    footerText?: string;
  };
}

export const creativeToysCampaign: CampaignConfig = {
  campaignId: '500-extra',
  landingSlug: '500-extra',
  captureListSlug: '500-extra',
  eventName: 'SEMANA DEL EMPRENDIMIENTO CON JUGUETES CREATIVOS',
  source: 'pameflorescrea.com',
  organicLandingPath: '/500-extra',
  adsLandingPath: withAdsRoutePrefix('/500-extra'),
  organicConfirmationPath: '/confirmacion/500-extra',
  adsConfirmationPath: withAdsRoutePrefix('/confirmacion/500-extra'),
  registrationStorageKey: 'pame_500_extra_registration_v1',
  pendingConversionStorageKey: 'pame_500_extra_pending_conversion_v1',
  eventIdPrefix: 'pame_500_extra_',
  whatsapp: 'hidden',
  includeCampaignId: false,
  form: {
    ariaLabel: 'Registro gratis Semana del Emprendimiento con Juguetes Creativos',
    labelMode: 'sr-only',
    nameLabel: 'Nombre',
    namePlaceholder: 'Tu nombre',
    emailLabel: 'Correo',
    emailPlaceholder: 'Tu correo',
    buttonText: 'QUIERO REGISTRARME GRATIS',
    footerText: 'Registro gratuito · Cupos limitados · Acceso por WhatsApp',
  },
};

export const retoCampaign: CampaignConfig = {
  campaignId: 'reto',
  landingSlug: 'reto',
  captureListSlug: 'reto',
  eventName: 'CONQUISTA LA JUGUETERÍA RENTABLE',
  source: 'pameflorescrea.com',
  organicLandingPath: '/reto',
  adsLandingPath: withAdsRoutePrefix('/reto'),
  organicConfirmationPath: '/confirmacion/reto',
  adsConfirmationPath: withAdsRoutePrefix('/confirmacion/reto'),
  registrationStorageKey: 'pame_reto_registration_v1',
  pendingConversionStorageKey: 'pame_reto_pending_conversion_v1',
  eventIdPrefix: 'pame_reto_',
  whatsapp: 'hidden',
  includeCampaignId: true,
  form: {
    ariaLabel: 'Registro gratis Conquista la Juguetería Rentable',
    labelMode: 'sr-only',
    nameLabel: 'NOMBRE *',
    namePlaceholder: 'NOMBRE *',
    emailLabel: 'CORREO ELECTRÓNICO *',
    emailPlaceholder: 'CORREO ELECTRÓNICO *',
    whatsappPlaceholder: 'WHATSAPP',
    buttonText: '¡QUIERO MI LUGAR GRATIS!',
  },
};
