
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
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b9/En-uk-Edinburgh.ogg",
    description: "Capital city of Scotland, pronounced 'ED-in-burr-uh', not 'ED-in-burg'"
  },
  {
    id: "2",
    name: "Glasgow",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c9/En-uk-Glasgow.ogg",
    description: "Largest city in Scotland, pronounced 'GLAZ-go', not 'GLAS-gow'"
  },
  {
    id: "3",
    name: "Leicester",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1c/En-uk-Leicester.ogg",
    description: "City in England, pronounced 'LES-ter', not 'LIE-ses-ter'"
  },
  {
    id: "4",
    name: "Worcester",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8a/En-Worcester.ogg",
    description: "City in England, pronounced 'WUS-ter', not 'WOR-ces-ter'"
  },
  {
    id: "5",
    name: "Thames",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/En-uk-River_Thames.ogg",
    description: "River in England, pronounced 'TEMZ', not 'THAYMZ'"
  },
  {
    id: "6",
    name: "Gloucester",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6a/En-uk-Gloucester.ogg",
    description: "City in England, pronounced 'GLOS-ter', not 'GLOW-ses-ter'"
  },
  {
    id: "7",
    name: "Loughborough",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/81/En-uk-Loughborough.ogg",
    description: "Town in England, pronounced 'LUFF-burr-uh', not 'LOG-bor-row'"
  },
  {
    id: "8",
    name: "Bournemouth",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c3/LL-Q1860_%28eng%29-Vealhurl-Bournemouth.wav",
    description: "Town in England, pronounced 'BORN-muth', not 'BORN-mouth'"
  }
];
