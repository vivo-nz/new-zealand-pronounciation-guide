
export interface PlaceName {
  id: string;
  name: string;
  audioUrl: string;
  description?: string;
}

export const placeNames: PlaceName[] = [
  {
    id: "1",
    name: "Takapuna",
    audioUrl: "https://raw.githubusercontent.com/vivo-nz/workspaces/pronounciation/takapuna.mp3",
    description: "Suburb in Auckland, New Zealand, with correct Māori pronunciation"
  },
  {
    id: "2",
    name: "Oamaru",
    audioUrl: "https://github.com/vivo-nz/pronounciation/raw/refs/heads/main/oamaru.mp3",
    description: "Coastal town in North Otago, New Zealand, with correct Māori pronunciation"
  }
];
