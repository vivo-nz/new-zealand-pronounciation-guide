
let audioInstance: HTMLAudioElement | null = null;

export const playAudio = (audioUrl: string, onPlay?: () => void, onEnd?: () => void): void => {
  // Stop any currently playing audio
  if (audioInstance) {
    audioInstance.pause();
    audioInstance = null;
  }

  // Create and play new audio
  audioInstance = new Audio(audioUrl);
  
  // Set up CORS attributes if needed
  audioInstance.crossOrigin = "anonymous";
  
  if (onPlay) {
    audioInstance.addEventListener('playing', onPlay);
  }
  
  if (onEnd) {
    audioInstance.addEventListener('ended', () => {
      onEnd();
      audioInstance = null;
    });
  }

  // Handle errors
  audioInstance.addEventListener('error', (e) => {
    console.error('Error playing audio:', e);
    console.log('Failed audio URL:', audioUrl);
    if (onEnd) onEnd();
    audioInstance = null;
  });

  // Play the audio with a slight delay to ensure smooth animation
  setTimeout(() => {
    audioInstance?.play().catch(err => {
      console.error('Failed to play audio:', err);
      console.log('Failed audio URL details:', audioUrl);
      if (onEnd) onEnd();
      audioInstance = null;
    });
  }, 50);
};

export const stopAudio = (): void => {
  if (audioInstance) {
    audioInstance.pause();
    audioInstance = null;
  }
};
