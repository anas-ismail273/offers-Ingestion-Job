/**
 * Data Transfer Object for validated offers.
 * This is the canonical shape that all providers must transform to.
 */
export interface OfferDTO {
  /** ID from external provider (e.g., "19524555") */
  externalOfferId: string;

  /** Provider identifier (e.g., "offer1", "offer2") - STATIC per factory */
  providerName: string;

  /** Offer display name */
  name: string;

  /** URL-friendly slug (auto-generated from name + externalOfferId) */
  slug: string;

  /** Full offer description */
  description: string;

  /** Requirements/instructions for completing the offer */
  requirements: string;

  /** Thumbnail/icon image URL */
  thumbnail: string;

  /** Tracking URL template */
  offerUrlTemplate: string;

  /** 1 if available on desktop, 0 otherwise */
  isDesktop: 0 | 1;

  /** 1 if available on Android, 0 otherwise */
  isAndroid: 0 | 1;

  /** 1 if available on iOS, 0 otherwise */
  isIos: 0 | 1;
}

/**
 * Result of validating a single offer.
 */
export interface ValidationResult {
  success: boolean;
  data?: OfferDTO;
  error?: {
    field: string;
    message: string;
  }[];
}

/**
 * Result of validating multiple offers.
 */
export interface BatchValidationResult {
  valid: OfferDTO[];
  invalid: {
    offer: Partial<OfferDTO>;
    errors: { field: string; message: string }[];
  }[];
}

/**
 * Summary statistics returned after job completion.
 */
export interface IngestionSummary {
  totalProviders: number;
  successfulProviders: number;
  failedProviders: string[];
  totalOffersFetched: number;
  validOffers: number;
  invalidOffers: number;
  upsertedOffers: number;
  durationMs: number;
}
