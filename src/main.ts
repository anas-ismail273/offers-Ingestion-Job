import * as fs from 'fs';
import * as path from 'path';
import { db } from './config/db';
import { IngestionOrchestrator } from './core/orchestrator';
import { providers } from './providers/registry';
import { OfferRepository } from './repository/offer.repository';
import { logger } from './shared/logger';

/**
 * Main entry point.
 * Zero-argument CLI — all providers are imported from the explicit registry.
 */
async function main(): Promise<void> {
  logger.info('Starting offer ingestion job');

  try {
    // Test database connection
    await db.query('SELECT 1');
    logger.info('Connected to database');

    // Initialize database schema
    const initSql = fs.readFileSync(
      path.join(__dirname, 'config', 'init-db.sql'),
      'utf-8'
    );
    await db.query(initSql);
    logger.info('Database schema initialized');

    // Providers are already imported from the registry — no discovery needed
    logger.info(`Registered ${providers.length} provider(s)`);

    // Initialize dependencies
    const repository = new OfferRepository(db);
    const orchestrator = new IngestionOrchestrator(providers, repository);

    // Run ingestion
    const summary = await orchestrator.run();

    // Print summary
    console.log('\n========== INGESTION SUMMARY ==========');
    console.log(`Total Providers:      ${summary.totalProviders}`);
    console.log(`Successful Providers: ${summary.successfulProviders}`);
    console.log(`Failed Providers:     ${summary.failedProviders.length > 0 ? summary.failedProviders.join(', ') : 'None'}`);
    console.log(`Total Offers Fetched: ${summary.totalOffersFetched}`);
    console.log(`Valid Offers:         ${summary.validOffers}`);
    console.log(`Invalid Offers:       ${summary.invalidOffers}`);
    console.log(`Upserted Offers:      ${summary.upsertedOffers}`);
    console.log(`Duration:             ${summary.durationMs}ms`);
    console.log('========================================\n');

    // Exit with error code if any providers failed
    if (summary.failedProviders.length > 0) {
      process.exit(1);
    }
  } catch (error) {
    logger.error('Fatal error during ingestion', {
      error: (error as Error).message,
      stack: (error as Error).stack,
    });
    process.exit(1);
  } finally {
    await db.end();
  }
}

main();
