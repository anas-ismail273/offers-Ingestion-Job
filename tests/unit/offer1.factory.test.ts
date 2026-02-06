import { Offer1Factory } from '../../src/providers/offer1/factory';

describe('Offer1Factory', () => {
  const factory = new Offer1Factory();

  it('should have the correct provider name', () => {
    expect(factory.name).toBe('offer1');
  });

  describe('transform', () => {
    const mockResponse = {
      response: {
        offers: [
          {
            offer_id: '12345',
            offer_name: 'Test Offer',
            offer_desc: 'Description',
            call_to_action: 'Requirements',
            offer_url: 'https://example.com',
            image_url: 'https://example.com/img.png',
            platform: 'mobile',
            device: 'iphone_ipad',
          },
        ],
      },
    };

    it('should transform offer1 response to OfferDTO', () => {
      const result = factory.transform(mockResponse);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        externalOfferId: '12345',
        providerName: 'offer1',
        name: 'Test Offer',
        isIos: 1,
        isAndroid: 0,
        isDesktop: 0,
      });
    });

    it('should set isAndroid for non-iOS mobile', () => {
      const androidResponse = {
        response: {
          offers: [{
            ...mockResponse.response.offers[0],
            device: 'android',
          }],
        },
      };

      const result = factory.transform(androidResponse);
      expect(result[0].isAndroid).toBe(1);
      expect(result[0].isIos).toBe(0);
    });

    it('should set isDesktop for desktop platform', () => {
      const desktopResponse = {
        response: {
          offers: [{
            ...mockResponse.response.offers[0],
            platform: 'desktop',
          }],
        },
      };

      const result = factory.transform(desktopResponse);
      expect(result[0].isDesktop).toBe(1);
    });

    it('should generate a slug from offer name and ID', () => {
      const result = factory.transform(mockResponse);
      expect(result[0].slug).toBe('test-offer-12345');
    });

    it('should return empty array for missing offers', () => {
      const emptyResponse = { response: {} };
      const result = factory.transform(emptyResponse);
      expect(result).toHaveLength(0);
    });
  });
});
