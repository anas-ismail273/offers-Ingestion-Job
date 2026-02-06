import { IOfferProvider } from '../../core/IOfferProvider';
import { OfferDTO } from '../../types/type.definition';
import { generateSlug } from '../../shared/slug';
import { offer2Config } from './config';
import { Offer2Response, Offer2RawOffer } from './types';
import { payload as offer2MockResponse } from './offer2.payload'; // Static payload for testing
import { httpClient } from '../../shared/http-client';

/**
 * Factory for Offer2 provider.
 *
 * Responsible for fetching raw data from the Offer2 API and constructing
 * standardized OfferDTO objects from the provider-specific response shape.
 *
 * API Response Structure:
 * - offers are in data object, keyed by campaign_id
 * - OS object contains android, ios, web booleans
 */
export class Offer2Factory implements IOfferProvider {
  readonly name = 'offer2';

  /**
   * Fetch offers from Offer2 API.
   * The response is a static payload for testing, 
   * but the fetch method is implemented to show how it would work with a real API.
   */
  async fetch(): Promise<Offer2Response> {
    const url = `${offer2Config.baseUrl}/v1/offers`;
    const headers = {
      Authorization: `Bearer ${offer2Config.apiKey}`,
    };

    //const response = await httpClient.get<Offer2Response>(url, { headers });
    return offer2MockResponse as Offer2Response; // Using static payload for testing
  }

  /**
   * Transform Offer2 response to OfferDTO array.
   * This is the factory method, constructs OfferDTOs from raw Offer2 data.
   */
  transform(rawData: unknown): OfferDTO[] {
    const data = rawData as Offer2Response;

    if (data.status !== 'success' || !data.data) {
      return [];
    }

    // data.data is an object keyed by campaign_id
    const offers = Object.values(data.data);
    return offers.map((raw) => this.createOfferDTO(raw));
  }

  /**
   * Construct a single OfferDTO from a raw Offer2 offer.
   */
  private createOfferDTO(raw: Offer2RawOffer): OfferDTO {
    const offer = raw.Offer;
    const os = raw.OS;

    return {
      externalOfferId: String(offer.campaign_id),
      providerName: this.name, // Always "offer2"
      name: offer.name,
      slug: generateSlug(offer.name, String(offer.campaign_id)),
      description: offer.description,
      requirements: offer.instructions,
      thumbnail: offer.icon,
      offerUrlTemplate: offer.tracking_url,
      isDesktop: (os.web ? 1 : 0) as 0 | 1,
      isAndroid: (os.android ? 1 : 0) as 0 | 1,
      isIos: (os.ios ? 1 : 0) as 0 | 1,
    };
  }
}
