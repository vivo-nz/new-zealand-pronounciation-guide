
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
    audioUrl: "https://raw.githubusercontent.com/vivo-nz/pronounciation/main/workspaces/pronounciation/takapuna.mp3",
    description: "Suburb in Auckland, New Zealand, with correct Māori pronunciation"
  }
];
