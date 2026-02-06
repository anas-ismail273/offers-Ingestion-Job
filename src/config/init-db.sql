CREATE TABLE IF NOT EXISTS offers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    thumbnail VARCHAR(255) NOT NULL,
    is_desktop SMALLINT DEFAULT 0,
    is_android SMALLINT DEFAULT 0,
    is_ios SMALLINT DEFAULT 0,
    offer_url_template VARCHAR(256) NOT NULL,
    provider_name VARCHAR(255),
    external_offer_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(external_offer_id, provider_name)
);
