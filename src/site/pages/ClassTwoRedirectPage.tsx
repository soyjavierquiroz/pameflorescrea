import { ClassRedirectPage } from './ClassRedirectPage';

export const CLASS_TWO_YOUTUBE_URL =
  'https://www.youtube.com/live/qL1HjGtSUac?si=_8FTe8Kz4-MHWWBs';
export const CLASS_TWO_ORGANIC_REDIRECT_DELAY_MS = 1500;
export const CLASS_TWO_ADS_REDIRECT_DELAY_MS = 2500;

export const CLASS_TWO_TITLE = 'Clase 2 | Pame Flores Crea';
export const CLASS_TWO_DESCRIPTION = 'Redirigiendo a la Clase 2 de Pame Flores Crea.';

export function ClassTwoRedirectPage() {
  return (
    <ClassRedirectPage
      classNumber={2}
      youtubeUrl={CLASS_TWO_YOUTUBE_URL}
      title={CLASS_TWO_TITLE}
      description={CLASS_TWO_DESCRIPTION}
      adsDelayMs={CLASS_TWO_ADS_REDIRECT_DELAY_MS}
      organicDelayMs={CLASS_TWO_ORGANIC_REDIRECT_DELAY_MS}
    />
  );
}
