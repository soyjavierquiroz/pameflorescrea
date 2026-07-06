import type { Location } from 'react-router-dom';
import { getAdsRoutePrefix } from '../../core/routing/adsRoute';

export function buildLegacyOfferRedirectTarget(
  location: Pick<Location, 'pathname' | 'search' | 'hash'>,
  ads = false,
  adsRoutePrefix = getAdsRoutePrefix(),
): string {
  const targetPath = ads ? `${adsRoutePrefix}/oferta` : '/oferta';
  const trailingSlash = location.pathname.endsWith('/') ? '/' : '';

  return `${targetPath}${trailingSlash}${location.search}${location.hash}`;
}
