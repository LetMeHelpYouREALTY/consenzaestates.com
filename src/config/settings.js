
const siteSettings = {
  // Site metadata
  site: {
    name: "Dr. Jan Duffy | Luxury Real Estate",
    description: "Premier luxury real estate specialist for Consenza Estates in Las Vegas",
    url: "https://www.consenzaestates.com",
    logo: "/assets/images/logo.png",
    favicon: "/favicon.png"
  },
  
  // SEO settings
  seo: {
    titleTemplate: "%s | Dr. Jan Duffy Luxury Real Estate",
    defaultTitle: "Dr. Jan Duffy | Premier Luxury Real Estate - Consenza Estates Las Vegas",
    defaultDescription: "Experience unparalleled luxury with Dr. Jan Duffy, your elite real estate specialist for prestigious Lennar homes in the exclusive Consenza Estates community of Las Vegas. Discover extraordinary properties with personalized concierge service and unmatched expertise for the most discerning clients.",
    openGraph: {
      type: 'website',
      locale: 'en_US',
      site_name: 'Dr. Jan Duffy Luxury Real Estate',
      images: [
        {
          url: '/social.png',
          width: 1200,
          height: 630,
          alt: 'Dr. Jan Duffy Luxury Real Estate',
        },
      ],
    },
    twitter: {
      handle: '@DrJanDuffy',
      site: '@ConsenzaEstates',
      cardType: 'summary_large_image',
    },
    additionalMetaTags: [
      {
        name: 'keywords',
        content: 'luxury real estate, Las Vegas luxury homes, Consenza Estates, Lennar homes, Las Vegas real estate, luxury property specialist, high-end homes, gated community'
      }
    ]
  },
  
  // Calendly (realtor strategy meeting)
  calendly: {
    url: 'https://calendly.com/drjanduffy/realtor_strategy_meeting',
    badgeText: 'Schedule time with me',
    /** Build Calendly URL with UTM for tracking (source=consenzaestates, medium=web, campaign=optional). */
    urlWithUtm(campaign = '') {
      const base = 'https://calendly.com/drjanduffy/realtor_strategy_meeting';
      const params = new URLSearchParams({
        utm_source: 'consenzaestates',
        utm_medium: 'web',
        ...(campaign && { utm_campaign: campaign }),
      });
      return `${base}?${params.toString()}`;
    },
  },

  // Contact information
  contact: {
    email: "DrDuffy@bhhsnv.com",
    phone: "+1 (702) 919-5002",
    address: "7131 Windsor Downs Ave, Las Vegas, NV 89113"
  },

  // FAQ (GBP-aligned Q&As for FAQ schema and page content)
  faq: [
    { question: 'Where is Consenza Estates?', answer: 'Consenza Estates is an exclusive gated community in Las Vegas, Nevada, featuring Lennar new construction homes. The community is in the Summerlin area with easy access to shopping, dining, and outdoor recreation.' },
    { question: 'Who is the best real estate agent for Consenza Estates?', answer: 'Dr. Jan Duffy is the premier specialist for Consenza Estates and Lennar homes in Las Vegas, licensed since 2008 · 35 years in Las Vegas, with CLHMS certification and deep knowledge of Lennar floor plans and the local market.' },
    { question: 'How can I schedule a meeting with Dr. Jan Duffy?', answer: 'You can schedule a strategy meeting anytime via the "Schedule time with me" button on this site, or call (702) 919-5002. Dr. Duffy and her team are available to discuss buying or selling in Consenza Estates.' },
    { question: 'What types of homes are in Consenza Estates?', answer: 'Consenza Estates features Lennar new construction homes with "Everything\'s Included" features, multiple floor plans, and luxury finishes. Dr. Jan Duffy can walk you through available inventory and new releases.' },
    { question: 'Does Dr. Jan Duffy work with buyers and sellers?', answer: 'Yes. Dr. Jan Duffy and her team represent both buyers and sellers in Consenza Estates and the greater Las Vegas area, including new construction representation and luxury home marketing.' }
  ],

  // Team (for About page and schema)
  team: [
    { name: "Dr. Jan Duffy", role: "Lead Listing Specialist", email: "DrDuffy@bhhsnv.com", phone: "(702) 919-5002" },
    { name: "Chance Fuller", role: "Buyer's Agent" },
    { name: "Melissa Schreiber", role: "Transaction Coordinator" }
  ],
  
  // Social media links
  social: {
    instagram: "https://instagram.com/drjanduffy",
    facebook: "https://facebook.com/drjanduffyrealestate",
    twitter: "https://twitter.com/drjanduffy",
    linkedin: "https://linkedin.com/in/drjanduffy",
    youtube: "https://youtube.com/c/drjanduffy"
  },
  
  // Basic settings (from original)
  title: `Dr. Jan Duffy | Premier Luxury Real Estate - Consenza Estates Las Vegas`,
  description: `Experience unparalleled luxury with Dr. Jan Duffy, your elite real estate specialist for prestigious Lennar homes in the exclusive Consenza Estates community of Las Vegas. Discover extraordinary properties with personalized concierge service and unmatched expertise for the most discerning clients.`,
  url: `https://www.consenzaestates.com`, // No trailing slash! Primary domain (www)
  name: `Dr. Jan Duffy Luxury Real Estate`, // The short name of the business or brand name. Used for things like the copyright in the footer.
  enableThemeSwitcher: true,
  showPlug: false, // Disable this if you want to remove the plug from the footer. (╯°□°)╯
};

export default siteSettings;
