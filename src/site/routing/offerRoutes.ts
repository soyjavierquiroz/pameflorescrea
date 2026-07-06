import type { Location } from 'react-router-dom';
import { getAdsRoutePrefix } from '../../core/routing/adsRoute';

export function buildTemporaryOfferRedirectTarget(
  location: Pick<Location, 'pathname' | 'search' | 'hash'>,
  ads = false,
  adsRoutePrefix = getAdsRoutePrefix(),
): string {
  const targetPath = ads ? `${adsRoutePrefix}/oferta/` : '/oferta/';

  return `${targetPath}${location.search}${location.hash}`;
}
