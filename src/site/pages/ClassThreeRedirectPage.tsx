import { ClassRedirectPage } from './ClassRedirectPage';

export const CLASS_THREE_YOUTUBE_URL = 'https://www.youtube.com/live/TgCRNytNSPA';
export const CLASS_THREE_ORGANIC_REDIRECT_DELAY_MS = 1500;
export const CLASS_THREE_ADS_REDIRECT_DELAY_MS = 2500;

export const CLASS_THREE_TITLE = 'Clase 3 | Pame Flores Crea';
export const CLASS_THREE_DESCRIPTION = 'Redirigiendo a la Clase 3 de Pame Flores Crea.';

export function ClassThreeRedirectPage() {
  return (
    <ClassRedirectPage
      classNumber={3}
      youtubeUrl={CLASS_THREE_YOUTUBE_URL}
      title={CLASS_THREE_TITLE}
      description={CLASS_THREE_DESCRIPTION}
      adsDelayMs={CLASS_THREE_ADS_REDIRECT_DELAY_MS}
      organicDelayMs={CLASS_THREE_ORGANIC_REDIRECT_DELAY_MS}
    />
  );
}
