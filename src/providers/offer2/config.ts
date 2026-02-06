/**
 * Configuration for Offer2 provider.
 * Loaded from environment variables.
 */
export const offer2Config = {
  baseUrl: process.env.OFFER2_BASE_URL ?? 'https://api.offer2.com',
  apiKey: process.env.OFFER2_API_KEY ?? '',
};
