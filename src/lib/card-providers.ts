export interface CardProvider {
  id: string;
  name: string;
  description: string;
  dateColumns: string[];
  amountColumns: string[];
  merchantColumns: string[];
  categoryColumns: string[];
  referenceColumns: string[];
  knownMerchantPatterns: Record<string, string>;
}

export const CARD_PROVIDERS: CardProvider[] = [
  {
    id: 'amex',
    name: 'American Express',
    description: 'Amex Corporate Card exports',
    dateColumns: ['date', 'transaction date', 'post date', 'posted date'],
    amountColumns: ['amount', 'charge amount', 'debit', 'credit'],
    merchantColumns: ['description', 'merchant', 'payee', 'vendor'],
    categoryColumns: ['category', 'expense category', 'type'],
    referenceColumns: ['reference', 'ref #', 'transaction id'],
    knownMerchantPatterns: {
      'AMZN': 'Amazon',
      'AMZN MKTP': 'Amazon Marketplace',
      'AMAZON.COM': 'Amazon',
      'AMAZON WEB': 'Amazon Web Services',
    },
  },
  {
    id: 'chase',
    name: 'Chase',
    description: 'Chase Ink, United, Sapphire exports',
    dateColumns: ['transaction date', 'post date', 'date'],
    amountColumns: ['amount', 'transaction amount'],
    merchantColumns: ['description', 'merchant name', 'name'],
    categoryColumns: ['category', 'type'],
    referenceColumns: ['reference number', 'transaction id'],
    knownMerchantPatterns: {
      'TST*': 'Toast',
      'SQ *': 'Square',
      'PAYPAL *': 'PayPal',
      'CHASE ': 'Chase Bank',
    },
  },
  {
    id: 'capital-one',
    name: 'Capital One',
    description: 'Capital One Spark Business exports',
    dateColumns: ['transaction date', 'posted date', 'date'],
    amountColumns: ['debit', 'credit', 'amount'],
    merchantColumns: ['description', 'payee', 'merchant'],
    categoryColumns: ['category'],
    referenceColumns: ['card no.', 'transaction id'],
    knownMerchantPatterns: {
      'CAPITAL ONE': 'Capital One',
      'CAPITALONE': 'Capital One',
    },
  },
  {
    id: 'wells-fargo',
    name: 'Wells Fargo',
    description: 'Wells Fargo Business Card exports',
    dateColumns: ['date', 'transaction date', 'post date'],
    amountColumns: ['amount', 'debit', 'credit'],
    merchantColumns: ['description', 'payee'],
    categoryColumns: ['category', 'type'],
    referenceColumns: ['reference', 'check number'],
    knownMerchantPatterns: {
      'WELLS FARGO': 'Wells Fargo',
      'WF ': 'Wells Fargo',
    },
  },
  {
    id: 'citi',
    name: 'Citibank',
    description: 'Citi Business Card exports',
    dateColumns: ['date', 'transaction date', 'posted'],
    amountColumns: ['debit', 'credit', 'amount'],
    merchantColumns: ['description', 'merchant'],
    categoryColumns: ['category'],
    referenceColumns: ['reference'],
    knownMerchantPatterns: {
      'CITI ': 'Citibank',
      'CITIBANK': 'Citibank',
    },
  },
  {
    id: 'bank-of-america',
    name: 'Bank of America',
    description: 'BofA Business Card exports',
    dateColumns: ['posted date', 'transaction date', 'date'],
    amountColumns: ['amount', 'debit', 'credit'],
    merchantColumns: ['payee', 'description', 'merchant'],
    categoryColumns: ['category'],
    referenceColumns: ['reference number', 'check number'],
    knownMerchantPatterns: {
      'BANK OF AMER': 'Bank of America',
      'BOFA': 'Bank of America',
      'BA ELECTRONIC': 'Bank of America',
    },
  },
  {
    id: 'us-bank',
    name: 'U.S. Bank',
    description: 'U.S. Bank Business Card exports',
    dateColumns: ['date', 'transaction date', 'post date'],
    amountColumns: ['amount', 'debit', 'credit'],
    merchantColumns: ['name', 'description', 'merchant'],
    categoryColumns: ['category', 'memo'],
    referenceColumns: ['reference', 'transaction number'],
    knownMerchantPatterns: {
      'US BANK': 'U.S. Bank',
      'USB ': 'U.S. Bank',
    },
  },
  {
    id: 'barclays',
    name: 'Barclays',
    description: 'Barclays Business Card exports',
    dateColumns: ['transaction date', 'date', 'posted date'],
    amountColumns: ['amount', 'debit', 'credit'],
    merchantColumns: ['description', 'merchant name', 'payee'],
    categoryColumns: ['category', 'transaction type'],
    referenceColumns: ['reference', 'transaction ref'],
    knownMerchantPatterns: {
      'BARCLAYS': 'Barclays',
      'BARCLAYCARD': 'Barclays',
    },
  },
  {
    id: 'discover',
    name: 'Discover',
    description: 'Discover Business Card exports',
    dateColumns: ['trans. date', 'transaction date', 'post date'],
    amountColumns: ['amount'],
    merchantColumns: ['description'],
    categoryColumns: ['category'],
    referenceColumns: ['reference'],
    knownMerchantPatterns: {
      'DISCOVER': 'Discover',
    },
  },
  {
    id: 'svb',
    name: 'Silicon Valley Bank',
    description: 'SVB Card exports',
    dateColumns: ['date', 'transaction date', 'value date'],
    amountColumns: ['amount', 'debit', 'credit'],
    merchantColumns: ['description', 'narrative', 'payee'],
    categoryColumns: ['type', 'category'],
    referenceColumns: ['reference', 'transaction id'],
    knownMerchantPatterns: {
      'SVB': 'Silicon Valley Bank',
      'SILICON VALLEY': 'Silicon Valley Bank',
    },
  },
  {
    id: 'brex',
    name: 'Brex',
    description: 'Brex Corporate Card exports',
    dateColumns: ['date', 'posted date', 'transaction date'],
    amountColumns: ['amount', 'usd amount'],
    merchantColumns: ['merchant', 'description', 'vendor'],
    categoryColumns: ['category', 'expense category'],
    referenceColumns: ['id', 'transaction id'],
    knownMerchantPatterns: {
      'BREX': 'Brex',
    },
  },
  {
    id: 'ramp',
    name: 'Ramp',
    description: 'Ramp Corporate Card exports',
    dateColumns: ['date', 'transaction date'],
    amountColumns: ['amount', 'usd amount'],
    merchantColumns: ['merchant', 'merchant name', 'vendor'],
    categoryColumns: ['category', 'accounting category'],
    referenceColumns: ['id', 'transaction id'],
    knownMerchantPatterns: {
      'RAMP': 'Ramp',
    },
  },
  {
    id: 'divvy',
    name: 'Divvy (Bill.com)',
    description: 'Divvy Card exports',
    dateColumns: ['date', 'transaction date', 'posted date'],
    amountColumns: ['amount'],
    merchantColumns: ['merchant', 'vendor', 'description'],
    categoryColumns: ['budget', 'category'],
    referenceColumns: ['transaction id', 'id'],
    knownMerchantPatterns: {
      'DIVVY': 'Divvy',
      'BILL.COM': 'Bill.com',
    },
  },
  {
    id: 'stripe',
    name: 'Stripe Issuing',
    description: 'Stripe Issuing Card exports',
    dateColumns: ['created', 'date', 'created_at'],
    amountColumns: ['amount', 'net'],
    merchantColumns: ['merchant_name', 'description'],
    categoryColumns: ['merchant_category', 'category'],
    referenceColumns: ['id', 'authorization_id'],
    knownMerchantPatterns: {
      'STRIPE': 'Stripe',
    },
  },
  {
    id: 'mercury',
    name: 'Mercury',
    description: 'Mercury Card exports',
    dateColumns: ['date', 'posted date'],
    amountColumns: ['amount', 'debit', 'credit'],
    merchantColumns: ['description', 'merchant', 'counterparty'],
    categoryColumns: ['category'],
    referenceColumns: ['id', 'transaction id'],
    knownMerchantPatterns: {
      'MERCURY': 'Mercury',
    },
  },
  {
    id: 'generic',
    name: 'Generic CSV',
    description: 'Auto-detect columns',
    dateColumns: ['date', 'transaction date', 'posted date', 'post date', 'trans date', 'trans. date', 'value date', 'created', 'created_at'],
    amountColumns: ['amount', 'debit', 'credit', 'charge', 'total', 'sum', 'net', 'usd amount', 'transaction amount'],
    merchantColumns: ['description', 'merchant', 'payee', 'vendor', 'name', 'merchant name', 'narrative', 'counterparty'],
    categoryColumns: ['category', 'type', 'expense category', 'memo', 'budget'],
    referenceColumns: ['reference', 'ref', 'id', 'transaction id', 'check number', 'reference number'],
    knownMerchantPatterns: {},
  },
];

// Common merchant patterns across all providers
export const COMMON_MERCHANT_PATTERNS: Record<string, string> = {
  'AMZN': 'Amazon',
  'AMZN MKTP': 'Amazon Marketplace',
  'AMAZON.COM': 'Amazon',
  'AMAZON WEB': 'Amazon Web Services',
  'UBER   TRIP': 'Uber',
  'UBER EATS': 'Uber Eats',
  'UBER*': 'Uber',
  'LYFT  *RIDE': 'Lyft',
  'LYFT *': 'Lyft',
  'SQ *': 'Square',
  'SQUARE *': 'Square',
  'STARBUCKS': 'Starbucks',
  'SBUX': 'Starbucks',
  'MCDONALDS': 'McDonalds',
  'MCD': 'McDonalds',
  'DOORDASH': 'DoorDash',
  'DD *': 'DoorDash',
  'GRUBHUB': 'Grubhub',
  'GH *': 'Grubhub',
  'POSTMATES': 'Postmates',
  'TST*': 'Toast',
  'TOAST *': 'Toast',
  'PAYPAL *': 'PayPal',
  'PP*': 'PayPal',
  'VENMO': 'Venmo',
  'ZELLE': 'Zelle',
  'GOOGLE *': 'Google',
  'GOOGL *': 'Google',
  'APPLE.COM': 'Apple',
  'APPLE *': 'Apple',
  'MSFT *': 'Microsoft',
  'MICROSOFT': 'Microsoft',
  'ZOOM.US': 'Zoom',
  'ZOOM VIDEO': 'Zoom',
  'SLACK': 'Slack',
  'NOTION': 'Notion',
  'FIGMA': 'Figma',
  'GITHUB': 'GitHub',
  'ATLASSIAN': 'Atlassian',
  'DROPBOX': 'Dropbox',
  'MAILCHIMP': 'Mailchimp',
  'HUBSPOT': 'HubSpot',
  'SALESFORCE': 'Salesforce',
  'SHOPIFY': 'Shopify',
  'STRIPE': 'Stripe',
  'WIX.COM': 'Wix',
  'SQUARESPACE': 'Squarespace',
  'GODADDY': 'GoDaddy',
  'NAMECHEAP': 'Namecheap',
  'CLOUDFLARE': 'Cloudflare',
  'HEROKU': 'Heroku',
  'DIGITALOCEAN': 'DigitalOcean',
  'LINODE': 'Linode',
  'NETLIFY': 'Netlify',
  'VERCEL': 'Vercel',
  'LINKEDIN': 'LinkedIn',
  'FACEBOOK': 'Meta',
  'FB *': 'Meta',
  'TWITTER': 'X (Twitter)',
  'X.COM': 'X (Twitter)',
  'DELTA': 'Delta Airlines',
  'UNITED': 'United Airlines',
  'AMERICAN AIR': 'American Airlines',
  'SOUTHWEST': 'Southwest Airlines',
  'JETBLUE': 'JetBlue',
  'HILTON': 'Hilton',
  'MARRIOTT': 'Marriott',
  'HYATT': 'Hyatt',
  'IHG': 'IHG Hotels',
  'AIRBNB': 'Airbnb',
  'VRBO': 'VRBO',
  'EXPEDIA': 'Expedia',
  'BOOKING.COM': 'Booking.com',
  'HERTZ': 'Hertz',
  'ENTERPRISE': 'Enterprise',
  'AVIS': 'Avis',
  'NATIONAL CAR': 'National',
  'COSTCO': 'Costco',
  'WALMART': 'Walmart',
  'TARGET': 'Target',
  'BESTBUY': 'Best Buy',
  'BEST BUY': 'Best Buy',
  'HOMEDEPOT': 'Home Depot',
  'HOME DEPOT': 'Home Depot',
  'LOWES': 'Lowes',
  'OFFICE DEPOT': 'Office Depot',
  'STAPLES': 'Staples',
  'CVS': 'CVS',
  'WALGREENS': 'Walgreens',
  'FEDEX': 'FedEx',
  'UPS': 'UPS',
  'USPS': 'USPS',
  'DHL': 'DHL',
  'SHELL': 'Shell',
  'CHEVRON': 'Chevron',
  'EXXON': 'ExxonMobil',
  'BP ': 'BP',
  'COMCAST': 'Comcast',
  'VERIZON': 'Verizon',
  'ATT*': 'AT&T',
  'AT&T': 'AT&T',
  'T-MOBILE': 'T-Mobile',
  'SPRINT': 'Sprint',
};

export function detectCardProvider(headers: string[]): CardProvider {
  const normalizedHeaders = headers.map(h => h.toLowerCase().trim());
  
  // Score each provider based on column matches
  let bestMatch = CARD_PROVIDERS.find(p => p.id === 'generic')!;
  let bestScore = 0;
  
  for (const provider of CARD_PROVIDERS) {
    if (provider.id === 'generic') continue;
    
    let score = 0;
    const allColumns = [
      ...provider.dateColumns,
      ...provider.amountColumns,
      ...provider.merchantColumns,
    ];
    
    for (const col of allColumns) {
      if (normalizedHeaders.includes(col.toLowerCase())) {
        score++;
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = provider;
    }
  }
  
  return bestMatch;
}

export function getProviderById(id: string): CardProvider | undefined {
  return CARD_PROVIDERS.find(p => p.id === id);
}
