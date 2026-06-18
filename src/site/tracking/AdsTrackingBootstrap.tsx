import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { isAdsRoutePath } from '../../core/routing/adsRoute';
import analytics from '../../core/services/analytics';

const trackedAdsPageViewUrls = new Set<string>();

export function AdsTrackingBootstrap() {
  const location = useLocation();
  const pageViewKey = `${location.pathname}${location.search}`;

  useEffect(() => {
    if (!isAdsRoutePath(location.pathname) || trackedAdsPageViewUrls.has(pageViewKey)) {
      return;
    }

    trackedAdsPageViewUrls.add(pageViewKey);
    void analytics.trackMetaPageView(location.pathname);
  }, [location.pathname, pageViewKey]);

  return null;
}
