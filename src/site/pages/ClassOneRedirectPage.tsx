import { ClassRedirectPage } from './ClassRedirectPage';

export const CLASS_ONE_YOUTUBE_URL =
  'https://www.youtube.com/live/TOs7QG_RjE8?si=C-qfhM8KUrOu7y57';
export const CLASS_ONE_ORGANIC_REDIRECT_DELAY_MS = 1500;
export const CLASS_ONE_ADS_REDIRECT_DELAY_MS = 2500;

export const CLASS_ONE_TITLE = 'Clase 1 | Pame Flores Crea';
export const CLASS_ONE_DESCRIPTION = 'Redirigiendo a la Clase 1 de Pame Flores Crea.';

export function ClassOneRedirectPage() {
  return (
    <ClassRedirectPage
      classNumber={1}
      youtubeUrl={CLASS_ONE_YOUTUBE_URL}
      title={CLASS_ONE_TITLE}
      description={CLASS_ONE_DESCRIPTION}
      adsDelayMs={CLASS_ONE_ADS_REDIRECT_DELAY_MS}
      organicDelayMs={CLASS_ONE_ORGANIC_REDIRECT_DELAY_MS}
    />
  );
}
