export const wpBlocks = {
  insert: 'as/insert',
  footnotes: 'acf/footnotes',
  keyNumbers: 'acf/key-numbers',
  digitalProduct: 'acf/digital-product',
  lead: 'acf/lead',
  studyLink: 'acf/study-link',
  quote: 'acf/quote',
  ad: 'acf/ad',
  relatedLink: 'acf/related-link',
  buttons: 'core/buttons',
  embed: 'core/embed',
  gallery: 'core/gallery',
  heading: 'core/heading',
  image: 'core/image',
  list: 'core/list',
  listItem: 'core/list-item',
  paragraph: 'core/paragraph',
  paywall: 'acf/paywall',
  newsletter: 'acf/newsletter',
  separator: 'core/separator',
};

// TODO: make tribune category and features categories exposed on the graphQL api (and administrable when admin on WP)
// Opinion categories slugs in different languages. Used to get the last tribune article in the homepage
export const tribuneCategories = {
  fr: 'tribune-libre',
  en: 'opinion',
};

export const newsCategories = {
  fr: 'news',
  en: 'news-en',
};

// Featured categories on Homepage
export const featuredCategories = [
  {
    name: 'businessFeatured',
    sponsored: 'businessSponsored',
    fr: 'business-tendances',
    en: 'business-trends',
  },
  {
    name: 'styleFeatured',
    sponsored: 'styleSponsored',
    fr: 'style-evasion',
    en: 'style-experiences',
  },
  {
    name: 'sustainabilityFeatured',
    sponsored: 'sustainabilitySponsored',
    fr: 'durabilite',
    en: 'sustainability',
  },
];

// Pages that have a specific template and where a part of it is static (for now)
export const specificPages = [
  '/inscription-newsletter',
  '/en/newsletter-subscription',
  '/le-sclr',
  '/en/the-sclr',
  '/a-propos',
  '/en/about',
  '/sabonner',
  '/en/subscribe',
  '/evenements',
  '/en/events',
];

// Number of posts per page in different contexts
export const postsAmount = {
  homeInitial: 6,
  homeLoadMore: 15,
  category: 15,
  author: 15,
  type: 15,
  related: 2,
  featuredCategories: 5,
  stories: 10,
  search: 7,
};

export const subscriptionCurrencies = ['CHF', 'EUR', 'USD'];

export const subscriptionPromoPeriod = {
  percentage: 0.5,
  promoStartDate: new Date('2024-12-01T00:00:00'),
  promoEndDate: new Date('2024-12-31T23:59:59'),
  promoProductId: [5033, 5034],
  promoCode: 'noel2024',
  fr: {
    promoCodeLabel: 'Offre de Noël -50% activée',
  },
  en: {
    promoCodeLabel: 'Coupon -50% activated',
  },
};

export const newsletter = {
  fr: {
    dataId:
      '2BE4EF332AA2E32596E38B640E905619E9A1627D749E054FFAC18F350315A0407C7B91C6C14A9B8F8E8640334E8984E96B0A64AA6B710C25C0E02580232C6089',
    firstName: 'cm-f-jlilmr',
    lastName: 'cm-f-jlilmy',
    email: 'cm-wdrtju-wdrtju',
    mewsletterType: {
      id: 'cm-fo-tuutdut',
      news: '3891294',
      genz: '3891293',
      analyses: '3891292',
      trends: '3891291',
    },
  },
  en: {
    dataId:
      '2BE4EF332AA2E32596E38B640E905619342F8C3514F81AA1F37539B847C73601A588B10C447717A9CF375CCA87E06F491A603AD0A915D775AA013E82CB872356',
    firstName: 'cm-f-jlilmt',
    lastName: 'cm-f-jlilmi',
    email: 'cm-wdrtth-wdrtth',
    mewsletterType: {
      id: 'cm-fo-tuuthju',
      news: '3891306',
      genz: '3891305',
      analyses: '3891303',
      trends: '3891304',
    },
  },
};

export default {
  apiHost: `${process.env.NEXT_PUBLIC_BASE_API_URL}/wp/graphql`,
  publicConsumerKey: process.env.NEXT_PUBLIC_CONSUMER_KEY,
  secretConsumerKey: process.env.NEXT_SECRET_CONSUMER_KEY,
  restApiHost: `${process.env.NEXT_PUBLIC_BASE_API_URL}/wp-json/wc`,
  stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_KEY,
  stripeSecretKey: process.env.NEXT_SECRET_STRIPE_KEY,
  baseApiHost: process.env.NEXT_PUBLIC_BASE_API_URL,
};
