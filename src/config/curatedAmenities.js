/**
 * Verified nearby places for static HTML, fallback map list, and ItemList schema.
 * Each entry includes sourceUrl (official page used to verify name and address).
 */
export const curatedAmenities = [
  {
    id: 'mountains-edge-park',
    name: "Mountain's Edge Regional Park",
    category: 'parks',
    schemaType: 'Park',
    address: '8101 W Mountains Edge Pkwy, Las Vegas, NV 89178',
    sourceUrl: 'https://parkslocator.clarkcountynv.gov/Search/ParkDetail?parkId=104',
  },
  {
    id: 'exploration-peak',
    name: 'Exploration Peak Park',
    category: 'parks',
    schemaType: 'Park',
    address: '9700 S Buffalo Dr, Las Vegas, NV 89178',
    sourceUrl: 'https://parkslocator.clarkcountynv.gov/Search/ParkDetail?parkId=62',
  },
  {
    id: 'albertsons-blue-diamond',
    name: 'Albertsons',
    category: 'grocery',
    schemaType: 'GroceryStore',
    address: '4800 Blue Diamond Rd, Las Vegas, NV 89139',
    sourceUrl: 'https://local.albertsons.com/nv/las-vegas/4800-blue-diamond-rd.html',
  },
  {
    id: 'smiths-charleston',
    name: "Smith's Food and Drug",
    category: 'grocery',
    schemaType: 'GroceryStore',
    address: '9851 W Charleston Blvd, Las Vegas, NV 89117',
    sourceUrl: 'https://www.smithsfoodanddrug.com/stores/grocery/nv/las-vegas/w-charleston-blvd/706/00347',
  },
  {
    id: 'southern-hills-hospital',
    name: 'Southern Hills Hospital and Medical Center',
    category: 'healthcare',
    schemaType: 'Hospital',
    address: '9300 W Sunset Rd, Las Vegas, NV 89148',
    sourceUrl: 'https://www.sunrisehealthinfo.com/locations/southern-hills-hospital',
  },
  {
    id: 'red-rock-canyon',
    name: 'Red Rock Canyon National Conservation Area',
    category: 'parks',
    schemaType: 'Park',
    address: '1000 Scenic Loop Dr, Las Vegas, NV 89161',
    sourceUrl: 'https://www.nps.gov/redr/planyourvisit/basicinfo.htm',
  },
];

export default curatedAmenities;
