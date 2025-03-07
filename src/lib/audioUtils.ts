
import { toast } from "@/hooks/use-toast";

let audioInstance: HTMLAudioElement | null = null;

// Helper to check if a URL is from SoundCloud
const isSoundCloudUrl = (url: string): boolean => {
  return url.includes('soundcloud.com');
};

// Function to handle SoundCloud URLs
const handleSoundCloudUrl = (url: string, onPlay?: () => void, onEnd?: () => void): void => {
  // For SoundCloud links, we need to open them in a new tab as the API requires authentication
  // and embedding isn't straightforward without the SoundCloud API
  window.open(url, '_blank');
  
  // Since we're opening in a new tab, we can't track play/end states
  // so we'll simulate them for the UI
  if (onPlay) onPlay();
  
  // Simulate end after a reasonable time
  setTimeout(() => {
    if (onEnd) onEnd();
  }, 2000);
  
  toast({
    title: "SoundCloud Audio",
    description: "Opening SoundCloud link in a new tab. Please play the audio there.",
    variant: "default",
  });
};

export const playAudio = (audioUrl: string, onPlay?: () => void, onEnd?: () => void): void => {
  // Check if it's a SoundCloud URL
  if (isSoundCloudUrl(audioUrl)) {
    handleSoundCloudUrl(audioUrl, onPlay, onEnd);
    return;
  }

  // Stop any currently playing audio
  if (audioInstance) {
    audioInstance.pause();
    audioInstance = null;
  }

  // Create and play new audio
  audioInstance = new Audio(audioUrl);
  
  // Set up CORS attributes
  audioInstance.crossOrigin = "anonymous";
  
  // Add a console log to debug the audio URL
  console.log("Attempting to play audio from:", audioUrl);
  
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
          errorMessage = "Network error occurred while loading audio. Check your internet connection.";
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = "Audio format not supported or corrupted. Try a different audio format like .mp3 or .ogg.";
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = "Audio format not supported by your browser. Try using .mp3 instead of .ogg or vice versa.";
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
        description: "Could not play pronunciation audio. Try using a standard format like MP3 or OGG hosted on a reliable server.",
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
