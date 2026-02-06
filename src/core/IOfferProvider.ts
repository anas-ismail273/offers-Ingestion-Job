import { OfferDTO } from '../types/type.definition';
/**
 * Interface that all provider factories must implement.
 * Each factory is a self-contained module in src/providers/[providerName]/.
 *
 * The Factory Pattern is used here because each provider factory encapsulates
 * the construction of standardized OfferDTO objects from provider-specific
 * raw data. The factory knows HOW to create DTOs from its unique API response shape.
 */
export interface IOfferProvider {
  /**
   * Unique identifier for this provider.
   * Must match the static providerName set in transformed offers.
   * Examples: "offer1", "offer2"
   */
  readonly name: string;

  /**
   * Fetch raw data from the external provider's API.
   * @returns Raw JSON response (shape varies per provider)
   */
  fetch(): Promise<unknown>;

  /**
   * Transform raw provider response into standardized OfferDTO array.
   * This is the core factory method — it constructs OfferDTO objects
   * from the provider-specific raw data shape.
   * @param rawData - The raw response from fetch()
   * @returns Array of OfferDTO objects (not yet validated)
   */
  transform(rawData: unknown): OfferDTO[];
}