import { IOfferProvider } from './IOfferProvider';
import { IngestionSummary } from '../types/type.definition';
import { validateOffers } from '../shared/validator';
import { OfferRepository } from '../repository/offer.repository';
import { logger } from '../shared/logger';

/**
 * Orchestrates the offer ingestion process.
 * Coordinates fetching, transforming, validating, and persisting offers.
 * Processes providers concurrently using Promise.all() for faster execution.
 */
export class IngestionOrchestrator {
  private providers: IOfferProvider[];
  private repository: OfferRepository;

  constructor(
    providers: IOfferProvider[],
    repository: OfferRepository
  ) {
    this.providers = providers;
    this.repository = repository;
  }

  /**
   * Run the ingestion process for all registered providers.
   */
  async run(): Promise<IngestionSummary> {
    const startTime = Date.now();

    logger.info('Starting offer ingestion', {
      totalProviders: this.providers.length,
      providerNames: this.providers.map((p) => p.name),
    });

    const summary: IngestionSummary = {
      totalProviders: this.providers.length,
      successfulProviders: 0,
      failedProviders: [],
      totalOffersFetched: 0,
      validOffers: 0,
      invalidOffers: 0,
      upsertedOffers: 0,
      durationMs: 0,
    };

    // Process all providers concurrently
    const results = await Promise.all(
      this.providers.map((provider) => this.processProvider(provider))
    );

    // Aggregate results
    for (const result of results) {
      if (result.success) {
        summary.successfulProviders++;
        summary.totalOffersFetched += result.totalFetched;
        summary.validOffers += result.validCount;
        summary.invalidOffers += result.invalidCount;
        summary.upsertedOffers += result.upsertedCount;
      } else {
        summary.failedProviders.push(result.providerName);
      }
    }

    summary.durationMs = Date.now() - startTime;

    logger.info('Offer ingestion completed', { summary });
    return summary;
  }

  /**
   * Process a single provider: fetch → transform → validate → persist.
   * Errors are caught per-provider so one failure doesn't stop others.
   */
  private async processProvider(provider: IOfferProvider): Promise<{
    success: boolean;
    providerName: string;
    totalFetched: number;
    validCount: number;
    invalidCount: number;
    upsertedCount: number;
  }> {
    const providerName = provider.name;

    try {
      logger.info(`Processing provider: ${providerName}`);

      // 1. Fetch raw data
      const rawData = await provider.fetch();

      // 2. Transform to OfferDTO[]
      const offers = provider.transform(rawData);
      logger.info(`Fetched ${offers.length} offers from ${providerName}`);

      // 3. Validate offers
      const { valid, invalid } = validateOffers(offers);

      // 4. Log invalid offers
      for (const { offer, errors } of invalid) {
        logger.logSkippedOffer(
          providerName,
          offer.externalOfferId,
          errors
        );
      }

      // 5. Persist valid offers (sequential upserts)
      const upsertedCount = await this.repository.upsertMany(valid);

      logger.info(`Completed provider: ${providerName}`, {
        total: offers.length,
        valid: valid.length,
        invalid: invalid.length,
        upserted: upsertedCount,
      });

      return {
        success: true,
        providerName,
        totalFetched: offers.length,
        validCount: valid.length,
        invalidCount: invalid.length,
        upsertedCount,
      };
    } catch (error) {
      logger.error(`Failed to process provider: ${providerName}`, {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });

      return {
        success: false,
        providerName,
        totalFetched: 0,
        validCount: 0,
        invalidCount: 0,
        upsertedCount: 0,
      };
    }
  }
}
