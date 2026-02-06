import { z } from 'zod';
import { OfferDTO, ValidationResult, BatchValidationResult } from '../types/type.definition';

/**
 * Zod schema for validating OfferDTO objects.
 * All fields are required unless explicitly marked optional in the entity.
 */
export const offerDTOSchema = z.object({
  externalOfferId: z
    .string()
    .min(1, 'externalOfferId is required')
    .max(255, 'externalOfferId must be 255 characters or less'),

  providerName: z
    .string()
    .min(1, 'providerName is required')
    .max(255, 'providerName must be 255 characters or less'),

  name: z
    .string()
    .min(1, 'name is required')
    .max(255, 'name must be 255 characters or less'),

  slug: z
    .string()
    .min(1, 'slug is required')
    .max(255, 'slug must be 255 characters or less')
    .regex(/^[a-z0-9-]+$/, 'slug must be lowercase alphanumeric with hyphens'),

  description: z
    .string()
    .min(1, 'description is required'),

  requirements: z
    .string()
    .min(1, 'requirements is required'),

  thumbnail: z
    .string()
    .min(1, 'thumbnail is required')
    .max(255, 'thumbnail must be 255 characters or less')
    .url('thumbnail must be a valid URL'),

  offerUrlTemplate: z
    .string()
    .min(1, 'offerUrlTemplate is required')
    .max(256, 'offerUrlTemplate must be 256 characters or less')
    .url('offerUrlTemplate must be a valid URL'),

  isDesktop: z
    .union([z.literal(0), z.literal(1)])
    .default(0),

  isAndroid: z
    .union([z.literal(0), z.literal(1)])
    .default(0),

  isIos: z
    .union([z.literal(0), z.literal(1)])
    .default(0),
});

/**
 * Validate a single offer.
 * @returns ValidationResult with success status and either data or errors
 */
export function validateOffer(offer: unknown): ValidationResult {
  const result = offerDTOSchema.safeParse(offer);

  if (result.success) {
    return { success: true, data: result.data as OfferDTO };
  }

  return {
    success: false,
    error: result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    })),
  };
}

/**
 * Validate multiple offers, separating valid from invalid.
 * Invalid offers are collected with their error details for logging.
 */
export function validateOffers(offers: unknown[]): BatchValidationResult {
  const valid: OfferDTO[] = [];
  const invalid: BatchValidationResult['invalid'] = [];

  for (const offer of offers) {
    const result = validateOffer(offer);

    if (result.success && result.data) {
      valid.push(result.data);
    } else {
      invalid.push({
        offer: offer as Partial<OfferDTO>,
        errors: result.error ?? [],
      });
    }
  }

  return { valid, invalid };
}
