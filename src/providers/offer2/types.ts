export interface Offer2Response {
  status: string;
  data: Record<string, Offer2RawOffer>;
}

export interface Offer2RawOffer {
  Offer: {
    campaign_id: number;
    store_id: string | null;
    tracking_type: string;
    campaign_vertical: string;
    currency_name_singular: string;
    currency_name_plural: string;
    network_epc: string;
    icon: string;
    name: string;
    tracking_url: string;
    instructions: string;
    disclaimer: string | null;
    description: string;
    short_description: string;
    offer_sticker_text_1: string | null;
    offer_sticker_text_2: string | null;
    offer_sticker_text_3: string | null;
    offer_sticker_color_1: string | null;
    offer_sticker_color_2: string | null;
    offer_sticker_color_3: string | null;
    sort_order_setting: string | null;
    category_1: string | null;
    category_2: string | null;
    amount: number;
    payout_usd: number;
    start_datetime: string;
    end_datetime: string;
    is_multi_reward: boolean;
  };
  Country: {
    include: Record<string, { id: number; code: string; name: string }>;
    exclude: unknown[];
  };
  State: {
    include: unknown[];
    exclude: unknown[];
  };
  City: {
    include: unknown[];
    exclude: unknown[];
  };
  Connection_Type: {
    cellular: boolean;
    wifi: boolean;
  };
  Device: {
    include: unknown[];
    exclude: unknown[];
  };
  OS: {
    android: boolean;
    ios: boolean;
    web: boolean;
    min_ios: string | null;
    max_ios: string | null;
    min_android: string | null;
    max_android: string | null;
  };
}
