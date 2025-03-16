
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
    audioUrl: "https://github.com/vivo-nz/pronounciation/raw/20040701_energetic-upbeat-pop_by_stocksounds_preview.mp3",
    description: "Suburb in Auckland, New Zealand, with correct Māori pronunciation"
  },
  {
    id: "2",
    name: "Oamaru",
    audioUrl: "https://assets.coderrocketfuel.com/welcome-to-pomodoro.mp3",
    description: "Coastal town in North Otago, New Zealand, with correct Māori pronunciation"
  }
];
