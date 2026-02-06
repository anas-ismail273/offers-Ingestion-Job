import { IOfferProvider } from '../../core/IOfferProvider';
import { OfferDTO } from '../../types/type.definition';
import { generateSlug } from '../../shared/slug';
import { offer1Config } from './config';
import { Offer1Response, Offer1RawOffer } from './types';
import { payload as offer1MockResponse } from './offer1.payload'; // Static payload for testing
import { httpClient } from '../../shared/http-client';

/**
 * Factory for Offer1 provider.
 *
 * Responsible for fetching raw data from the Offer1 API and constructing
 * standardized OfferDTO objects from the provider-specific response shape.
 *
 * API Response Structure:
 * - offers are in response.offers array
 * - platform can be "desktop" or "mobile"
 * - device "iphone_ipad" indicates iOS, anything else on mobile is Android
 */
export class Offer1Factory implements IOfferProvider {
  readonly name = 'offer1';

  /**
   * Fetch offers from Offer1 API.
   * The response is a static payload for testing, 
   * but the fetch method is implemented to show how it would work with a real API.
   */
  async fetch(): Promise<Offer1Response> {
    const url = `${offer1Config.baseUrl}/offers`;
    const params = {
      pubid: offer1Config.pubId,
      appid: offer1Config.appId,
      platform: 'all',
    };

    //const response = await httpClient.get<Offer1Response>(url, { params });
    return offer1MockResponse as Offer1Response; // Using static payload for testing
  }

  /**
   * Transform Offer1 response to OfferDTO array.
   * This is the factory method, constructs OfferDTOs from raw Offer1 data.
   */
  transform(rawData: unknown): OfferDTO[] {
    const data = rawData as Offer1Response;
    const offers = data.response?.offers ?? [];

    return offers.map((raw) => this.createOfferDTO(raw));
  }

  /**
   * Construct a single OfferDTO from a raw Offer1 offer.
   */
  private createOfferDTO(raw: Offer1RawOffer): OfferDTO {
    // Determine platform availability
    const isDesktop = raw.platform === 'desktop' ? 1 : 0;
    const isMobile = raw.platform === 'mobile';
    const isIosDevice = raw.device === 'iphone_ipad';

    return {
      externalOfferId: raw.offer_id,
      providerName: this.name, // Always "offer1"
      name: raw.offer_name,
      slug: generateSlug(raw.offer_name, raw.offer_id),
      description: raw.offer_desc,
      requirements: raw.call_to_action,
      thumbnail: raw.image_url,
      offerUrlTemplate: raw.offer_url,
      isDesktop: isDesktop as 0 | 1,
      isAndroid: (isMobile && !isIosDevice ? 1 : 0) as 0 | 1,
      isIos: (isMobile && isIosDevice ? 1 : 0) as 0 | 1,
    };
  }
}
