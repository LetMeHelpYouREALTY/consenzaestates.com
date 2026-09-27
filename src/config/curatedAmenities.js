/**
 * Verified nearby places for static HTML, fallback map list, and ItemList schema.
 * Only include businesses/locations with a verifiable street address.
 */
export const curatedAmenities = [
  {
    id: 'mountains-edge-park',
    name: "Mountain's Edge Regional Park",
    category: 'parks',
    schemaType: 'Park',
    address: '8101 S Buffalo Dr, Las Vegas, NV 89113',
  },
  {
    id: 'exploration-peak',
    name: 'Exploration Peak Park',
    category: 'parks',
    schemaType: 'Park',
    address: '9600 Exploration Peak Dr, Las Vegas, NV 89178',
  },
  {
    id: 'smiths-durango',
    name: "Smith's Food and Drug",
    category: 'grocery',
    schemaType: 'GroceryStore',
    address: '7050 S Durango Dr, Las Vegas, NV 89113',
  },
  {
    id: 'albertsons-sunset',
    name: 'Albertsons',
    category: 'grocery',
    schemaType: 'GroceryStore',
    address: '9260 W Sunset Rd, Las Vegas, NV 89148',
  },
  {
    id: 'southern-hills-hospital',
    name: 'Southern Hills Hospital and Medical Center',
    category: 'healthcare',
    schemaType: 'Hospital',
    address: '9300 W Sunset Rd, Las Vegas, NV 89148',
  },
  {
    id: 'cortney-elementary',
    name: 'Cortney Elementary School',
    category: 'schools',
    schemaType: 'School',
    address: '9899 Balsam Elm Ct, Las Vegas, NV 89148',
  },
  {
    id: 'becker-middle',
    name: 'Becker Middle School',
    category: 'schools',
    schemaType: 'School',
    address: '9600 Marilyn Ave, Las Vegas, NV 89148',
  },
  {
    id: 'palo-verde-high',
    name: 'Palo Verde High School',
    category: 'schools',
    schemaType: 'School',
    address: '333 S Pavilion Center Dr, Las Vegas, NV 89144',
  },
  {
    id: 'faith-lutheran',
    name: 'Faith Lutheran Middle & High School',
    category: 'schools',
    schemaType: 'School',
    address: '9700 W Hillpointe Rd, Las Vegas, NV 89148',
  },
  {
    id: 'walmart-blue-diamond',
    name: 'Walmart Supercenter',
    category: 'shopping',
    schemaType: 'Store',
    address: '360 N Pueblo Blvd, Henderson, NV 89015',
  },
  {
    id: 'red-rock-canyon',
    name: 'Red Rock Canyon National Conservation Area',
    category: 'parks',
    schemaType: 'Park',
    address: '1000 Scenic Loop Dr, Las Vegas, NV 89161',
  },
];

export default curatedAmenities;
