import { Pool } from 'pg';
import { OfferDTO } from '../types/type.definition';
import { logger } from '../shared/logger';

/**
 * Repository for offer database operations.
 * Uses pg Pool for direct SQL access.
 * All operations are sequential — no transaction batching.
 */
export class OfferRepository {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  /**
   * Upsert a single offer.
   * Uses composite key (external_offer_id, provider_name) for matching.
   */
  async upsert(offer: OfferDTO): Promise<void> {
    const query = `
      INSERT INTO offers (
        external_offer_id, provider_name, name, slug, description,
        requirements, thumbnail, offer_url_template,
        is_desktop, is_android, is_ios, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      ON CONFLICT (external_offer_id, provider_name) DO UPDATE SET
        name = EXCLUDED.name,
        slug = EXCLUDED.slug,
        description = EXCLUDED.description,
        requirements = EXCLUDED.requirements,
        thumbnail = EXCLUDED.thumbnail,
        offer_url_template = EXCLUDED.offer_url_template,
        is_desktop = EXCLUDED.is_desktop,
        is_android = EXCLUDED.is_android,
        is_ios = EXCLUDED.is_ios,
        updated_at = NOW()
    `;

    const values = [
      offer.externalOfferId,
      offer.providerName,
      offer.name,
      offer.slug,
      offer.description,
      offer.requirements,
      offer.thumbnail,
      offer.offerUrlTemplate,
      offer.isDesktop,
      offer.isAndroid,
      offer.isIos,
    ];

    await this.db.query(query, values);
  }

  /**
   * Upsert multiple offers sequentially.
   * Each offer is upserted individually — no transaction batching.
   * Returns count of successfully upserted offers.
   */
  async upsertMany(offers: OfferDTO[]): Promise<number> {
    let count = 0;

    for (const offer of offers) {
      try {
        await this.upsert(offer);
        count++;
      } catch (error) {
        logger.error('Failed to upsert offer', {
          externalOfferId: offer.externalOfferId,
          providerName: offer.providerName,
          error: (error as Error).message,
        });
      }
    }

    return count;
  }
}
