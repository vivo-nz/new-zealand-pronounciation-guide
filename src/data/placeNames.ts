
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
  }
  // Add more place names here as needed
];
