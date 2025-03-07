
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
    audioUrl: "https://media.merriam-webster.com/audio/prons/en/us/mp3/e/edinbu02.mp3",
    description: "Capital city of Scotland, pronounced 'ED-in-burr-uh', not 'ED-in-burg'"
  },
  {
    id: "2",
    name: "Glasgow",
    audioUrl: "https://media.merriam-webster.com/audio/prons/en/us/mp3/g/glasgo01.mp3",
    description: "Largest city in Scotland, pronounced 'GLAZ-go', not 'GLAS-gow'"
  },
  {
    id: "3",
    name: "Leicester",
    audioUrl: "https://media.merriam-webster.com/audio/prons/en/us/mp3/l/leices02.mp3",
    description: "City in England, pronounced 'LES-ter', not 'LIE-ses-ter'"
  },
  {
    id: "4",
    name: "Worcester",
    audioUrl: "https://media.merriam-webster.com/audio/prons/en/us/mp3/w/worces01.mp3",
    description: "City in England, pronounced 'WUS-ter', not 'WOR-ces-ter'"
  },
  {
    id: "5",
    name: "Thames",
    audioUrl: "https://media.merriam-webster.com/audio/prons/en/us/mp3/t/thames01.mp3",
    description: "River in England, pronounced 'TEMZ', not 'THAYMZ'"
  },
  {
    id: "6",
    name: "Gloucester",
    audioUrl: "https://media.merriam-webster.com/audio/prons/en/us/mp3/g/glouce01.mp3",
    description: "City in England, pronounced 'GLOS-ter', not 'GLOW-ses-ter'"
  },
  {
    id: "7",
    name: "Loughborough",
    audioUrl: "https://media.merriam-webster.com/audio/prons/en/us/mp3/l/loughb01.mp3",
    description: "Town in England, pronounced 'LUFF-burr-uh', not 'LOG-bor-row'"
  },
  {
    id: "8",
    name: "Bournemouth",
    audioUrl: "https://media.merriam-webster.com/audio/prons/en/us/mp3/b/bourne03.mp3",
    description: "Town in England, pronounced 'BORN-muth', not 'BORN-mouth'"
  },
  {
    id: "9",
    name: "Takapuna",
    audioUrl: "https://media.merriam-webster.com/audio/prons/en/us/mp3/t/takap001.mp3",
    description: "Suburb in Auckland, New Zealand, with correct Māori pronunciation"
  }
];
