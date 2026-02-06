import { validateOffer, validateOffers } from '../../src/shared/validator';

describe('OfferValidator', () => {
  const validOffer = {
    externalOfferId: '12345',
    providerName: 'offer1',
    name: 'Test Offer',
    slug: 'test-offer-12345',
    description: 'Test description',
    requirements: 'Test requirements',
    thumbnail: 'https://example.com/image.png',
    offerUrlTemplate: 'https://example.com/offer',
    isDesktop: 0,
    isAndroid: 1,
    isIos: 0,
  };

  describe('validateOffer', () => {
    it('should return success for valid offer', () => {
      const result = validateOffer(validOffer);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validOffer);
    });

    it('should fail for missing required fields', () => {
      const result = validateOffer({ ...validOffer, name: '' });
      expect(result.success).toBe(false);
      expect(result.error).toContainEqual(
        expect.objectContaining({ field: 'name' })
      );
    });

    it('should fail for invalid URL', () => {
      const result = validateOffer({ ...validOffer, thumbnail: 'not-a-url' });
      expect(result.success).toBe(false);
      expect(result.error).toContainEqual(
        expect.objectContaining({ field: 'thumbnail' })
      );
    });

    it('should fail for invalid slug format', () => {
      const result = validateOffer({ ...validOffer, slug: 'Invalid Slug!' });
      expect(result.success).toBe(false);
      expect(result.error).toContainEqual(
        expect.objectContaining({ field: 'slug' })
      );
    });

    it('should fail for externalOfferId exceeding 255 chars', () => {
      const result = validateOffer({ ...validOffer, externalOfferId: 'a'.repeat(256) });
      expect(result.success).toBe(false);
      expect(result.error).toContainEqual(
        expect.objectContaining({ field: 'externalOfferId' })
      );
    });

    it('should fail for invalid isDesktop value', () => {
      const result = validateOffer({ ...validOffer, isDesktop: 2 });
      expect(result.success).toBe(false);
    });

    it('should default isDesktop to 0 when omitted', () => {
      const { isDesktop, ...offerWithoutDesktop } = validOffer;
      const result = validateOffer(offerWithoutDesktop);
      expect(result.success).toBe(true);
      expect(result.data?.isDesktop).toBe(0);
    });
  });

  describe('validateOffers', () => {
    it('should separate valid and invalid offers', () => {
      const offers = [
        validOffer,
        { ...validOffer, externalOfferId: '67890' },
        { ...validOffer, name: '' }, // Invalid
      ];

      const result = validateOffers(offers);
      expect(result.valid).toHaveLength(2);
      expect(result.invalid).toHaveLength(1);
    });

    it('should return empty arrays for empty input', () => {
      const result = validateOffers([]);
      expect(result.valid).toHaveLength(0);
      expect(result.invalid).toHaveLength(0);
    });

    it('should include error details for invalid offers', () => {
      const result = validateOffers([{ ...validOffer, name: '' }]);
      expect(result.invalid).toHaveLength(1);
      expect(result.invalid[0].errors.length).toBeGreaterThan(0);
    });
  });
});
