#!/bin/bash
# Query the offers table to validate data was inserted
docker exec almedia-postgres psql -U postgres -d almedia -c "SELECT id, name, slug, provider_name, external_offer_id, is_desktop, is_android, is_ios FROM offers;"
