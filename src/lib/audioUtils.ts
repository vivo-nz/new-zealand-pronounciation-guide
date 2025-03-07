
import { toast } from "@/hooks/use-toast";

let audioInstance: HTMLAudioElement | null = null;

// Helper to check if a URL is from SoundCloud
const isSoundCloudUrl = (url: string): boolean => {
  return url.includes('soundcloud.com');
};

// Helper to check if a URL is from GitHub
const isGitHubUrl = (url: string): boolean => {
  return url.includes('github');
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

// Function to ensure GitHub raw URLs are correctly formatted
const getGitHubRawUrl = (url: string): string => {
  console.log("Processing GitHub URL:", url);
  
  // If it's already properly formatted as a raw GitHub URL without any special patterns
  if (url.startsWith('https://raw.githubusercontent.com/') && 
      !url.includes('/raw/') && 
      !url.includes('/blob/') && 
      !url.includes('/tree/')) {
    console.log("URL is already a proper raw GitHub URL");
    return url;
  }
  
  // Handle URLs with /raw/ in them
  if (url.includes('/raw/')) {
    const newUrl = url
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/raw/', '/');
    console.log("Converted /raw/ URL to:", newUrl);
    return newUrl;
  }
  
  // Handle standard GitHub URLs
  const githubPattern = /github\.com\/([^\/]+)\/([^\/]+)(\/tree\/|\/blob\/|\/)?([^\/]+)?\/?(.*)?/;
  const match = url.match(githubPattern);
  
  if (match) {
    const user = match[1];
    const repo = match[2];
    const branch = match[4] || 'main';
    const path = match[5] || '';
    
    const newUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${path}`;
    console.log("Converted standard GitHub URL to:", newUrl);
    return newUrl;
  }
  
  console.log("No conversion needed or pattern not recognized, returning original URL");
  return url;
};

export const playAudio = (audioUrl: string, onPlay?: () => void, onEnd?: () => void): void => {
  console.log("Original audio URL:", audioUrl);

  // Check if it's a SoundCloud URL
  if (isSoundCloudUrl(audioUrl)) {
    handleSoundCloudUrl(audioUrl, onPlay, onEnd);
    return;
  }

  // If it's a GitHub URL, ensure it's properly formatted
  if (isGitHubUrl(audioUrl)) {
    audioUrl = getGitHubRawUrl(audioUrl);
    console.log("Processed GitHub URL to:", audioUrl);
  }

  // If it's a Google Drive URL, convert to direct URL
  if (isGoogleDriveUrl(audioUrl)) {
    audioUrl = getGoogleDriveDirectUrl(audioUrl);
    console.log("Converted Google Drive URL to:", audioUrl);
  }
  
  // Add a cache buster to avoid caching issues
  audioUrl = audioUrl + (audioUrl.includes('?') ? '&' : '?') + 'cb=' + new Date().getTime();
  console.log("Final audio URL with cache buster:", audioUrl);
  
  // Stop any currently playing audio
  if (audioInstance) {
    audioInstance.pause();
    audioInstance = null;
  }

  // Create and play new audio
  audioInstance = new Audio(audioUrl);
  
  // Log the audio URL being used
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
          errorMessage = "Audio format not supported by your browser. The audio file might be corrupted or in an unsupported format.";
          break;
      }
    }
    
    // Show toast notification with shadcn/ui
    toast({
      title: "Audio Error",
      description: errorMessage + " Please try a different audio file or format.",
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
        description: "Could not play pronunciation audio. The audio file might be unavailable or in an unsupported format.",
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
