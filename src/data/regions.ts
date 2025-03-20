
export type Region = {
  id: string;
  name: string;
  description?: string;
}

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
    "Albany", 
    "Albany Oteha Valley Road",
    "Alexandra Park", 
    "Auckland",
    "Birkenhead", 
    "Botany", 
    "Browns Bay", 
    "Chancery",
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
  "bay_of_plenty": ["Bayfair", "Bethlehem", "Maunganui", "Papamoa", "Rotorua", "Taupo", "Taupo City", "Tauranga", "TGA Crossing", "Whakatane"],
  "taranaki": ["Devon", "New Plymouth", "Stratford"],
  "manawatu": ["Kelvin Grove", "Levin", "Palmerston North"],
  "hawkes_bay": ["Havelock North", "Napier"],
  "wellington": ["Lambton Quay", "Lower Hutt", "Petone", "Porirua", "Tory", "Upper Hutt", "Wellington", "Willeston"],
  "nelson": ["Buxton Square", "Nelson", "Richmond"],
  "canterbury": ["Avonhead", "Cashel Street", "Christchurch", "Ferrymead", "Ilam", "Merivale", "Northlands", "Rangiora", "Redwood", "Rolleston"],
  "central_south": ["Alexandra Park", "Dunedin", "George, Dunedin", "Oamaru", "Queenstown", "Remarkables Park"],
  "invercargill": ["Esk", "Invercargill", "Western Heights", "Windsor"]
};
