export type DnaTheme = 'expert' | 'panda';
export type DnaFunnelType = 'vsl' | 'event' | 'tripwire';
export type DnaSuccessActionType = 'whatsapp' | 'url' | 'checkout' | 'zoom' | 'email' | 'none';

const runtimeEnv = ((import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {});

function readEnv(name: string, fallback = '') {
  const value = runtimeEnv[name]?.trim();
  return value && value.length > 0 ? value : fallback;
}

export interface DnaConfig {
  theme: DnaTheme;
  funnelType: DnaFunnelType;
  landingSlug: string;
  productName: string;
  domain: string;
  siteId: string;
  fonts: {
    sans: string;
    body: string;
  };
  checkoutUrl: string;
  checkout: {
    providerName: string;
    productIds: {
      main: string;
      bump: string;
      continuity: string;
      vip: string;
    };
    successPath: string;
  };
  offer: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    productName: string;
    price: string;
    regularPrice: string;
    currency: string;
    checkoutUrl: string;
    ctaLabel: string;
    ctaPendingLabel: string;
    regularPriceLabel: string;
    checkoutPendingMessage: string;
    heroImage: string;
    heroImageAlt: string;
    bullets: string[];
    announcement: {
      text: string;
    };
    video: {
      eyebrow: string;
      title: string;
      subtitle: string;
      provider: 'youtube' | 'bunnynet' | 'vimeo' | 'wistia' | 'html5';
      videoId: string;
      url: string;
      posterImage: string;
      progressBarColor: string;
      soundPrompt: string;
      placeholderText: string;
    };
    offerCard: {
      eyebrow: string;
      title: string;
      summary: string;
      includes: string[];
      footerNote: string;
    };
    offerBoxes: Array<{
      eyebrow: string;
      title: string;
      summary: string;
      includes: string[];
      footerNote: string;
      badge: string;
    }>;
    credibility: {
      text: string;
      items: Array<{
        value: string;
        label: string;
      }>;
    };
    beliefShift: {
      eyebrow: string;
      title: string;
      paragraphs: string[];
      highlights: string[];
    };
    opportunity: {
      eyebrow: string;
      title: string;
      intro: string;
      paragraphs: string[];
      bullets: string[];
      callout: string;
    };
    identityShift: {
      eyebrow: string;
      title: string;
      subtitle: string;
      oldIdentityTitle: string;
      newIdentityTitle: string;
      oldItems: string[];
      newItems: string[];
      closing: string;
    };
    story: {
      eyebrow: string;
      title: string;
      paragraphs: string[];
      highlight: string;
      image: string;
      imageAlt: string;
    };
    proofGrid: {
      eyebrow: string;
      title: string;
      subtitle: string;
      items: Array<{
        eyebrow: string;
        title: string;
        name: string;
        detail: string;
        quote: string;
        image: string;
        imageAlt: string;
      }>;
    };
    proofWallLarge: {
      eyebrow: string;
      title: string;
      subtitle: string;
      featured: {
        eyebrow: string;
        title: string;
        quote: string;
        name: string;
        detail: string;
        image: string;
        imageAlt: string;
      };
      items: Array<{
        eyebrow: string;
        title: string;
        quote: string;
        name: string;
        detail: string;
        image: string;
        imageAlt: string;
      }>;
    };
    repeatedCtas: Array<{
      eyebrow: string;
      title: string;
      subtitle: string;
      priceLine: string;
    }>;
    repeatedOffers: Array<{
      eyebrow: string;
      title: string;
      subtitle: string;
      priceLine: string;
      offerBoxIndex: number;
    }>;
    valueStack: {
      eyebrow: string;
      title: string;
      subtitle: string;
      totalValueLabel: string;
      totalValue: string;
      todayPriceLabel: string;
      includedLabel: string;
      stackSections: Array<{
        eyebrow: string;
        title: string;
        description: string;
        items: string[];
      }>;
      items: Array<{
        title: string;
        description: string;
        value: string;
      }>;
    };
    bonuses: {
      eyebrow: string;
      title: string;
      subtitle: string;
      valueLabel: string;
      items: Array<{
        title: string;
        description: string;
        value?: string;
      }>;
    };
    guarantee: {
      eyebrow: string;
      title: string;
      description: string;
      bullets: string[];
    };
    scarcity: {
      eyebrow: string;
      title: string;
      description: string;
    };
    fascinations: {
      eyebrow: string;
      title: string;
      subtitle: string;
      items: string[];
      closing: string;
    };
    faq: {
      eyebrow: string;
      title: string;
      items: Array<{
        question: string;
        answer: string;
      }>;
    };
    finalCta: {
      eyebrow: string;
      title: string;
      subtitle: string;
      priceLine: string;
    };
  };
  vslVideoId: string;
  videos: {
    vsl: {
      provider: 'youtube' | 'bunnynet' | 'vimeo' | 'wistia' | 'html5';
      videoId: string;
      revealAtSeconds: number;
      progressBarColor: string;
      posterImage: string;
      ctaDisplayAtSeconds: number;
    };
  };
  tracking: {
    siteId: string;
    metaPixelId: string;
    tiktokPixelId: string;
    capiWebhookUrl: string;
    visitorApiUrl: string;
    metaPixelScriptUrl: string;
    tiktokPixelScriptBaseUrl: string;
  };
  seo: {
    title: string;
    description: string;
    socialImage: string;
  };
  colors: {
    primary: string;
    accent: string;
    highlight: string;
    success: string;
    warning: string;
    error: string;
  };
  surface: {
    page: string;
    panel: string;
    muted: string;
    bump: string;
  };
  text: {
    main: string;
    muted: string;
    subtle: string;
    inverse: string;
    onPrimary: string;
    onAccent: string;
  };
  cta: {
    bg: string;
    text: string;
    hoverBg: string;
  };
  prices: {
    main: string;
    bump: string;
    totalValue: string;
    regular: string;
    regularPrice: string;
    vip: string;
  };
  assets: {
    productImage: string;
    salesLetterImage: string;
    bonusImage: string;
    bundleWideImage: string;
    socialImage: string;
    event: {
      logo: string;
      hero: string;
      agenda1: string;
      agenda2: string;
      agenda3: string;
      pain: string;
      authority: string;
      authorityCarousel: readonly string[];
      finalCta: string;
      heroImage: string;
      agendaImages: string[];
      painImage: string;
      authorityImage: string;
      finalCtaImage: string;
      insecureDriverImage: string;
      confidentDriverImage: string;
      parkedCarImage: string;
      motherWithChildrenImage: string;
      expertTeachingImage: string;
    };
  };
  forms: {
    captureWebhookUrl: string;
    captureListSlug: string;
    successRedirectType: 'url' | 'whatsapp';
    successRedirectUrl: string;
    whatsappGroupUrl: string;
    whatsappRedirectBaseUrl: string;
    captureFields: {
      firstName: boolean;
      lastName: boolean;
      email: boolean;
      whatsapp: boolean;
    };
    captureTracking: {
      eventName: string;
      formId: string;
      status: string;
      source: string;
      payloadEventName: string;
    };
  };
  success: {
    action: {
      type: DnaSuccessActionType;
      url: string;
    };
    redirectSeconds: number;
  };
  copy: {
    productName: string;
    headline: string;
    headlineHighlight: string;
    subheadline: string;
    ctaText: string;
    checkoutCtaText: string;
    orderBumpTitle: string;
    salesLetter: {
      title: string;
      part1: string[];
      highlight: string;
      part2: string[];
      image: string;
      ctaText: string;
    };
    offerStackTitle: string;
    benefits: string[];
    specialOfferTitle: string;
    specialOfferSubtitle: string;
    specialOfferGuarantee: string;
    specialOfferImage: string;
    presentationPreTitle: string;
    presentationTitle: string;
    confidenceBooster: {
      headline: string;
      paragraphs: string[];
      bullets: string[];
      includedLabel: string;
    };
    sewingBonus: {
      eyebrow: string;
      title: string;
      image: string;
      description: string;
    };
    painPoints: {
      headline: string;
      subtitle: string;
      bullets: string[];
      transitionText: string;
    };
    modules: Array<{
      title: string;
      value: string;
      description: string;
      image: string;
    }>;
    fastActionBonus: {
      timeLimit: string;
      title: string;
      subtitle: string;
    };
    offerSummary: {
      title: string;
      countdownLabel: string;
      opportunityExpiresLabel: string;
      bundleImageAlt: string;
      totalValueLabel: string;
      todayPriceLabel: string;
      regularPriceLabel: string;
      includedBadgeLabel: string;
      realValueLabel: string;
      ctaLabel: string;
      ctaSubLabel: string;
      offerAvailableLabel: string;
      specialPriceLabel: string;
      todayOnlyLabel: string;
      originalPriceLabel: string;
      valuedAtLabel: string;
    };
    certaintyItems: Array<{
      id: string;
      label: string;
    }>;
    orderForm: {
      eyebrow: string;
      description: string;
    };
    successPage: {
      eyebrow: string;
      title: string;
      description: string;
      backLabel: string;
      whatsappLabel: string;
      countdownLead: string;
      missingWhatsappUrlMessage: string;
      progressAriaLabel: string;
    };
    captureForm: {
      eyebrow: string;
      headlineFallback: string;
      headlineWithLocation: string;
      description: string;
      firstNameLabel: string;
      firstNamePlaceholder: string;
      lastNameLabel: string;
      lastNamePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      whatsappLabel: string;
      whatsappPlaceholder: string;
      requiredError: string;
      emailRequiredError: string;
      invalidEmailError: string;
      whatsappRequiredError: string;
      invalidWhatsappError: string;
      submitError: string;
      submitLabel: string;
      submittingLabel: string;
    };
    event: {
      registrationAnchorId: string;
      startsAtIso: string;
      footer: {
        logoAlt: string;
      };
      hero: {
        eyebrow: string;
        eventName: string;
        dateLabel: string;
        headline: string;
        subheadline: string;
        quickBenefits: string[];
        imageAlt: string;
        formTitle: string;
        primaryCtaLabel: string;
        secondaryCtaLabel: string;
        submittingLabel: string;
      };
      socialProof: string;
      countdown: {
        label: string;
        expiredLabel: string;
        units: {
          days: string;
          hours: string;
          minutes: string;
          seconds: string;
        };
      };
      foundation: {
        sectionEyebrow: string;
        sectionTitle: string;
        sectionText: string;
        cardTitle: string;
        cardText: string;
      };
      promise: {
        title: string;
        image: string;
        imageAlt: string;
        bullets: string[];
        ctaLabel: string;
      };
      transformation: {
        eyebrow: string;
        title: string;
        beforeTitle: string;
        afterTitle: string;
        beforeItems: string[];
        afterItems: string[];
      };
      agenda: {
        title: string;
        items: Array<{
          label: string;
          title: string;
          description: string;
          image: string;
          imageAlt: string;
        }>;
        ctaLabel: string;
      };
      whyFearPersists: {
        eyebrow: string;
        title: string;
        paragraphs: string[];
        highlights: string[];
      };
      pain: {
        title: string;
        imageAlt: string;
        intro: string;
        bullets: string[];
        phrases: string[];
        ctaLabel: string;
      };
      testimonials: {
        eyebrow: string;
        title: string;
        subtitle: string;
        items: Array<{
          name: string;
          location?: string;
          role?: string;
          quote: string;
          image?: string;
          result?: string;
        }>;
      };
      authority: {
        title: string;
        imageAlt: string;
        intro: string;
        bio: string;
        paragraphs: string[];
        badges: string[];
        quote: string;
        ctaLabel: string;
      };
      finalCta: {
        eyebrow: string;
        headline: string;
        imageAlt: string;
        subheadline: string;
        bullets: string[];
        text: string;
        ctaLabel: string;
      };
    };
    pricingCard: {
      eyebrow: string;
      title: string;
      baseValueLabel: string;
      basePriceLabel: string;
      subtotalLabel: string;
      localTaxesLabel: string;
      includedTaxesLabel: string;
      checkoutTotalLabel: string;
      equivalentLabel: string;
      internationalPriceLabel: string;
      buyButtonLabel: string;
      unavailableLabel: string;
      securePaymentLabel: string;
      processedByLabel: string;
      immediateAccessLabel: string;
    };
    video: {
      smartPosterEyebrow: string;
      smartPosterTitle: string;
      smartPosterDescription: string;
      smartPosterButtonText: string;
      ctaEyebrow: string;
      ctaHeadline: string;
      ctaButtonText: string;
      soundPrompt: string;
      placeholderText: string;
    };
    testimonials: {
      headline: string;
      subtitle: string;
      items: Array<{
        name: string;
        quote: string;
        image: string;
      }>;
    };
    faq: {
      title: string;
      items: Array<{
        question: string;
        answer: string;
      }>;
    };
  };
}

function parsePrice(value: string) {
  const normalizedValue = value.replace(/,/g, '').trim();
  const parsedValue = Number(normalizedValue);

  if (!Number.isFinite(parsedValue)) {
    throw new Error(`[DNA] Invalid price value: "${value}"`);
  }

  return parsedValue;
}

function hexToRgbTriplet(hex: string) {
  const normalizedHex = hex.replace('#', '').trim();

  if (!/^[\da-f]{6}$/i.test(normalizedHex)) {
    throw new Error(`[DNA] Invalid hex color value: "${hex}"`);
  }

  const red = Number.parseInt(normalizedHex.slice(0, 2), 16);
  const green = Number.parseInt(normalizedHex.slice(2, 4), 16);
  const blue = Number.parseInt(normalizedHex.slice(4, 6), 16);

  return `${red} ${green} ${blue}`;
}

function normalizeColorValue(value: string) {
  const normalizedValue = value.trim();

  if (normalizedValue.startsWith('#')) {
    return hexToRgbTriplet(normalizedValue);
  }

  if (/^\d{1,3}\s+\d{1,3}\s+\d{1,3}(?:\s*\/\s*(?:\d{1,3}%|0?\.\d+|1(?:\.0+)?))?$/.test(normalizedValue)) {
    return normalizedValue.replace(/\s+/g, ' ');
  }

  throw new Error(`[DNA] Invalid color value: "${value}"`);
}

function toRgbTriplet(value: string) {
  const normalizedValue = normalizeColorValue(value);
  const [triplet] = normalizedValue.split('/');
  return triplet.trim();
}

const productName = 'Pame Flores Crea';
const eventName = 'Pame Flores Crea';
const eventCaptureSource = 'pame-flores-crea';
const domain = readEnv('VITE_DOMAIN', 'https://pameflorescrea.com');
const siteId = readEnv('VITE_SITE_ID', 'PAME_FLORES_CREA');
const checkoutUrl = readEnv('VITE_CHECKOUT_URL', 'https://pameflorescrea.com');
const offerCheckoutUrl = readEnv('VITE_OFFER_CHECKOUT_URL', checkoutUrl);
const vslVideoId = readEnv('VITE_VSL_VIDEO_ID', 'REPLACE_WITH_VSL_VIDEO_ID');
const offerVideoUrl = readEnv('VITE_OFFER_VIDEO_URL', 'https://example.com/replace-with-offer-video.m3u8');
const successActionType = readEnv('VITE_SUCCESS_ACTION_TYPE', 'url') as DnaSuccessActionType;
const placeholderAsset = '/assets/funnel-placeholder.svg';

const eventAssets = {
  logo: placeholderAsset,
  hero: placeholderAsset,
  agenda1: placeholderAsset,
  agenda2: placeholderAsset,
  agenda3: placeholderAsset,
  pain: placeholderAsset,
  authority: placeholderAsset,
  finalCta: placeholderAsset,
  authorityCarousel: [placeholderAsset, placeholderAsset, placeholderAsset],
} as const;

export const DNA = {
  theme: 'expert',
  funnelType: 'event',
  landingSlug: readEnv('VITE_LANDING_SLUG', 'pame-flores-crea'),
  productName,
  domain,
  siteId,
  fonts: {
    sans: 'Montserrat',
    body: 'Open Sans',
  },
  checkoutUrl,
  checkout: {
    providerName: readEnv('VITE_CHECKOUT_PROVIDER_NAME', 'Checkout'),
    productIds: {
      main: 'EXAMPLE_MAIN',
      bump: 'EXAMPLE_BUMP',
      continuity: 'EXAMPLE_CONTINUITY',
      vip: 'EXAMPLE_VIP',
    },
    successPath: '/confirmacion',
  },
  offer: {
    eyebrow: 'Example offer',
    headline: 'Discover a simple path to turn interest into action',
    subheadline:
      'Use this demo copy as a neutral starting point for a funnel, event, checkout flow, or presentation page.',
    productName: eventName,
    price: '$27',
    regularPrice: '$97',
    currency: 'USD',
    checkoutUrl: offerCheckoutUrl,
    ctaLabel: 'QUIERO EMPEZAR AHORA',
    ctaPendingLabel: 'CONFIGURACION PENDIENTE',
    regularPriceLabel: 'Precio regular',
    checkoutPendingMessage: 'Checkout pendiente de configurar.',
    heroImage: eventAssets.hero,
    heroImageAlt: 'Neutral placeholder image for the example funnel',
    bullets: [
      'Clear positioning for the example audience',
      'A configurable offer stack for quick cloning',
      'Safe placeholder assets and checkout defaults',
    ],
    announcement: {
      text: 'Demo offer with safe defaults for new clones',
    },
    video: {
      eyebrow: 'Watch the presentation',
      title: 'See how the example offer is positioned before checkout',
      subtitle: 'Replace this video, poster, and copy with the real story for the new site.',
      provider: 'bunnynet',
      videoId: offerVideoUrl,
      url: offerVideoUrl,
      posterImage: eventAssets.hero,
      progressBarColor: '#e88c8c',
      soundPrompt: 'Activa el sonido para ver la presentacion',
      placeholderText: 'Video de la oferta pendiente de configurar',
    },
    offerCard: {
      eyebrow: 'Full access today',
      title: 'Example Funnel',
      summary:
        'A neutral example package that demonstrates how the funnel renders before a clone replaces the site content.',
      includes: [
        'Main product placeholder',
        'Configurable support resource',
        'Downloadable bonus placeholders',
        'Pago seguro desde el checkout configurado',
      ],
      footerNote: 'Sin formulario en esta pagina. El boton te lleva directo al checkout cuando este configurado.',
    },
    offerBoxes: [
      {
        eyebrow: 'Main package',
        title: 'Example Funnel',
        summary: 'The primary offer placeholder for a new funnel. Replace this with the real promise and deliverables.',
        includes: [
          'Core product placeholder',
          'Implementation guide placeholder',
          'Bonus resources placeholder',
          'Acceso inmediato al completar checkout',
        ],
        footerNote: 'Sin formulario en esta pagina. El boton te lleva directo al checkout cuando este configurado.',
        badge: 'Oferta principal',
      },
      {
        eyebrow: 'Quick summary',
        title: 'Everything in one example stack',
        summary: 'A compact summary block for the product, bonuses, checkout state, and next step.',
        includes: ['Step by step framework', 'Recursos descargables', 'Example implementation plan', 'Mapa de seguimiento semanal'],
        footerNote: 'El precio y el checkout se controlan desde configuracion.',
        badge: 'Incluye bonos',
      },
      {
        eyebrow: 'Final decision',
        title: 'Start with a clear next step',
        summary: 'Use this final reminder to make the checkout action clear once the clone has real content.',
        includes: ['Access to the complete offer', 'Configurable bonus stack', 'Herramientas de seguimiento', 'Pago seguro al checkout configurado'],
        footerNote: 'Si falta la URL de checkout, el boton aparecera deshabilitado.',
        badge: 'Ultimo recordatorio',
      },
    ],
    credibility: {
      text: 'A neutral credibility strip for configurable proof points.',
      items: [
        { value: 'Demo', label: 'ready to customize' },
        { value: 'Safe', label: 'placeholder defaults' },
        { value: 'Access', label: 'after checkout setup' },
      ],
    },
    beliefShift: {
      eyebrow: 'Core belief',
      title: 'The default site should be useful without carrying a client identity.',
      paragraphs: [
        'This parent repository opens with an example funnel that renders cleanly and avoids site-specific assumptions.',
        'A clone can replace the domain, copy, assets, checkout, tracking, and capture settings without editing shared components.',
      ],
      highlights: ['Neutral defaults reduce accidental deploy risk.', 'The active site boundary remains easy to customize.'],
    },
    opportunity: {
      eyebrow: 'The opportunity',
      title: 'Turn this example into a real funnel by replacing the site boundary.',
      intro: 'This section demonstrates long-form offer content without depending on any historical project.',
      paragraphs: [
        'Use the same schema to describe a webinar, tripwire, VSL, challenge, course, service, or lead generation flow.',
        'Keep core components shared and move client-specific decisions into environment variables, site config, and assets.',
      ],
      bullets: [
        'Replace the placeholder asset with brand-safe media.',
        'Set checkout and capture endpoints from env.',
        'Update pricing and product IDs before launch.',
        'Run the clone checklist before publishing.',
      ],
      callout: 'The parent is a clean starting point, not a production identity.',
    },
    identityShift: {
      eyebrow: 'Positioning shift',
      title: 'Move from generic demo to a focused offer once the clone is created.',
      subtitle: 'This block exists to prove the page can render a before-and-after narrative.',
      oldIdentityTitle: 'Before customization',
      newIdentityTitle: 'After customization',
      oldItems: [
        'The page uses placeholder copy.',
        'Assets are intentionally generic.',
        'Checkout URLs point to example domains.',
        'Tracking IDs are blank unless env is set.',
      ],
      newItems: [
        'The clone has a real audience and promise.',
        'Media matches the offer.',
        'Checkout and capture are configured.',
        'Launch checks confirm the parent stayed generic.',
      ],
      closing: 'Site-specific surfaces are replaced in the clone while shared engine code remains portable.',
    },
    story: {
      eyebrow: 'Example story',
      title: 'A clean parent starts with useful structure and no client baggage.',
      paragraphs: [
        'The parent repository should make a new clone feel intentional on first open.',
        'This placeholder story keeps the layout complete while making it obvious what should be replaced.',
        'Real clones should bring their own narrative, proof, audience language, and operational settings.',
      ],
      highlight: 'The example is functional by default and disposable by design.',
      image: eventAssets.agenda3,
      imageAlt: 'Neutral placeholder for the example story',
    },
    proofGrid: {
      eyebrow: 'Configurable proof',
      title: 'Replace these cards with testimonials, metrics, clips, or screenshots.',
      subtitle: 'The default content is intentionally generic so clones do not inherit a live site identity.',
      items: [
        {
          eyebrow: 'Short video',
          title: 'Example customer result',
          name: 'Customer A',
          detail: 'Example market',
          quote: 'This placeholder shows where a concise result-oriented quote can appear.',
          image: eventAssets.agenda1,
          imageAlt: 'Placeholder proof card image',
        },
        {
          eyebrow: 'Screenshot',
          title: 'Example implementation win',
          name: 'Customer B',
          detail: 'Example segment',
          quote: 'Replace this with a real message, screenshot summary, or customer quote.',
          image: eventAssets.agenda2,
          imageAlt: 'Placeholder screenshot proof',
        },
        {
          eyebrow: 'Customer story',
          title: 'Example transformation story',
          name: 'Customer C',
          detail: 'Example region',
          quote: 'A longer story can sit here once the clone has real proof.',
          image: eventAssets.agenda3,
          imageAlt: 'Placeholder story proof',
        },
        {
          eyebrow: 'Practical result',
          title: 'Example practical outcome',
          name: 'Customer D',
          detail: 'Example use case',
          quote: 'Use a specific result here when the funnel has validated proof.',
          image: eventAssets.authority,
          imageAlt: 'Placeholder outcome proof',
        },
        {
          eyebrow: 'Message',
          title: 'Example message',
          name: 'Customer E',
          detail: 'Example audience',
          quote: 'A short customer message can make the offer feel concrete.',
          image: eventAssets.pain,
          imageAlt: 'Placeholder customer message',
        },
        {
          eyebrow: 'Perspective shift',
          title: 'Example perspective shift',
          name: 'Customer F',
          detail: 'Example channel',
          quote: 'Replace this card with proof that matches the offer promise.',
          image: eventAssets.finalCta,
          imageAlt: 'Placeholder perspective proof',
        },
      ],
    },
    proofWallLarge: {
      eyebrow: 'Cases and proof',
      title: 'Proof can be simple, but it should be real before launch.',
      subtitle: 'Use this wall for featured stories, short messages, practical outcomes, or measurable wins.',
      featured: {
        eyebrow: 'Featured case',
        title: 'Featured example result',
        quote: 'This featured quote is a placeholder. Replace it with the strongest proof available for the clone.',
        name: 'Featured customer',
        detail: 'Configurable placeholder case',
        image: eventAssets.agenda3,
        imageAlt: 'Featured placeholder proof image',
      },
      items: [
        {
          eyebrow: 'Message',
          title: 'Example message title',
          quote: 'Short customer proof can live here once the site has real inputs.',
          name: 'Customer G',
          detail: 'Example proof',
          image: eventAssets.agenda1,
          imageAlt: 'Placeholder message proof image',
        },
        {
          eyebrow: 'Result',
          title: 'Example measurable result',
          quote: 'Add numbers, timeframes, or before-and-after context here.',
          name: 'Customer H',
          detail: 'Example metric',
          image: eventAssets.agenda2,
          imageAlt: 'Placeholder metric proof image',
        },
        {
          eyebrow: 'Change',
          title: 'Example behavior shift',
          quote: 'This can become a concrete story from the target audience.',
          name: 'Customer I',
          detail: 'Example story',
          image: eventAssets.finalCta,
          imageAlt: 'Placeholder behavior proof image',
        },
        {
          eyebrow: 'Process',
          title: 'Example process win',
          quote: 'Describe how the product changed a workflow, decision, or habit.',
          name: 'Customer J',
          detail: 'Example process',
          image: eventAssets.pain,
          imageAlt: 'Placeholder process proof image',
        },
      ],
    },
    repeatedCtas: [
      {
        eyebrow: 'Immediate access',
        title: 'Start with the complete example package today.',
        subtitle: 'Replace this with a concise reminder of what the buyer receives after checkout.',
        priceLine: 'Hoy {price}. Precio regular {regularPrice}.',
      },
      {
        eyebrow: 'Offer summary',
        title: 'The offer stack is ready to customize.',
        subtitle: 'Haz clic cuando estes listo para ir al checkout. Si la URL no esta configurada, veras el boton deshabilitado.',
        priceLine: 'Acceso especial {price}.',
      },
    ],
    repeatedOffers: [
      {
        eyebrow: 'Complete offer',
        title: 'Access the full example system once checkout is configured.',
        subtitle: 'Use this repeated offer block to restate the promise in a real clone.',
        priceLine: 'Hoy {price}. Precio regular {regularPrice}.',
        offerBoxIndex: 0,
      },
      {
        eyebrow: 'Important reminder',
        title: 'The example package shows the structure; the clone supplies the promise.',
        subtitle: 'Keep this copy specific to the new audience before publishing.',
        priceLine: 'Acceso especial {price}.',
        offerBoxIndex: 1,
      },
      {
        eyebrow: 'After the stack',
        title: 'Every section should support one clear conversion action.',
        subtitle: 'Replace placeholder language with real outcomes, proof, and offer mechanics.',
        priceLine: 'Valor total {regularPrice}. Hoy {price}.',
        offerBoxIndex: 1,
      },
      {
        eyebrow: 'Before continuing',
        title: 'Before launch, make this CTA match the real checkout path.',
        subtitle: 'El siguiente paso es sencillo: ir al checkout configurado y empezar con el material completo.',
        priceLine: 'Acceso hoy {price}.',
        offerBoxIndex: 2,
      },
    ],
    valueStack: {
      eyebrow: 'Lo que recibes',
      title: 'The complete example stack',
      subtitle: 'Each item is a placeholder for a real module, resource, bonus, or service component.',
      totalValueLabel: 'Valor total',
      totalValue: '$221',
      todayPriceLabel: 'Precio de hoy',
      includedLabel: 'Incluido',
      stackSections: [
        {
          eyebrow: 'Phase 1',
          title: 'Clarify the promise',
          description: 'Define the audience, the specific outcome, and the reason this offer exists.',
          items: ['Audience and outcome notes', 'Offer mechanism placeholder', 'Primary conversion action'],
        },
        {
          eyebrow: 'Phase 2',
          title: 'Prepare the offer',
          description: 'List the core deliverables and the practical steps a buyer or registrant receives.',
          items: ['Core module placeholder', 'Implementation resource placeholder', 'Support or follow-up placeholder'],
        },
        {
          eyebrow: 'Phase 3',
          title: 'Support the next step',
          description: 'Add resources that make the conversion feel complete and easy to act on.',
          items: ['Registro semanal', 'Bonus resource', 'Quick-start checklist'],
        },
      ],
      items: [
        { title: 'Main example product', description: 'The core placeholder product that should become the real offer.', value: '$97' },
        { title: 'Implementation resource', description: 'A configurable guide, checklist, workbook, or template.', value: '$47' },
        { title: 'Action plan', description: 'A simple plan that helps the customer take the next step.', value: '$37' },
        { title: 'Weekly follow-up map', description: 'A placeholder tracking or accountability resource.', value: '$40' },
      ],
    },
    bonuses: {
      eyebrow: 'Bonos incluidos',
      title: 'Bonuses are optional and configurable',
      subtitle: 'Replace these placeholders with real clone resources or remove them if the schema later allows it.',
      valueLabel: 'Valor',
      items: [
        { title: 'Bonus 1: Quick-start checklist', description: 'A simple resource that helps the customer begin after purchase.', value: '$27' },
        { title: 'Bonus 2: Implementation prompts', description: 'Prompts or exercises that help translate the offer into action.', value: '$27' },
        { title: 'Bonus 3: Weekly follow-up', description: 'A placeholder worksheet for follow-up and accountability.', value: '$17' },
      ],
    },
    guarantee: {
      eyebrow: 'Garantia configurable',
      title: 'Add the real guarantee before publishing',
      description: 'This placeholder keeps the section functional while avoiding any production promise.',
      bullets: ['Configura plazo y condiciones', 'Aclara soporte o reembolso', 'Alinea el texto con el checkout'],
    },
    scarcity: {
      eyebrow: 'Disponibilidad',
      title: 'Configure real urgency for the offer',
      description: 'Example: special price until a date, limited spots, or a fast-action bonus.',
    },
    fascinations: {
      eyebrow: 'Lo que descubriras',
      title: 'Curiosity bullets for the example offer',
      subtitle: 'Use this list to create interest without making claims the clone cannot support.',
      items: [
        'Why the offer exists now.',
        'What the audience gets after taking action.',
        'How the method or framework is different.',
        'What makes the first step simple.',
        'Which proof points support the promise.',
        'What should happen after checkout or registration.',
      ],
      closing: 'Reemplaza esta lista por curiosidades especificas del nuevo funnel.',
    },
    faq: {
      eyebrow: 'Preguntas frecuentes',
      title: 'Questions to answer before checkout',
      items: [
        {
          question: 'What should a clone replace first?',
          answer: 'Start with env values, site config, assets, checkout URLs, capture settings, and launch copy.',
        },
        {
          question: 'Is checkout active by default?',
          answer: 'No. The default checkout URL is a safe placeholder and should be replaced before publishing.',
        },
        {
          question: 'Can this example be used as production copy?',
          answer: 'It is functional for rendering only. Production sites should use their own audience, proof, and offer language.',
        },
      ],
    },
    finalCta: {
      eyebrow: 'Ready to configure',
      title: 'Turn the example into a real offer before launch',
      subtitle: 'Replace placeholders, verify env, run checks, and connect the checkout when the clone is ready.',
      priceLine: 'Example price {price}.',
    },
  },
  vslVideoId,
  videos: {
    vsl: {
      provider: 'youtube',
      videoId: vslVideoId,
      revealAtSeconds: 0,
      progressBarColor: '#e88c8c',
      posterImage: placeholderAsset,
      ctaDisplayAtSeconds: 0,
    },
  },
  tracking: {
    siteId,
    metaPixelId: readEnv('VITE_META_PIXEL_ID'),
    tiktokPixelId: readEnv('VITE_TIKTOK_PIXEL_ID'),
    capiWebhookUrl: readEnv('VITE_CAPI_RELAY_URL'),
    visitorApiUrl: readEnv('VITE_VISITOR_API_URL', 'https://ipapi.co/json/'),
    metaPixelScriptUrl: readEnv('VITE_META_PIXEL_SCRIPT_URL', 'https://connect.facebook.net/en_US/fbevents.js'),
    tiktokPixelScriptBaseUrl: readEnv('VITE_TIKTOK_PIXEL_SCRIPT_BASE_URL', 'https://analytics.tiktok.com/i18n/pixel/events.js'),
  },
  seo: {
    title: readEnv('VITE_SITE_TITLE', 'Pame Flores Crea - Sitio en preparacion'),
    description: readEnv('VITE_SITE_DESCRIPTION', 'Sitio oficial de Pame Flores Crea en preparacion.'),
    socialImage: readEnv('VITE_SOCIAL_IMAGE', domain + '/assets/funnel-placeholder.svg'),
  },
  colors: {
    primary: '13 59 102',
    accent: '232 140 140',
    highlight: '77 168 218',
    success: '49 151 112',
    warning: '191 128 38',
    error: '190 58 58',
  },
  surface: {
    page: '247 240 232',
    panel: '255 255 255',
    muted: '245 233 220',
    bump: '255 255 255',
  },
  text: {
    main: '31 37 44',
    muted: '86 94 104',
    subtle: '122 130 139',
    inverse: '255 255 255',
    onPrimary: '255 255 255',
    onAccent: '255 255 255',
  },
  cta: {
    bg: '232 140 140',
    text: '255 255 255',
    hoverBg: '210 117 117',
  },
  prices: {
    main: '27',
    bump: '0',
    totalValue: '221',
    regular: '97',
    regularPrice: '97',
    vip: '0',
  },
  assets: {
    productImage: placeholderAsset,
    salesLetterImage: placeholderAsset,
    bonusImage: placeholderAsset,
    bundleWideImage: placeholderAsset,
    socialImage: placeholderAsset,
    event: {
      ...eventAssets,
      heroImage: eventAssets.hero,
      agendaImages: [eventAssets.agenda1, eventAssets.agenda2, eventAssets.agenda3],
      painImage: eventAssets.pain,
      authorityImage: eventAssets.authority,
      finalCtaImage: eventAssets.finalCta,
      insecureDriverImage: eventAssets.hero,
      confidentDriverImage: eventAssets.agenda3,
      parkedCarImage: eventAssets.pain,
      motherWithChildrenImage: eventAssets.finalCta,
      expertTeachingImage: eventAssets.authority,
    },
  },
  forms: {
    captureWebhookUrl: readEnv('VITE_CAPTURE_WEBHOOK_URL'),
    captureListSlug: readEnv('VITE_CAPTURE_LIST_SLUG'),
    successRedirectType: 'url',
    successRedirectUrl: '/confirmacion',
    whatsappGroupUrl: readEnv('VITE_WHATSAPP_GROUP_URL'),
    whatsappRedirectBaseUrl: readEnv('VITE_WHATSAPP_REDIRECT_BASE_URL', 'https://wa.me'),
    captureFields: {
      firstName: true,
      lastName: false,
      email: true,
      whatsapp: false,
    },
    captureTracking: {
      eventName: 'Lead',
      formId: 'expert_event_registration_form',
      status: 'submitted',
      source: eventCaptureSource,
      payloadEventName: eventName,
    },
  },
  success: {
    action: {
      type: successActionType,
      url: readEnv('VITE_SUCCESS_URL', '/'),
    },
    redirectSeconds: 10,
  },
  copy: {
    productName,
    headline: 'Configura aqui el headline principal de tu VSL',
    headlineHighlight: 'con una promesa clara para tu audiencia',
    subheadline: 'Reemplaza este texto por la descripcion breve de la transformacion, el publico objetivo y el resultado esperado.',
    ctaText: 'Quiero acceder ahora',
    checkoutCtaText: 'Si, quiero acceder',
    orderBumpTitle: '',
    salesLetter: {
      title: 'Historia de transformacion',
      part1: [
        'Usa este bloque para conectar con el problema actual de tu audiencia.',
        'Manten la estructura persuasiva y reemplaza el texto con la historia del nuevo funnel.',
      ],
      highlight: 'Despues, muestra el descubrimiento que cambia el camino.',
      part2: [
        'Explica por que la oferta existe y como ayuda a avanzar con claridad.',
        'Cierra el bloque invitando a tomar accion con el producto configurado.',
      ],
      image: placeholderAsset,
      ctaText: 'Quiero continuar',
    },
    offerStackTitle: 'Lo que recibes hoy',
    benefits: [
      'Beneficio principal configurable',
      'Resultado esperado configurable',
      'Acceso a materiales configurables',
      'Acompanamiento o soporte configurable',
    ],
    specialOfferTitle: 'Oferta especial',
    specialOfferSubtitle: 'Reemplaza esta frase por el resumen de la oferta de <strong>Example Funnel</strong> y el principal motivo para actuar hoy.',
    specialOfferGuarantee: 'Pago seguro - Acceso inmediato',
    specialOfferImage: placeholderAsset,
    presentationPreTitle: 'Te presento:',
    presentationTitle: '<span style="color: rgb(var(--color-brand-primary))">Example Funnel</span>',
    confidenceBooster: {
      headline: 'Refuerza la confianza antes de la decision',
      paragraphs: ['Explica por que la persona puede avanzar aunque empiece desde cero.', 'Muestra que el proceso esta ordenado y que cada paso tiene una razon.'],
      bullets: ['Checklist o guia configurable', 'Recursos de apoyo configurables'],
      includedLabel: 'Incluye:',
    },
    sewingBonus: {
      eyebrow: 'Bono configurable',
      title: 'Bono configurable',
      image: placeholderAsset,
      description: 'Describe aqui el bono que aumenta el valor percibido de la oferta.',
    },
    painPoints: {
      headline: 'Te suena familiar?',
      subtitle: 'Configura aqui los puntos de dolor reales del nuevo mercado.',
      bullets: ['Punto de dolor configurable 1.', 'Punto de dolor configurable 2.', 'Punto de dolor configurable 3.', 'Punto de dolor configurable 4.'],
      transitionText: 'Entonces este puede ser el siguiente paso.',
    },
    modules: [
      { title: 'Modulo configurable 1', value: '$0', description: 'Describe el primer entregable del producto.', image: placeholderAsset },
      { title: 'Modulo configurable 2', value: '$0', description: 'Describe el segundo entregable del producto.', image: placeholderAsset },
      { title: 'Bono configurable', value: '$0', description: 'Describe un bono o recurso adicional.', image: placeholderAsset },
    ],
    fastActionBonus: {
      timeLimit: 'Si tomas accion en los proximos 60 minutos',
      title: 'Bono de accion rapida',
      subtitle: 'Configura aqui el beneficio de actuar ahora.',
    },
    offerSummary: {
      title: 'Todo lo que recibes con {productName} hoy',
      countdownLabel: 'La oferta vence en:',
      opportunityExpiresLabel: 'Esta oportunidad expira en:',
      bundleImageAlt: 'Paquete completo de la oferta con bonos incluidos',
      totalValueLabel: 'Valor total',
      todayPriceLabel: 'Precio de hoy',
      regularPriceLabel: 'Precio regular',
      includedBadgeLabel: 'Incluido gratis',
      realValueLabel: 'Valor real',
      ctaLabel: 'Si, quiero activar {productName}',
      ctaSubLabel: 'Hoy por ${price} - Acceso inmediato y seguro',
      offerAvailableLabel: 'La oferta esta disponible',
      specialPriceLabel: 'Precio especial: ${price}',
      todayOnlyLabel: 'Hoy solo',
      originalPriceLabel: 'Precio original',
      valuedAtLabel: 'Valorado en',
    },
    certaintyItems: [
      { id: 'secure-payment', label: 'Pago seguro' },
      { id: 'guarantee', label: 'Garantia configurable' },
      { id: 'ssl', label: 'Checkout protegido' },
    ],
    orderForm: {
      eyebrow: 'Checkout placeholder',
      description: 'Este bloque se conserva como placeholder temporal. El CTA principal usa la URL de checkout definida en DNA.',
    },
    successPage: {
      eyebrow: 'CONFIRMACION',
      title: 'Tu registro fue recibido',
      description: 'Esta pagina confirma la accion del visitante. Configura el siguiente paso real antes de publicar.',
      backLabel: 'Volver al inicio',
      whatsappLabel: 'Continuar',
      countdownLead: 'Seras redirigido automaticamente en...',
      missingWhatsappUrlMessage: 'El enlace de destino aun no esta configurado.',
      progressAriaLabel: 'Progreso de redireccion',
    },
    captureForm: {
      eyebrow: 'Formulario enriquecido',
      headlineFallback: 'Tambien puedes participar desde tu ciudad',
      headlineWithLocation: 'Tambien puedes participar desde {city} y pagar en {currency}',
      description: 'Completa tus datos para continuar con {productName} y conservar el contexto de tu pais.',
      firstNameLabel: 'Nombre',
      firstNamePlaceholder: 'Tu nombre',
      lastNameLabel: 'Apellido',
      lastNamePlaceholder: 'Tu apellido',
      emailLabel: 'Email',
      emailPlaceholder: 'tu@email.com',
      whatsappLabel: 'WhatsApp',
      whatsappPlaceholder: '79790873',
      requiredError: 'Completa este campo.',
      emailRequiredError: 'Por favor, ingresa tu email.',
      invalidEmailError: 'Ingresa un email valido.',
      whatsappRequiredError: 'Por favor, ingresa tu WhatsApp.',
      invalidWhatsappError: 'Ingresa un numero de WhatsApp valido en formato internacional.',
      submitError: 'No pudimos procesar tu solicitud en este momento. Intentalo nuevamente.',
      submitLabel: 'Validar y enviar',
      submittingLabel: 'Enviando...',
    },
    event: {
      registrationAnchorId: 'final-registration',
      startsAtIso: readEnv('VITE_EVENT_STARTS_AT', '2026-07-01T12:00:00-05:00'),
      footer: {
        logoAlt: eventName,
      },
      hero: {
        eyebrow: 'Free online event',
        eventName,
        dateLabel: 'JULY 1',
        headline: 'Build a focused funnel from a clean parent',
        subheadline: 'Use this neutral demo to validate layout, capture, routing, and checkout placeholders.',
        quickBenefits: ['100% online', 'Free demo', 'Ready to customize'],
        imageAlt: 'Neutral placeholder for the example event hero',
        formTitle: 'Reserve your example spot',
        primaryCtaLabel: 'RESERVE MY SPOT',
        secondaryCtaLabel: 'See the agenda',
        submittingLabel: 'Reservando...',
      },
      socialProof: 'Replace this line with real social proof before launch.',
      countdown: {
        label: 'El evento inicia en:',
        expiredLabel: 'El evento ya comenzo',
        units: {
          days: 'Dias',
          hours: 'Horas',
          minutes: 'Min',
          seconds: 'Seg',
        },
      },
      foundation: {
        sectionEyebrow: 'Base visual',
        sectionTitle: 'A neutral system for a focused example event.',
        sectionText: 'Esta primera version define ritmo, aire visual, tarjetas, CTAs y superficies para construir secciones sin acoplarlas al VSL.',
        cardTitle: 'Foundation de evento',
        cardText: 'Reserva tu acceso gratuito y recibe los recordatorios del evento en tu correo.',
      },
      promise: {
        title: 'Esto es lo que descubriras en el evento:',
        image: eventAssets.agenda3,
        imageAlt: 'Neutral placeholder for the event promise section',
        bullets: [
          'How the boilerplate separates site config from shared components',
          'Which fields a clone should replace before publishing',
          'How placeholder assets keep the first render functional',
          'How capture and checkout defaults stay safe until configured',
        ],
        ctaLabel: 'QUIERO RESERVAR MI CUPO GRATIS',
      },
      transformation: {
        eyebrow: 'Antes vs Despues',
        title: 'Imagine opening a clone and seeing only neutral defaults.',
        beforeTitle: 'Antes del evento',
        afterTitle: 'Despues del evento',
        beforeItems: [
          'The site identity is still placeholder content',
          'Checkout URLs still point to example domains',
          'Tracking IDs are not production values',
          'Proof and assets are not final',
        ],
        afterItems: [
          'The clone has a real product, audience, and domain',
          'Capture and checkout are configured for the new site',
          'Assets are brand-safe and owned by the clone',
          'Launch checks confirm the parent stayed generic',
        ],
      },
      agenda: {
        title: 'Lo que veremos durante el evento',
        items: [
          {
            label: 'Session 1',
            title: 'Review the site boundary',
            description: 'Identify the env values, site config fields, copy, assets, and checkout settings a clone must own.',
            image: eventAssets.agenda1,
            imageAlt: 'Neutral placeholder for agenda item one',
          },
          {
            label: 'Session 2',
            title: 'Replace placeholders',
            description: 'Swap in real offer copy, media, product IDs, tracking IDs, capture endpoints, and success behavior.',
            image: eventAssets.agenda2,
            imageAlt: 'Neutral placeholder for agenda item two',
          },
          {
            label: 'Session 3',
            title: 'Validate before launch',
            description: 'Run typecheck, lint, build, capture validation, route checks, and content searches before publishing.',
            image: eventAssets.agenda3,
            imageAlt: 'Neutral placeholder for agenda item three',
          },
        ],
        ctaLabel: 'RESERVAR MI CUPO GRATUITO',
      },
      whyFearPersists: {
        eyebrow: 'Why cleanup matters',
        title: 'A parent boilerplate should not ship with an active child baseline.',
        paragraphs: [
          'Site-specific defaults can leak domains, assets, tracking, checkout settings, and operational assumptions into new clones.',
          'Neutral defaults make the first render useful while keeping production identity outside the parent repository.',
        ],
        highlights: ['The parent stays clone-safe.', 'Each child site owns its own operational path.'],
      },
      pain: {
        title: 'A clone should never inherit a live project by accident.',
        imageAlt: 'Neutral placeholder for the problem section',
        intro: 'Tal vez hoy:',
        bullets: [
          'The domain still points to a historical site',
          'The checkout still uses placeholder values',
          'Assets still belong to another brand',
          'Capture settings still need server env',
          'Tracking is not configured for production',
          'Launch docs still mention retired assumptions',
        ],
        phrases: ['That is exactly what this parent avoids.', 'Everything active starts neutral.', 'Each clone supplies the real identity.'],
        ctaLabel: 'QUIERO RESERVAR MI CUPO',
      },
      testimonials: {
        eyebrow: 'Example testimonials',
        title: 'Replace these with real audience proof.',
        subtitle: 'Estos testimonios son placeholders editables desde el DNA hasta incorporar historias reales del evento.',
        items: [
          { name: 'Customer A', location: 'Example City', quote: 'This is a neutral placeholder testimonial for the example funnel.' },
          { name: 'Customer B', location: 'Example Region', quote: 'Replace this with a verified quote that supports the real promise.' },
          { name: 'Customer C', location: 'Example Market', quote: 'Use this third card for a concise transformation or result.' },
        ],
      },
      authority: {
        title: 'Who is behind this example?',
        imageAlt: 'Neutral placeholder for the presenter section',
        intro: 'This is a placeholder presenter block.',
        bio: 'Use this area for the real founder, instructor, host, brand, or organization in a clone.',
        paragraphs: ['The parent keeps this copy generic so no clone starts with another site identity.'],
        badges: ['Example badge', 'Configurable proof', 'Safe default'],
        quote: 'A clean parent makes future clones easier to reason about.',
        ctaLabel: 'QUIERO ASISTIR GRATIS AL EVENTO',
      },
      finalCta: {
        eyebrow: 'Registro gratuito',
        headline: 'Reserve your example spot and verify the capture flow',
        imageAlt: 'Neutral placeholder for the final event CTA',
        subheadline: 'This final CTA proves the event page can render, submit, and redirect with neutral configuration.',
        bullets: ['Evento gratuito online', 'Cupos limitados'],
        text: 'Este evento de ejemplo usa placeholders seguros. Reemplaza este texto por una invitacion real antes de publicar.',
        ctaLabel: 'RESERVAR MI CUPO GRATIS',
      },
    },
    pricingCard: {
      eyebrow: 'Oferta especial',
      title: 'Activa {productName} hoy mismo',
      baseValueLabel: 'Valor base',
      basePriceLabel: 'Precio base',
      subtotalLabel: 'Subtotal',
      localTaxesLabel: 'Impuestos locales',
      includedTaxesLabel: 'Incluidos',
      checkoutTotalLabel: 'Total final en {providerName}',
      equivalentLabel: 'Equivalente a {price} USD. Impuestos incluidos',
      internationalPriceLabel: 'Precio internacional directo.',
      buyButtonLabel: 'Comprar ahora',
      unavailableLabel: 'Producto no disponible',
      securePaymentLabel: 'Pago seguro',
      processedByLabel: 'Procesado por {providerName}',
      immediateAccessLabel: 'Acceso inmediato',
    },
    video: {
      smartPosterEyebrow: productName,
      smartPosterTitle: 'Mira la presentacion de ' + productName,
      smartPosterDescription: 'Configura aqui la descripcion del video principal.',
      smartPosterButtonText: 'Ver video',
      ctaEyebrow: 'Oferta activa',
      ctaHeadline: 'La oferta ya esta disponible',
      ctaButtonText: 'Ir al checkout',
      soundPrompt: 'Enciende tus parlantes',
      placeholderText: 'Video placeholder',
    },
    testimonials: {
      headline: 'Testimonios configurables',
      subtitle: 'Reemplaza estos placeholders por testimonios reales del nuevo funnel.',
      items: [
        { name: 'Cliente 1', quote: 'Testimonio placeholder 1.', image: placeholderAsset },
        { name: 'Cliente 2', quote: 'Testimonio placeholder 2.', image: placeholderAsset },
        { name: 'Cliente 3', quote: 'Testimonio placeholder 3.', image: placeholderAsset },
      ],
    },
    faq: {
      title: 'Preguntas frecuentes',
      items: [
        {
          question: 'Que debo configurar antes de publicar?',
          answer: 'Actualiza el video, checkout, tracking, precios, garantias, testimonios, assets y copy desde <code>src/site/**</code> y las variables de entorno necesarias.',
        },
        {
          question: 'El acceso al checkout esta activo?',
          answer: 'No por defecto. El valor inicial es un placeholder seguro. Reemplazalo por la URL real del procesador de pago del nuevo funnel.',
        },
      ],
    },
  },
} as const satisfies DnaConfig;;

export const dnaNumericPrices = {
  main: parsePrice(DNA.prices.main),
  bump: parsePrice(DNA.prices.bump),
  totalValue: parsePrice(DNA.prices.totalValue),
  regular: parsePrice(DNA.prices.regular),
  regularPrice: parsePrice(DNA.prices.regularPrice),
  vip: parsePrice(DNA.prices.vip),
} as const;

export function resolveDnaDocumentTheme(theme: DnaTheme = DNA.theme) {
  return theme === 'expert' ? 'theme-expert' : 'theme-panda';
}

export function resolveDnaFunnelTheme(theme: DnaTheme = DNA.theme) {
  return theme === 'expert' ? 'theme-expert' : 'theme-panda';
}

export function resolveDnaThemeStyle() {
  return {
    '--font-sans': `'${DNA.fonts.sans}', sans-serif`,
    '--font-body': `'${DNA.fonts.body}', sans-serif`,
    '--color-page': toRgbTriplet(DNA.surface.page),
    '--color-surface': toRgbTriplet(DNA.surface.panel),
    '--color-surface-muted': toRgbTriplet(DNA.surface.muted),
    '--color-primary': toRgbTriplet(DNA.colors.primary),
    '--color-secondary': toRgbTriplet(DNA.colors.accent),
    '--color-highlight': toRgbTriplet(DNA.colors.highlight),
    '--color-success': toRgbTriplet(DNA.colors.success),
    '--color-warning': toRgbTriplet(DNA.colors.warning),
    '--color-error': toRgbTriplet(DNA.colors.error),
    '--color-accent': toRgbTriplet(DNA.cta.bg),
    '--color-border-subtle': toRgbTriplet(DNA.text.subtle),
    '--color-text-main': toRgbTriplet(DNA.text.main),
    '--color-text-muted': toRgbTriplet(DNA.text.muted),
    '--color-text-subtle': toRgbTriplet(DNA.text.subtle),
    '--color-text-inverse': toRgbTriplet(DNA.text.inverse),
    '--color-brand-primary': toRgbTriplet(DNA.colors.primary),
    '--color-brand-accent': toRgbTriplet(DNA.colors.accent),
    '--color-cta-base': toRgbTriplet(DNA.cta.bg),
    '--color-cta-hover': toRgbTriplet(DNA.cta.hoverBg),
    '--color-cta-text': toRgbTriplet(DNA.cta.text),
    '--color-surface-bump': toRgbTriplet(DNA.surface.bump),
    '--color-event-page': toRgbTriplet(DNA.surface.page),
    '--color-event-surface': toRgbTriplet(DNA.surface.panel),
    '--color-event-surface-soft': toRgbTriplet(DNA.surface.muted),
    '--color-event-card': toRgbTriplet(DNA.surface.panel),
    '--color-event-ink': toRgbTriplet(DNA.text.main),
    '--color-event-muted': toRgbTriplet(DNA.text.muted),
    '--color-event-navy': toRgbTriplet(DNA.colors.primary),
    '--color-event-sky': toRgbTriplet(DNA.colors.highlight),
    '--color-event-coral': toRgbTriplet(DNA.colors.accent),
    '--color-event-highlight': toRgbTriplet(DNA.surface.muted),
  } as const;
}
