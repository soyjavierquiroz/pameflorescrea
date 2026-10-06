import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resolveCurrentAttribution } from '../../../core/attribution';
import { useVisitor } from '../../../core/visitor/VisitorContext';
import { buildVisitorPayload } from '../../../core/visitor/visitorPayload';
import { SmartPhoneInput } from '../../../components/common/forms/SmartPhoneInput';
import {
  buildCampaignRegistrationPayload,
  buildPendingConversion,
  buildRegistrationSnapshot,
  getCampaignConfirmationPath,
  storeCampaignPendingConversion,
  submitCampaignRegistration,
  validateCampaignForm,
  writeCampaignSnapshot,
  type CampaignFormErrors,
} from '../../registration/campaignRegistration';
import { creativeToysCampaign, type CampaignConfig } from '../../registration/campaigns';
import {
  acquireRegistrationSubmitLock,
  releaseRegistrationSubmitLock,
} from '../../registration/registrationSubmitLock';
import { CreativeToysButton } from './CreativeToysButton';

interface CreativeToysFormProps {
  id: string;
  campaign?: CampaignConfig;
}

export function CreativeToysForm({ id, campaign = creativeToysCampaign }: CreativeToysFormProps) {
  const labelClassName = campaign.form.labelMode === 'sr-only'
    ? 'sr-only'
    : 'mb-2 block text-sm font-black text-white';
  const location = useLocation();
  const navigate = useNavigate();
  const attribution = useMemo(() => resolveCurrentAttribution(location), [location]);
  const { visitorData } = useVisitor();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [errors, setErrors] = useState<CampaignFormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (
    setter: (value: string) => void,
    field: keyof CampaignFormErrors,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setter(event.target.value);
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    setSubmitError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateCampaignForm({ name, email, whatsapp }, campaign);
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
    const payload = buildCampaignRegistrationPayload(campaign, {
      name,
      email,
      whatsapp,
      attribution,
      visitorPayload,
      pageUrl: window.location.href,
      currentPath: location.pathname,
      userAgent: window.navigator.userAgent,
      submittedAt,
    });

    try {
      await submitCampaignRegistration(payload);
      const navigationTarget = getCampaignConfirmationPath(campaign, location.pathname);
      const snapshot = buildRegistrationSnapshot(
        payload.name,
        payload.email,
        submittedAt,
        location.pathname,
      );
      writeCampaignSnapshot(campaign, snapshot);

      const pendingConversion = buildPendingConversion(campaign, {
        captureOk: true,
        confirmationPath: payload.confirmation_path,
        currentPath: location.pathname,
        email: payload.email,
        name: payload.name,
        registeredAt: submittedAt,
      });

      if (pendingConversion) {
        storeCampaignPendingConversion(campaign, pendingConversion);
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
      data-reto-form={campaign.campaignId === 'reto' ? '' : undefined}
      aria-label={campaign.form.ariaLabel}
      className="space-y-3"
      noValidate
      onSubmit={handleSubmit}
    >
      <div>
        <label className={labelClassName} htmlFor={`${id}-name`}>
          {campaign.form.nameLabel}
        </label>
        <input
          id={`${id}-name`}
          aria-describedby={errors.name ? `${id}-name-error` : undefined}
          aria-invalid={Boolean(errors.name)}
          autoComplete="given-name"
          className={[
            'h-[52px] w-full rounded-md border bg-white px-4 text-base text-[#24104e] outline-none transition placeholder:text-[#7b6b92] focus:border-[#23d7df] focus:ring-2 focus:ring-[#23d7df]/30',
            errors.name ? 'border-[#d33261]' : 'border-[#d9c9ee]',
          ].join(' ')}
          onChange={(nextEvent) => handleFieldChange(setName, 'name', nextEvent)}
          placeholder={campaign.form.namePlaceholder}
          type="text"
          value={name}
        />
        {errors.name ? <p id={`${id}-name-error`} className="mt-2 text-sm font-semibold text-[#ffd45d]">{errors.name}</p> : null}
      </div>

      <div>
        <label className={labelClassName} htmlFor={`${id}-email`}>
          {campaign.form.emailLabel}
        </label>
        <input
          id={`${id}-email`}
          aria-describedby={errors.email ? `${id}-email-error` : undefined}
          aria-invalid={Boolean(errors.email)}
          autoComplete="email"
          className={[
            'h-[52px] w-full rounded-md border bg-white px-4 text-base text-[#24104e] outline-none transition placeholder:text-[#7b6b92] focus:border-[#23d7df] focus:ring-2 focus:ring-[#23d7df]/30',
            errors.email ? 'border-[#d33261]' : 'border-[#d9c9ee]',
          ].join(' ')}
          onChange={(nextEvent) => handleFieldChange(setEmail, 'email', nextEvent)}
          placeholder={campaign.form.emailPlaceholder}
          type="email"
          value={email}
        />
        {errors.email ? <p id={`${id}-email-error`} className="mt-2 text-sm font-semibold text-[#ffd45d]">{errors.email}</p> : null}
      </div>

      {campaign.whatsapp !== 'hidden' ? (
        <SmartPhoneInput
          id={`${id}-whatsapp`}
          name="whatsapp"
          label="WhatsApp"
          required={campaign.whatsapp === 'required'}
          defaultCountry="EC"
          value={whatsapp}
          onChange={(nextValue) => {
            setWhatsapp(nextValue);
            setErrors((currentErrors) => ({ ...currentErrors, whatsapp: undefined }));
            setSubmitError('');
          }}
          error={errors.whatsapp}
          disabled={isSubmitting}
          placeholder={campaign.form.whatsappPlaceholder ?? 'Tu número de WhatsApp'}
          labelClassName={labelClassName}
          errorTextClassName="mt-2 text-sm font-semibold text-[#ffd45d]"
          requiredMarkClassName="ml-1 text-white"
          phoneInputClassName="h-[52px] w-full rounded-md border border-[#d9c9ee] bg-white text-[#24104e] focus-within:border-[#23d7df] focus-within:ring-2 focus-within:ring-[#23d7df]/30 [&_.PhoneInputCountry]:border-r [&_.PhoneInputCountry]:border-[#d9c9ee] [&_.PhoneInputInput]:bg-white [&_.PhoneInputInput]:text-[#24104e]"
        />
      ) : null}

      {submitError ? (
        <p className="rounded-md border border-[#ffd45d]/40 bg-[#ffd45d]/12 px-3 py-2 text-sm font-semibold text-white" role="alert">
          {submitError}
        </p>
      ) : null}

      <CreativeToysButton className="mt-1" isLoading={isSubmitting} type="submit">
        {campaign.form.buttonText}
      </CreativeToysButton>

      {campaign.form.footerText ? (
        <p className="text-center text-xs font-semibold text-white/78 sm:text-left">
          {campaign.form.footerText}
        </p>
      ) : null}
    </form>
  );
}
