
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

  // Handle errors with detailed logging
  audioInstance.addEventListener('error', (e) => {
    const error = audioInstance?.error;
    console.error('Error playing audio:', e);
    console.log('Failed audio URL:', audioUrl);
    console.log('Audio error code:', error?.code);
    console.log('Audio error message:', error?.message);
    
    let errorMessage = "Could not play pronunciation audio.";
    
    // Provide more specific error messages based on the error code
    if (error) {
      switch(error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = "Audio playback was aborted.";
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = "Network error occurred while loading audio.";
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = "Audio format not supported or corrupted.";
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = "Audio format not supported by your browser.";
          break;
      }
    }
    
    // Show toast notification with shadcn/ui
    toast({
      title: "Audio Error",
      description: errorMessage,
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
        description: "Could not play pronunciation audio. Please check the audio format.",
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
