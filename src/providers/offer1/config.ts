/**
 * Configuration for Offer1 provider.
 * Loaded from environment variables.
 */
export const offer1Config = {
  baseUrl: process.env.OFFER1_BASE_URL ?? 'https://api.offer1.com',
  pubId: process.env.OFFER1_PUB_ID ?? '',
  appId: process.env.OFFER1_APP_ID ?? '',
};
