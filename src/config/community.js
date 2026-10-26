/**
 * Consenza Estates — single source for map center and community identity.
 * Center coordinates approximate the Lennar sales center / community hub at
 * 7131 Windsor Downs Ave, Las Vegas, NV 89113 (official Lennar community address).
 */
export const community = {
  name: 'Consenza Estates',
  shortName: 'Consenza',
  city: 'Las Vegas',
  state: 'NV',
  stateCode: 'NV',
  postalCode: '89113',
  salesCenterAddress: '7131 Windsor Downs Ave, Las Vegas, NV 89113',
  /** Map center (Lennar sales center address, geocoded ~2026-03) */
  center: {
    lat: 36.045059,
    lng: -115.269722,
  },
  defaultZoom: 14,
  searchRadiusMeters: 8000,
};

/**
 * Category chips for the amenity map (schools category uses CCSD zoning — verify before you buy).
 * `placeTypes` are Google Places (New) primary types for searchNearby.
 */
export const amenityCategories = [
  { id: 'grocery', label: 'Grocery', placeTypes: ['grocery_store', 'supermarket'] },
  { id: 'parks', label: 'Parks', placeTypes: ['park'] },
  { id: 'restaurants', label: 'Restaurants', placeTypes: ['restaurant'] },
  { id: 'cafes', label: 'Cafes', placeTypes: ['cafe', 'coffee_shop'] },
  { id: 'healthcare', label: 'Healthcare', placeTypes: ['hospital', 'doctor'] },
  { id: 'pharmacies', label: 'Pharmacies', placeTypes: ['pharmacy'] },
  { id: 'shopping', label: 'Shopping', placeTypes: ['shopping_mall', 'department_store'] },
  { id: 'fitness', label: 'Fitness', placeTypes: ['gym'] },
  { id: 'golf', label: 'Golf', placeTypes: ['golf_course'] },
  { id: 'parking', label: 'Parking', placeTypes: ['parking'] },
  { id: 'schools', label: 'Schools', placeTypes: ['school', 'primary_school', 'secondary_school'] },
];

export default community;
