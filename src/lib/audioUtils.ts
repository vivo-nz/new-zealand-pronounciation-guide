
import { toast } from "@/hooks/use-toast";

let audioInstance: HTMLAudioElement | null = null;

// Helper to check if a URL is from SoundCloud
const isSoundCloudUrl = (url: string): boolean => {
  return url.includes('soundcloud.com');
};

// Helper to check if a URL is local (starting with '/')
const isLocalUrl = (url: string): boolean => {
  return url.startsWith('/');
};

// Helper to check if a URL is from Google Drive
const isGoogleDriveUrl = (url: string): boolean => {
  return url.includes('drive.google.com');
};

// Function to convert Google Drive sharing URL to direct download URL
const getGoogleDriveDirectUrl = (url: string): string => {
  // Extract the file ID from the Google Drive URL
  let fileId = '';
  
  // Pattern for links like https://drive.google.com/file/d/{fileId}/view
  const filePattern = /\/file\/d\/([^\/]+)/;
  const fileMatch = url.match(filePattern);
  
  if (fileMatch && fileMatch[1]) {
    fileId = fileMatch[1];
  } else {
    // Pattern for links like https://drive.google.com/open?id={fileId}
    const openPattern = /[?&]id=([^&]+)/;
    const openMatch = url.match(openPattern);
    
    if (openMatch && openMatch[1]) {
      fileId = openMatch[1];
    }
  }
  
  if (!fileId) {
    console.error('Could not extract file ID from Google Drive URL:', url);
    return url; // Return original if we can't extract ID
  }
  
  // Convert to direct download URL
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

// Helper to add CORS proxy for external resources if needed
const addCorsProxyIfNeeded = (url: string): string => {
  // Skip for local URLs
  if (isLocalUrl(url)) {
    return url;
  }
  
  // Skip for URLs already using a proxy
  if (url.includes('cors-anywhere') || url.includes('corsproxy')) {
    return url;
  }
  
  // For external URLs, consider using a CORS proxy
  // Only do this for specific domains that we know have CORS issues
  const problematicDomains = [
    'upload.wikimedia.org',
    'commons.wikimedia.org'
  ];
  
  const needsProxy = problematicDomains.some(domain => url.includes(domain));
  
  if (needsProxy) {
    // Use a public CORS proxy (note: for production, you should use your own proxy)
    return `https://corsproxy.io/?${encodeURIComponent(url)}`;
  }
  
  return url;
};

// Function to handle SoundCloud URLs
const handleSoundCloudUrl = (url: string, onPlay?: () => void, onEnd?: () => void): void => {
  // Try to match the URL pattern to extract the track ID or username/track-name
  const trackPath = url.match(/soundcloud\.com\/([^\/]+\/[^\/]+)/)?.[1];
  
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

  // We need to use window.open as SoundCloud's embedded iframe has security restrictions
  // that prevent autoplay in many browsers without user interaction
  window.open(url, '_blank');
  
  // Since we're opening in a new tab, we need to notify the user
  toast({
    title: "SoundCloud Audio",
    description: "SoundCloud audio opened in a new tab. Please play it there for the best experience.",
    variant: "default",
  });
  
  // Simulate playback for UI purposes
  if (onPlay) onPlay();
  
  // Simulate end after a reasonable time for UI to return to normal
  setTimeout(() => {
    if (onEnd) onEnd();
  }, 5000);
};

export const playAudio = (audioUrl: string, onPlay?: () => void, onEnd?: () => void): void => {
  // Check if it's a SoundCloud URL
  if (isSoundCloudUrl(audioUrl)) {
    handleSoundCloudUrl(audioUrl, onPlay, onEnd);
    return;
  }

  // If it's a Google Drive URL, convert to direct URL
  if (isGoogleDriveUrl(audioUrl)) {
    audioUrl = getGoogleDriveDirectUrl(audioUrl);
    console.log("Converted Google Drive URL to:", audioUrl);
  }
  
  // Apply CORS proxy if needed
  audioUrl = addCorsProxyIfNeeded(audioUrl);
  
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
