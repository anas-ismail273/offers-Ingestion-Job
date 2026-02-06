import { Offer2Factory } from '../../src/providers/offer2/factory';

describe('Offer2Factory', () => {
  const factory = new Offer2Factory();

  it('should have the correct provider name', () => {
    expect(factory.name).toBe('offer2');
  });

  describe('transform', () => {
    const mockResponse = {
      status: 'success',
      data: {
        '100': {
          Offer: {
            campaign_id: 100,
            name: 'Test Offer 2',
            description: 'Description 2',
            instructions: 'Requirements 2',
            icon: 'https://example.com/icon.png',
            tracking_url: 'https://example.com/track',
          },
          OS: {
            android: true,
            ios: false,
            web: true,
          },
        },
      },
    };

    it('should transform offer2 response to OfferDTO', () => {
      const result = factory.transform(mockResponse);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        externalOfferId: '100',
        providerName: 'offer2',
        name: 'Test Offer 2',
        isDesktop: 1,
        isAndroid: 1,
        isIos: 0,
      });
    });

    it('should handle iOS-only offers', () => {
      const iosResponse = {
        status: 'success',
        data: {
          '200': {
            Offer: {
              ...mockResponse.data['100'].Offer,
              campaign_id: 200,
            },
            OS: {
              android: false,
              ios: true,
              web: false,
            },
          },
        },
      };

      const result = factory.transform(iosResponse);
      expect(result[0].isIos).toBe(1);
      expect(result[0].isAndroid).toBe(0);
      expect(result[0].isDesktop).toBe(0);
    });

    it('should return empty array for non-success status', () => {
      const failResponse = { status: 'error', data: {} };
      const result = factory.transform(failResponse);
      expect(result).toHaveLength(0);
    });

    it('should return empty array for null data', () => {
      const nullDataResponse = { status: 'success', data: null };
      const result = factory.transform(nullDataResponse);
      expect(result).toHaveLength(0);
    });

    it('should generate a slug from offer name and campaign ID', () => {
      const result = factory.transform(mockResponse);
      expect(result[0].slug).toBe('test-offer-2-100');
    });

    it('should handle multiple offers keyed by campaign_id', () => {
      const multiResponse = {
        status: 'success',
        data: {
          '100': mockResponse.data['100'],
          '200': {
            Offer: {
              ...mockResponse.data['100'].Offer,
              campaign_id: 200,
              name: 'Second Offer',
            },
            OS: {
              android: false,
              ios: true,
              web: false,
            },
          },
        },
      };

      const result = factory.transform(multiResponse);
      expect(result).toHaveLength(2);
    });
  });
});
