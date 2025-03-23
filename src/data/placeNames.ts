
import { placeTypes, placeNameRegions, regions } from './regions';

export type PlaceName = {
  id: string;
  name: string;
  audioUrl: string;
  description: string;
};

export const placeNames: PlaceName[] = [
  {
    id: "42",
    name: "Mt Maunganui",
    audioUrl: "https://raw.githubusercontent.com/vivo-nz/new-zealand-pronounciation-guide/main/maunganui-audio.mp3",
    description: "Coastal suburb of Tauranga"
  },
  // Add all other places from placeTypes object, excluding Mt Maunganui which is already defined
  ...Object.keys(placeTypes)
    .filter(name => name !== "Mt Maunganui")
    .map((name, index) => ({
      id: (index + 100).toString(),
      name,
      audioUrl: "",
      description: getPlaceDescription(name)
    }))
];

function getPlaceDescription(placeName: string): string {
  const placeDetail = placeTypes[placeName];
  
  if (!placeDetail) return "";
  
  if (placeDetail.type === 'city') {
    return `City in New Zealand`;
  } else if (placeDetail.type === 'region') {
    return `Region in New Zealand`;
  } else {
    // Special case modifications for Hawkes Bay region
    if (placeName === "Napier" || placeName === "Havelock North") {
      return "Salon in Hawkes Bay";
    }

    // Special cases for specific salons
    if (placeName === "Broadway") {
      return "Salon in Palmerston North";
    }
    if (placeName === "Kelvin Grove") {
      return "Salon in Palmerston North";
    }
    if (placeName === "Levin") {
      return "Salon in Levin";
    }
    if (placeName === "Whanganui") {
      return "Salon in Whanganui";
    }
    if (placeName === "Albany Oteha Valley Road") {
      return "Salon in Auckland, North Shore";
    }
    // Adding special cases for North Shore salons
    if (placeName === "Birkenhead") {
      return "Salon in Auckland, North Shore";
    }
    if (placeName === "Browns Bay") {
      return "Salon in Auckland, North Shore";
    }
    if (placeName === "Milford") {
      return "Salon in Auckland, North Shore";
    }
    if (placeName === "Albany Northridge Plaza") {
      return "Salon in Auckland, North Shore";
    }
    if (placeName === "Silverdale") {
      return "Salon in Auckland, North Shore";
    }
    if (placeName === "Smales Farm") {
      return "Salon in Auckland, North Shore";
    }
    if (placeName === "Takapuna") {
      return "Salon in Auckland, North Shore";
    }
    // Adding special cases for West Auckland salons
    if (placeName === "Westgate") {
      return "Salon in West Auckland";
    }
    if (placeName === "Western Heights") {
      return "Salon in West Auckland";
    }
    if (placeName === "The Boundary") {
      return "Salon in West Auckland";
    }
    if (placeName === "Te Atatu") {
      return "Salon in West Auckland";
    }
    // Adding special cases for East Auckland salons
    if (placeName === "Sylvia Park") {
      return "Salon in East Auckland";
    }
    if (placeName === "Botany") {
      return "Salon in East Auckland";
    }
    if (placeName === "Howick") {
      return "Salon in East Auckland";
    }
    // Adding special cases for South Auckland salons
    if (placeName === "Takanini") {
      return "Salon in South Auckland";
    }
    if (placeName === "Pukekohe") {
      return "Salon in South Auckland";
    }
    if (placeName === "Manukau") {
      return "Salon in South Auckland";
    }
    // Special case for Devon Street salon
    if (placeName === "Devon Street") {
      return "Salon in New Plymouth Central City";
    }
    // Special case for Stratford salon
    if (placeName === "Stratford") {
      return "Salon in small township in New Plymouth";
    }
    
    // For other stores, find which region they belong to
    for (const [regionId, places] of Object.entries(placeNameRegions)) {
      if (places.includes(placeName)) {
        const region = regions.find(r => r.id === regionId);
        
        // Special case for Nelson region
        if (regionId === "nelson") {
          return "Salon in Nelson";
        }
        
        // Special case for Wellington region
        if (regionId === "wellington") {
          return "Salon in Wellington";
        }
        
        return region ? `Salon in ${region.name}` : 'Salon in New Zealand';
      }
    }
    return 'Salon in New Zealand';
  }
}
