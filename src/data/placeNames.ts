
export interface PlaceName {
  id: string;
  name: string;
  audioUrl: string;
  description?: string;
}

export const placeNames: PlaceName[] = [
  {
    id: "1",
    name: "Edinburgh",
    audioUrl: "https://raw.githubusercontent.com/marcopolo39/place-name-audio/main/edinburgh.mp3",
    description: "Capital city of Scotland, pronounced 'ED-in-burr-uh', not 'ED-in-burg'"
  },
  {
    id: "2",
    name: "Glasgow",
    audioUrl: "https://raw.githubusercontent.com/marcopolo39/place-name-audio/main/glasgow.mp3",
    description: "Largest city in Scotland, pronounced 'GLAZ-go', not 'GLAS-gow'"
  },
  {
    id: "3",
    name: "Leicester",
    audioUrl: "https://raw.githubusercontent.com/marcopolo39/place-name-audio/main/leicester.mp3",
    description: "City in England, pronounced 'LES-ter', not 'LIE-ses-ter'"
  },
  {
    id: "4",
    name: "Worcester",
    audioUrl: "https://raw.githubusercontent.com/marcopolo39/place-name-audio/main/worcester.mp3",
    description: "City in England, pronounced 'WUS-ter', not 'WOR-ces-ter'"
  },
  {
    id: "5",
    name: "Thames",
    audioUrl: "https://raw.githubusercontent.com/marcopolo39/place-name-audio/main/thames.mp3",
    description: "River in England, pronounced 'TEMZ', not 'THAYMZ'"
  },
  {
    id: "6",
    name: "Gloucester",
    audioUrl: "https://raw.githubusercontent.com/marcopolo39/place-name-audio/main/gloucester.mp3",
    description: "City in England, pronounced 'GLOS-ter', not 'GLOW-ses-ter'"
  },
  {
    id: "7",
    name: "Loughborough",
    audioUrl: "https://raw.githubusercontent.com/marcopolo39/place-name-audio/main/loughborough.mp3",
    description: "Town in England, pronounced 'LUFF-burr-uh', not 'LOG-bor-row'"
  },
  {
    id: "8",
    name: "Bournemouth",
    audioUrl: "https://raw.githubusercontent.com/marcopolo39/place-name-audio/main/bournemouth.mp3",
    description: "Town in England, pronounced 'BORN-muth', not 'BORN-mouth'"
  },
  {
    id: "9",
    name: "Takapuna",
    audioUrl: "https://raw.githubusercontent.com/vivo-nz/pronounciation/main/workspaces/pronounciation/takapuna.mp3",
    description: "Suburb in Auckland, New Zealand, with correct Māori pronunciation"
  }
];
