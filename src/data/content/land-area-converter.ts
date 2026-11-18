export const landAreaConverterContent = {
  h1: "Land Area Converter",
  intro:
    "Convert agricultural and residential land measurements across Indian and metric units with our free Land Area Converter. Effortlessly calculate square feet, square meters, square yards (gaj), guntha, cent, acre, hectare, ground, kanal, marla, and state-specific bigha to avoid confusion during real estate registry, property purchases, and municipal planning.",
  howToUseSteps: [
    "Enter the numeric land area value you want to convert.",
    "Select your starting unit of measurement (such as Acre, Guntha, Cent, Square Yards/Gaj, or Bigha).",
    "If converting to or from Bigha or Biswa, choose your specific state standard (such as UP Pucca Bigha, West Bengal, Assam, Gujarat Vigha, or MP) or define a custom square footage.",
    "Click Convert / Calculate to instantly view full simultaneous conversions across all national, metric, and regional Indian units.",
    "Review the quick conversion matrix to compare land boundaries and check government revenue survey accuracy.",
  ],
  formula:
    "All land area conversions are normalized through Square Feet (sq ft) as the base denominator. The standard imperial and metric relationships are: 1 Acre = 43,560 sq ft = 4,046.856 m² = 4,840 sq yd (Gaj) = 40 Guntha = 100 Cents. 1 Hectare = 10,000 m² = 107,639.1 sq ft = 2.47105 Acres. 1 Guntha = 121 sq yd = 1,089 sq ft. 1 Cent = 435.6 sq ft = 48.4 sq yd. 1 Ground (Tamil Nadu) = 2,400 sq ft. 1 Kanal (North India) = 5,445 sq ft = 20 Marlas (1 Marla = 272.25 sq ft). For regional Bigha: Standard UP/Bihar Pucca Bigha = 27,225 sq ft (3,025 Gaj); West Bengal & Assam Bigha = 14,400 sq ft (1,600 Gaj = 1/3 Acre); Gujarat Vigha = 17,424 sq ft (4/10 Acre); and 1 Biswa = 1/20 of the respective local Bigha.",
  workedExample: {
    description:
      "A buyer in Maharashtra is purchasing a rural farmland parcel measuring 2.50 Guntha and needs to know the exact dimensions in Square Feet, Square Yards (Gaj), Square Meters, and Cents for documentation and fencing.",
    table: [
      { label: "Input Measurement", value: "2.50 Guntha" },
      { label: "Base Conversion Factor", value: "1 Guntha = 1,089.00 Sq Ft (121 Gaj)" },
      { label: "Total Square Feet", value: "2,722.50 sq ft (2.5 × 1,089)" },
      { label: "Square Yards (Gaj)", value: "302.50 Gaj (2,722.5 / 9)" },
      { label: "Square Meters (m²)", value: "252.93 m² (2,722.5 / 10.7639)" },
      { label: "Acre Equivalent", value: "0.0625 Acres (2,722.5 / 43,560)" },
      { label: "Cent Equivalent", value: "6.25 Cents (2,722.5 / 435.6)" },
      { label: "UP Pucca Bigha Equivalent", value: "0.1000 Bigha (2,722.5 / 27,225)" },
    ],
  },
  quickReferenceTable: {
    title: "Indian Regional Land Measurement Units & Conversion Reference",
    headers: ["Unit Name", "Square Feet (Sq Ft)", "Square Yards (Gaj)", "Square Meters (m²)", "Common Regional Usage"],
    rows: [
      ["1 Guntha", "1,089 sq ft", "121 sq yd", "101.17 m²", "Maharashtra, Karnataka, Gujarat"],
      ["1 Cent", "435.6 sq ft", "48.4 sq yd", "40.47 m²", "Kerala, Tamil Nadu, Andhra Pradesh, Telangana"],
      ["1 Ground", "2,400 sq ft", "266.67 sq yd", "222.97 m²", "Tamil Nadu (especially Chennai urban plots)"],
      ["1 Kanal", "5,445 sq ft", "605 sq yd", "505.86 m²", "Punjab, Haryana, Himachal Pradesh, Jammu & Kashmir"],
      ["1 Marla", "272.25 sq ft", "30.25 sq yd", "25.29 m²", "North India (1/20 of a Kanal)"],
      ["1 Pucca Bigha (UP/Bihar)", "27,225 sq ft", "3,025 sq yd", "2,529.29 m²", "Uttar Pradesh, Bihar, Haryana, Punjab (5/8 Acre)"],
      ["1 Bengal Bigha", "14,400 sq ft", "1,600 sq yd", "1,337.80 m²", "West Bengal, Assam, Tripura (1/3 Acre)"],
      ["1 Gujarat Vigha", "17,424 sq ft", "1,936 sq yd", "1,618.74 m²", "Gujarat (0.40 Acre)"],
      ["1 Acre", "43,560 sq ft", "4,840 sq yd", "4,046.86 m²", "Pan-India standard agricultural measurement"],
      ["1 Hectare", "107,639 sq ft", "11,959.9 sq yd", "10,000.00 m²", "International metric, forest & revenue surveys"],
    ],
  },
  mistakes: [
    "Assuming Bigha is identical throughout India: Bigha has no single national definition. A Pucca Bigha in western Uttar Pradesh is 27,225 sq ft, while a Bigha in West Bengal is only 14,400 sq ft, and local Kachha Bighas can be as small as 6,800 to 9,075 sq ft. Always verify your district's revenue gazette.",
    "Confusing Gaj (Square Yard) with Linear Yard: In Indian real estate parlance, a 'Gaj' refers to one square yard (9 square feet), not a linear measure of 3 feet. Purchasing a 100-gaj plot means buying a 900 sq ft plot.",
    "Rounding off fractional decimal places on high-value urban plots: In metro real estate transactions costing ₹10,000 to ₹50,000 per square foot, rounding off decimals in Guntha or Cent conversions can cause substantial financial discrepancies.",
    "Overlooking road-widening reservations and buffer setbacks: Raw patwari land deeds record total plot boundary area, but legal buildable area requires mandatory municipal road-widening surrenders and front/side setbacks.",
    "Ignoring local Biswa variations when dividing Bigha shares: In regions using the 20-biswa per bigha system, the square footage of 1 Biswa changes proportionally with the underlying local Bigha definition.",
  ],
  faqs: [
    {
      q: "How many square feet are in 1 Acre in India?",
      a: "One standard acre across India equals exactly 43,560 square feet (or 4,840 square yards / Gaj). In the metric system, 1 acre equals approximately 4,046.86 square meters or 0.4047 hectares.",
    },
    {
      q: "What is the difference between a Guntha and a Cent?",
      a: "Both are regional land units: 1 Guntha equals 1,089 square feet (commonly used in Maharashtra, Karnataka, and Gujarat), whereas 1 Cent equals 435.6 square feet (standard in Tamil Nadu, Kerala, and Andhra Pradesh). Exactly 40 Gunthas make up 1 Acre, while 100 Cents make up 1 Acre.",
    },
    {
      q: "Why does the size of a Bigha change from state to state?",
      a: "The Bigha is a traditional pre-metric revenue unit that evolved independently across historical princely states and British zamindari settlements. In Uttar Pradesh and Bihar, a standard Pucca Bigha is 27,225 sq ft (3,025 sq yd), whereas in West Bengal and Assam it was standardized at 14,400 sq ft (1/3 of an acre).",
    },
    {
      q: "What is a Gaj in Indian property terminology?",
      a: "In Indian property transactions, 'Gaj' is the vernacular term for one square yard. One Gaj equals 9 square feet (0.836 square meters). For example, a standard 200-Gaj residential plot has a surface area of 1,800 square feet.",
    },
    {
      q: "How many Gunthas make 1 Hectare?",
      a: "One hectare is 10,000 square meters or 107,639.1 square feet. Since 1 Guntha equals 1,089 square feet, there are approximately 98.84 Gunthas in 1 Hectare (roughly 2.471 Acres).",
    },
    {
      q: "What is 1 Ground of land in Tamil Nadu?",
      a: "In Chennai and across urban Tamil Nadu, residential layouts are traditionally surveyed in 'Grounds'. One Ground equals exactly 2,400 square feet (approx. 222.97 square meters or 5.51 Cents).",
    },
    {
      q: "Which construction planning tools should I use after surveying my land?",
      a: "Once your land boundaries are surveyed, estimate building foundation reinforcement with our <a href=\"/calculator/tmt-steel-weight-calculator\" class=\"text-primary hover:underline font-medium\">TMT Steel Weight Calculator</a>, calculate boundary wall masonry with the <a href=\"/calculator/brick-calculator\" class=\"text-primary hover:underline font-medium\">Brick Calculator</a>, budget structural concrete with the <a href=\"/calculator/cement-bag-calculator\" class=\"text-primary hover:underline font-medium\">Cement Bag Calculator</a>, and evaluate clean rooftop energy using our <a href=\"/calculator/rooftop-solar-calculator\" class=\"text-primary hover:underline font-medium\">Rooftop Solar Calculator</a>.",
    },
  ],
  relatedSlugs: [
    "brick-calculator",
    "tile-calculator",
    "cement-bag-calculator",
    "rooftop-solar-calculator",
  ],
};
