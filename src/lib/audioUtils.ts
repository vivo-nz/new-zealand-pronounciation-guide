
import { toast } from "@/hooks/use-toast";

let audioInstance: HTMLAudioElement | null = null;

// Helper to check if a URL is from SoundCloud
const isSoundCloudUrl = (url: string): boolean => {
  return url.includes('soundcloud.com');
};

// Function to extract the SoundCloud track ID from a URL
const extractSoundCloudTrackId = (url: string): string | null => {
  // Try to match the URL pattern to extract the track ID or username/track-name
  const match = url.match(/soundcloud\.com\/([^\/]+\/[^\/]+)/);
  return match ? match[1] : null;
};

// Function to handle SoundCloud URLs
const handleSoundCloudUrl = (url: string, onPlay?: () => void, onEnd?: () => void): void => {
  const trackPath = extractSoundCloudTrackId(url);
  
  if (!trackPath) {
    console.error('Could not extract SoundCloud track information from URL:', url);
    toast({
      title: "Audio Error",
      description: "Could not process SoundCloud link. Please try a direct audio file.",
      variant: "destructive",
    });
    if (onEnd) onEnd();
    return;
  }

  // Create an iframe with the SoundCloud embedded player
  const iframeContainer = document.createElement('div');
  iframeContainer.style.position = 'absolute';
  iframeContainer.style.top = '-9999px';
  iframeContainer.style.left = '-9999px';
  
  const iframe = document.createElement('iframe');
  iframe.width = '100%';
  iframe.height = '166';
  iframe.allow = 'autoplay';
  iframe.src = `https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/${trackPath}&color=%23ff5500&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`;
  
  iframeContainer.appendChild(iframe);
  document.body.appendChild(iframeContainer);
  
  // Notify that we're attempting to play
  if (onPlay) onPlay();
  
  // We'll simulate the end event since we can't easily detect when the embedded audio ends
  setTimeout(() => {
    if (onEnd) onEnd();
    // Remove the iframe after playback
    setTimeout(() => {
      document.body.removeChild(iframeContainer);
    }, 500);
  }, 8000); // Assume the audio plays for approximately 8 seconds
  
  // Notify the user that we're playing embedded audio
  toast({
    title: "Playing Audio",
    description: "Playing SoundCloud audio. This is embedded and may take a moment to load.",
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
