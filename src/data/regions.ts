export type Region = {
  id: string;
  name: string;
  description?: string;
}

export type PlaceType = 'city' | 'store' | 'region';

export type PlaceDetails = {
  type: PlaceType;
};

// Map which defines the type of each place (city, store, or region)
export const placeTypes: Record<string, PlaceDetails> = {
  // Northland
  "Whangarei": { type: 'city' },
  "Kamo": { type: 'store' },
  "Rathbone": { type: 'store' },
  "Strand Mall": { type: 'store' },
  "Northland": { type: 'store' },
  
  // Auckland (cities and stores)
  "Auckland": { type: 'city' },
  "Albany Oteha Valley Road": { type: 'store' },
  "Alexandra Park": { type: 'store' },
  "Birkenhead": { type: 'store' },
  "Botany": { type: 'store' },
  "Browns Bay": { type: 'store' },
  "Chancery": { type: 'store' },
  "Howick": { type: 'store' },
  "Kingsland": { type: 'store' },
  "Manukau": { type: 'store' },
  "Milford": { type: 'store' },
  "Mt Eden": { type: 'store' },
  "Northridge Plaza": { type: 'store' },
  "Orewa": { type: 'store' },
  "Ponsonby on Franklin": { type: 'store' },
  "Pukekohe": { type: 'store' },
  "Remuera": { type: 'store' },
  "Silverdale": { type: 'store' },
  "Smales Farm": { type: 'store' },
  "St Heliers": { type: 'store' },
  "Stoneridge": { type: 'store' },
  "Sylvia Park": { type: 'store' },
  "Takanini": { type: 'store' },
  "Takapuna Anzac": { type: 'store' },
  "Te Atatu": { type: 'store' },
  "The Boundary": { type: 'store' },
  "Western Heights": { type: 'store' },
  "Westgate": { type: 'store' },
  "Grange Warkworth": { type: 'store' },
  
  // Waikato
  "Hamilton": { type: 'city' },
  "Waikato": { type: 'city' },
  "Cambridge": { type: 'store' },
  "Centre Place": { type: 'store' },
  "Chartwell": { type: 'store' },
  "Fifth Ave": { type: 'store' },
  "Te Awamutu": { type: 'store' },
  "Te Rapa": { type: 'store' },
  
  // Bay of Plenty
  "Tauranga": { type: 'city' },
  "Taupo": { type: 'store' },
  "Bayfair": { type: 'store' },
  "Bethlehem": { type: 'store' },
  "Cameron Road": { type: 'store' },
  "Hinemoa - Rotorua": { type: 'store' },
  "Mt Maunganui": { type: 'store' },
  "Papamoa": { type: 'store' },
  "Redwood - Rotorua": { type: 'store' },
  "Tauranga Crossing": { type: 'store' },
  "Whakatane": { type: 'store' },
  
  // Taranaki
  "New Plymouth": { type: 'city' },
  "Devon Street": { type: 'store' },
  "Stratford": { type: 'store' },
  "Taranaki": { type: 'city' },
  
  // Manawatu
  "Palmerston North": { type: 'city' },
  "Whanganui": { type: 'city' },
  "Broadway": { type: 'store' },
  "Kelvin Grove": { type: 'store' },
  "Levin": { type: 'store' },
  "Manawatu": { type: 'store' },
  
  // Hawkes Bay
  "Napier": { type: 'store' },
  "Havelock North": { type: 'store' },
  
  // Wellington
  "Wellington": { type: 'city' },
  "Carterton": { type: 'store' },
  "Howell Road": { type: 'store' },
  "Kapiti Street": { type: 'store' },
  "Lambton Quay": { type: 'store' },
  "Lower Hutt": { type: 'store' },
  "Masterton": { type: 'store' },
  "Petone": { type: 'store' },
  "Porirua": { type: 'store' },
  "Tory Street": { type: 'store' },
  "Upper Hutt": { type: 'store' },
  "Willeston Street": { type: 'store' },
  
  // Nelson
  "Nelson": { type: 'city' },
  "Buxton Square": { type: 'store' },
  "Richmond": { type: 'store' },
  
  // Canterbury
  "Christchurch": { type: 'city' },
  "Avonhead": { type: 'store' },
  "Cashell Square": { type: 'store' },
  "Fanshawe Street": { type: 'store' },
  "Ferrymead": { type: 'store' },
  "Ilam": { type: 'store' },
  "Merivale": { type: 'store' },
  "Northlands": { type: 'store' },
  "Rangiora": { type: 'store' },
  "Rolleston": { type: 'store' },
  
  // Central South
  "George Street Dunedin": { type: 'store' },
  "Queenstown": { type: 'city' },
  "Oamaru": { type: 'store' },
  "George Street": { type: 'store' },
  "Remarkables Park": { type: 'store' },
  
  // Invercargill
  "Invercargill": { type: 'city' },
  "Esk Street": { type: 'store' },
  "Windsor": { type: 'store' }
};

export const regions: Region[] = [
  { id: "northland", name: "NORTHLAND", description: "The northernmost region of New Zealand" },
  { id: "auckland", name: "AUCKLAND", description: "New Zealand's largest city" },
  { id: "waikato", name: "HAMILTON / WAIKATO", description: "Region in the upper North Island" },
  { id: "bay_of_plenty", name: "BAY OF PLENTY", description: "Coastal region in the North Island" },
  { id: "taranaki", name: "NEW PLYMOUTH / TARANAKI", description: "Region on the west coast of North Island" },
  { id: "manawatu", name: "MANAWATU", description: "Lower North Island region" },
  { id: "hawkes_bay", name: "HAWKES BAY", description: "Eastern North Island region" },
  { id: "wellington", name: "WELLINGTON REGION", description: "Capital city and surrounding region" },
  { id: "nelson", name: "NELSON", description: "Top of the South Island" },
  { id: "canterbury", name: "CHRISTCHURCH / CANTERBURY", description: "Largest South Island region" },
  { id: "central_south", name: "CENTRAL SOUTH ISLAND", description: "Central regions of the South Island" },
  { id: "invercargill", name: "INVERCARGILL", description: "Southernmost city and region" }
];

// Map of which places belong to which regions
// This will be used to organize the place name data
export const placeNameRegions: Record<string, string[]> = {
  "northland": ["Kamo", "Whangarei", "Rathbone", "Strand Mall", "Northland"],
  "auckland": [
    "Albany Oteha Valley Road", 
    "Alexandra Park", 
    "Auckland",
    "Birkenhead", 
    "Botany", 
    "Browns Bay", 
    "Chancery",
    "Grange Warkworth", 
    "Howick", 
    "Kingsland", 
    "Manukau", 
    "Milford", 
    "Mt Eden", 
    "Northridge Plaza",
    "Orewa", 
    "Ponsonby on Franklin", 
    "Pukekohe", 
    "Remuera", 
    "Silverdale", 
    "Smales Farm", 
    "St Heliers", 
    "Stoneridge",
    "Sylvia Park", 
    "Takanini", 
    "Takapuna Anzac", 
    "Te Atatu", 
    "The Boundary",
    "Western Heights",
    "Westgate"
  ],
  "waikato": [
    "Cambridge", 
    "Centre Place", 
    "Chartwell", 
    "Fifth Ave", 
    "Hamilton", 
    "Te Awamutu", 
    "Te Rapa", 
    "Waikato"
  ],
  "bay_of_plenty": [
    "Bayfair", 
    "Bethlehem", 
    "Cameron Road",
    "Hinemoa - Rotorua",
    "Mt Maunganui", 
    "Papamoa", 
    "Redwood - Rotorua",
    "Taupo", 
    "Tauranga", 
    "Tauranga Crossing",
    "Whakatane"
  ],
  "taranaki": ["Devon Street", "New Plymouth", "Stratford", "Taranaki"],
  "manawatu": ["Broadway", "Kelvin Grove", "Levin", "Manawatu", "Palmerston North", "Whanganui"],
  "hawkes_bay": ["Havelock North", "Napier"],
  "wellington": [
    "Carterton",
    "Howell Road",
    "Kapiti Street",
    "Lambton Quay", 
    "Levin", 
    "Lower Hutt", 
    "Masterton",
    "Petone", 
    "Porirua", 
    "Tory Street", 
    "Upper Hutt", 
    "Wellington",
    "Willeston Street"
  ],
  "nelson": ["Buxton Square", "Nelson", "Richmond"],
  "canterbury": [
    "Avonhead", 
    "Cashell Square", 
    "Christchurch",
    "Fanshawe Street", 
    "Ferrymead", 
    "Ilam", 
    "Merivale", 
    "Northlands", 
    "Rangiora", 
    "Rolleston"
  ],
  "central_south": ["George Street Dunedin", "George Street", "Oamaru", "Queenstown", "Remarkables Park"],
  "invercargill": ["Esk Street", "Invercargill", "Windsor"]
};
