import { useEffect, useRef, useState } from 'react';
import funnelConfig from '../../core/config/funnel.config';
import analytics from '../../core/services/analytics';
import type { CampaignConfig } from './campaigns';
import {
  COMPLETE_REGISTRATION_EVENT_NAME,
  markCampaignConversionFailed,
  markCampaignConversionSent,
  readCampaignPendingConversion,
  shouldTrackCampaignConversion,
} from './campaignRegistration';

const TRACKING_REDIRECT_TIMEOUT_MS = 2000;

export function useCampaignConfirmationTracking(campaign: CampaignConfig, pathname: string): boolean {
  const [ready, setReady] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    const markReady = () => { if (mounted) setReady(true); };
    const pending = readCampaignPendingConversion(campaign);
    if (
      startedRef.current ||
      !shouldTrackCampaignConversion(campaign, pathname, pending, {
        capiWebhookUrl: funnelConfig.integrations.capiWebhookUrl,
        metaPixelId: funnelConfig.integrations.metaPixelId,
      })
    ) {
      markReady();
      return () => { mounted = false; };
    }

    startedRef.current = true;
    const conversion = pending!;
    const trackingPromise = analytics.trackEvent(COMPLETE_REGISTRATION_EVENT_NAME, {
      event_id: conversion.event_id,
      lead: { nombre: conversion.lead_name, email: conversion.lead_email },
      capture_ok_at: conversion.capture_ok_at,
      confirmation_path: conversion.confirmation_path,
      source_path: conversion.source_path,
      traffic_channel: conversion.traffic_channel,
    });

    void trackingPromise.then((result) => {
      if (result.metaBrowserSent || result.capiSent) {
        markCampaignConversionSent(campaign, conversion, new Date().toISOString(), result);
      } else {
        markCampaignConversionFailed(campaign, conversion);
      }
    }).catch(() => markCampaignConversionFailed(campaign, conversion));

    void Promise.race([
      trackingPromise.catch(() => undefined),
      new Promise((resolve) => { window.setTimeout(resolve, TRACKING_REDIRECT_TIMEOUT_MS); }),
    ]).then(markReady);

    return () => { mounted = false; };
  }, [campaign, pathname]);

  return ready;
}
