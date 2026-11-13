export interface CategorySource {
  name: string;
  url: string;
}

export const categorySources: Record<string, CategorySource[]> = {
  finance: [
    {
      name: "Reserve Bank of India (RBI)",
      url: "https://www.rbi.org.in",
    },
    {
      name: "Securities and Exchange Board of India (SEBI)",
      url: "https://www.sebi.gov.in",
    },
  ],
  health: [
    {
      name: "World Health Organization (WHO)",
      url: "https://www.who.int",
    },
    {
      name: "Indian Council of Medical Research (ICMR)",
      url: "https://www.icmr.gov.in",
    },
  ],
  math: [
    {
      name: "Wolfram MathWorld",
      url: "https://mathworld.wolfram.com",
    },
    {
      name: "National Institute of Standards and Technology (NIST)",
      url: "https://www.nist.gov",
    },
  ],
  "salary-and-employment": [
    {
      name: "Ministry of Labour and Employment (India)",
      url: "https://labour.gov.in",
    },
    {
      name: "Income Tax Department of India",
      url: "https://www.incometax.gov.in",
    },
  ],
  jewellery: [
    {
      name: "Bureau of Indian Standards (BIS)",
      url: "https://www.bis.gov.in",
    },
    {
      name: "World Gold Council",
      url: "https://www.gold.org",
    },
  ],
  everyday: [
    {
      name: "National Institute of Standards and Technology (NIST)",
      url: "https://www.nist.gov",
    },
    {
      name: "International Bureau of Weights and Measures (BIPM)",
      url: "https://www.bipm.org",
    },
  ],
  "home-construction": [
    {
      name: "Central Public Works Department (CPWD)",
      url: "https://cpwd.gov.in",
    },
    {
      name: "Bureau of Indian Standards (BIS)",
      url: "https://www.bis.gov.in",
    },
  ],
  electricity: [
    {
      name: "Bureau of Energy Efficiency (BEE)",
      url: "https://beeindia.gov.in",
    },
    {
      name: "Central Electricity Authority (CEA)",
      url: "https://cea.nic.in",
    },
  ],
  business: [
    {
      name: "Goods and Services Tax Network (GSTN)",
      url: "https://www.gst.gov.in",
    },
    {
      name: "Income Tax Department of India",
      url: "https://www.incometax.gov.in",
    },
  ],
  "love-and-relationships": [
    {
      name: "American Psychological Association (APA)",
      url: "https://www.apa.org",
    },
    {
      name: "British Psychological Society (BPS)",
      url: "https://www.bps.org.uk",
    },
  ],
  science: [
    {
      name: "NASA Science Portal",
      url: "https://science.nasa.gov",
    },
    {
      name: "CERN European Organization for Nuclear Research",
      url: "https://home.cern",
    },
  ],
};

export function getCategorySources(categorySlug: string): CategorySource[] {
  return categorySources[categorySlug] || [];
}

