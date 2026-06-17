import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import funnelConfig from '../../../core/config/funnel.config';
import { resolveCurrentAttribution } from '../../../core/attribution';
import analytics from '../../../core/services/analytics';
import { useVisitor } from '../../../core/visitor/VisitorContext';
import { buildVisitorPayload } from '../../../core/visitor/visitorPayload';
import {
  buildCreativeToysRegistrationPayload,
  buildCreativeToysRegistrationSnapshot,
  CREATIVE_TOYS_LEAD_EVENT_NAME,
  CREATIVE_TOYS_REGISTRATION_KEY,
  getCreativeToysCaptureEndpoint,
  getCreativeToysNavigationTargetAfterCapture,
  isCreativeToysCaptureOk,
  shouldTrackCreativeToysLead,
  validateCreativeToysForm,
  type CreativeToysFormErrors,
} from '../../registration/creativeToysRegistration';
import {
  acquireRegistrationSubmitLock,
  releaseRegistrationSubmitLock,
} from '../../registration/registrationSubmitLock';
import { CreativeToysButton } from './CreativeToysButton';

interface CreativeToysFormProps {
  id: string;
}

export function CreativeToysForm({ id }: CreativeToysFormProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const attribution = useMemo(() => resolveCurrentAttribution(location), [location]);
  const { visitorData } = useVisitor();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<CreativeToysFormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (
    setter: (value: string) => void,
    field: keyof CreativeToysFormErrors,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setter(event.target.value);
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    setSubmitError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateCreativeToysForm({ name, email });
    setErrors(nextErrors);
    setSubmitError('');

    if (Object.keys(nextErrors).length > 0 || isSubmitting) {
      return;
    }

    const submittedAt = new Date().toISOString();
    const normalizedEmail = email.trim().toLowerCase();
    const lockKey = `${location.pathname}:${normalizedEmail}`;

    if (!acquireRegistrationSubmitLock(lockKey)) {
      return;
    }

    setIsSubmitting(true);

    const visitorPayload = buildVisitorPayload(visitorData);
    const payload = buildCreativeToysRegistrationPayload({
      name,
      email,
      attribution,
      visitorPayload,
      pageUrl: window.location.href,
      currentPath: location.pathname,
      userAgent: window.navigator.userAgent,
      submittedAt,
    });

    try {
      const response = await fetch(getCreativeToysCaptureEndpoint(), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let responseBody: { ok?: unknown } | null = null;

      try {
        responseBody = (await response.clone().json()) as { ok?: unknown };
      } catch {
        responseBody = null;
      }

      const captureOk = isCreativeToysCaptureOk(response.ok, responseBody);
      const navigationTarget = getCreativeToysNavigationTargetAfterCapture(
        captureOk,
        location.pathname,
      );

      if (!navigationTarget) {
        throw new Error(`Capture responded with ${response.status}`);
      }

      const snapshot = buildCreativeToysRegistrationSnapshot(
        payload.name,
        payload.email,
        submittedAt,
        location.pathname,
      );
      window.localStorage.setItem(CREATIVE_TOYS_REGISTRATION_KEY, JSON.stringify(snapshot));

      if (
        shouldTrackCreativeToysLead(attribution, true, {
          capiWebhookUrl: funnelConfig.integrations.capiWebhookUrl,
          metaPixelId: funnelConfig.integrations.metaPixelId,
          tiktokPixelId: funnelConfig.integrations.tiktokPixelId,
        })
      ) {
        try {
          await analytics.trackEvent(CREATIVE_TOYS_LEAD_EVENT_NAME, {
            lead: {
              nombre: payload.first_name,
              email: payload.email,
            },
            list: payload.list,
            capture_list_slug: payload.capture_list_slug,
            confirmation_path: payload.confirmation_path,
            event_name: payload.event_name,
            source: payload.source,
            page_url: payload.page_url,
            submitted_at: payload.submitted_at,
            attribution,
            visitor: payload.visitor,
          });
        } catch (trackingError) {
          console.warn('[CreativeToysForm] lead tracking failed', trackingError);
        }
      }

      navigate(navigationTarget);
    } catch (error) {
      console.error('[CreativeToysForm] capture submission failed', error);
      setSubmitError('No pudimos completar tu registro. Intenta nuevamente en unos minutos.');
    } finally {
      releaseRegistrationSubmitLock(lockKey);
      setIsSubmitting(false);
    }
  };

  return (
    <form
      id={id}
      aria-label="Registro gratis Semana del Emprendimiento con Juguetes Creativos"
      className="space-y-3"
      noValidate
      onSubmit={handleSubmit}
    >
      <div>
        <label className="sr-only" htmlFor={`${id}-name`}>
          Nombre
        </label>
        <input
          id={`${id}-name`}
          autoComplete="given-name"
          className={[
            'h-[52px] w-full rounded-md border bg-white px-4 text-base text-[#24104e] outline-none transition placeholder:text-[#7b6b92] focus:border-[#23d7df] focus:ring-2 focus:ring-[#23d7df]/30',
            errors.name ? 'border-[#d33261]' : 'border-[#d9c9ee]',
          ].join(' ')}
          onChange={(nextEvent) => handleFieldChange(setName, 'name', nextEvent)}
          placeholder="Tu nombre"
          type="text"
          value={name}
        />
        {errors.name ? <p className="mt-2 text-sm font-semibold text-[#ffd45d]">{errors.name}</p> : null}
      </div>

      <div>
        <label className="sr-only" htmlFor={`${id}-email`}>
          Correo
        </label>
        <input
          id={`${id}-email`}
          autoComplete="email"
          className={[
            'h-[52px] w-full rounded-md border bg-white px-4 text-base text-[#24104e] outline-none transition placeholder:text-[#7b6b92] focus:border-[#23d7df] focus:ring-2 focus:ring-[#23d7df]/30',
            errors.email ? 'border-[#d33261]' : 'border-[#d9c9ee]',
          ].join(' ')}
          onChange={(nextEvent) => handleFieldChange(setEmail, 'email', nextEvent)}
          placeholder="Tu correo"
          type="email"
          value={email}
        />
        {errors.email ? <p className="mt-2 text-sm font-semibold text-[#ffd45d]">{errors.email}</p> : null}
      </div>

      {submitError ? (
        <p className="rounded-md border border-[#ffd45d]/40 bg-[#ffd45d]/12 px-3 py-2 text-sm font-semibold text-white" role="alert">
          {submitError}
        </p>
      ) : null}

      <CreativeToysButton className="mt-1" isLoading={isSubmitting} type="submit">
        QUIERO REGISTRARME GRATIS
      </CreativeToysButton>

      <p className="text-center text-xs font-semibold text-white/78 sm:text-left">
        Registro gratuito · Cupos limitados · Acceso por WhatsApp
      </p>
    </form>
  );
}
