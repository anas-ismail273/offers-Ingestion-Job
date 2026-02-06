import { IOfferProvider } from '../core/IOfferProvider';
import { Offer1Factory } from './offer1/factory';
import { Offer2Factory } from './offer2/factory';
// Import additional provider factories here:
// import { Offer3Factory } from './offer3/factory';

/**
 * Central provider registry.
 *
 * All provider factories are explicitly imported and instantiated here.
 * This is the single source of truth for which providers are active.
 *
 * To add a new provider:
 * 1. Create a new folder: src/providers/[providerName]/
 * 2. Create factory.ts implementing IOfferProvider
 * 3. Create types.ts with raw API response types
 * 4. Import the factory class here
 * 5. Add a new instance to the providers array below
 */
export const providers: IOfferProvider[] = [
  new Offer1Factory(),
  new Offer2Factory(),
  // new Offer3Factory(),
  // Add new provider instances here
];
