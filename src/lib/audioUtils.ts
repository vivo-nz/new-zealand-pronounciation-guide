
import { toast } from "@/hooks/use-toast";

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
    const error = audioInstance?.error;
    console.error('Error playing audio:', e);
    console.log('Failed audio URL:', audioUrl);
    console.log('Audio error details:', error?.message || 'Unknown error');
    
    // Show toast notification with shadcn/ui
    toast({
      title: "Audio Error",
      description: `Could not play audio: ${error?.message || 'Format not supported'}`,
      variant: "destructive",
    });
    
    if (onEnd) onEnd();
    audioInstance = null;
  });

  // Play the audio with a slight delay to ensure smooth animation
  setTimeout(() => {
    audioInstance?.play().catch(err => {
      console.error('Failed to play audio:', err);
      console.log('Failed audio URL details:', audioUrl);
      
      // Show toast notification with shadcn/ui
      toast({
        title: "Audio Error",
        description: "Could not play pronunciation audio. The format may not be supported.",
        variant: "destructive",
      });
      
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
