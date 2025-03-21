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
const handleSoundCloudUrl = (url: string, onPlay?: () => void, onEnd?: () => void, onError?: (error: any) => void): void => {
  // Try to match the URL pattern to extract the track ID or username/track-name
  const trackPath = url.match(/soundcloud\.com\/([^\/]+\/[^\/]+)/)?.[1];
  
  if (!trackPath) {
    console.error('Could not extract SoundCloud track information from URL:', url);
    if (onError) onError(new Error('Could not process SoundCloud link'));
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
  
  // If already a raw URL, return it
  if (url.includes('raw.githubusercontent.com')) {
    console.log("URL is already a raw.githubusercontent.com URL");
    return url;
  }
  
  // Always convert GitHub URLs to raw.githubusercontent.com format for direct access
  if (url.includes('github.com')) {
    // Handle URLs with raw in the path, typical format: github.com/user/repo/raw/branch/path
    if (url.includes('/raw/')) {
      const rawPattern = /github\.com\/([^\/]+)\/([^\/]+)\/raw\/([^\/]+)\/(.*)/;
      const match = url.match(rawPattern);
      
      if (match) {
        const user = match[1];
        const repo = match[2];
        const branch = match[3];
        const path = match[4];
        
        const newUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${path}`;
        console.log("Converted GitHub /raw/ URL to raw.githubusercontent.com:", newUrl);
        return newUrl;
      }
    }
    
    // Handle standard GitHub blob URLs
    if (url.includes('/blob/')) {
      const blobPattern = /github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.*)/;
      const match = url.match(blobPattern);
      
      if (match) {
        const user = match[1];
        const repo = match[2];
        const branch = match[3];
        const path = match[4];
        
        // Decode URL encoded characters (like spaces) in the path
        const decodedPath = decodeURIComponent(path);
        
        const newUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${decodedPath}`;
        console.log("Converted GitHub /blob/ URL to raw.githubusercontent.com:", newUrl);
        return newUrl;
      }
    }
    
    // General case for other GitHub URLs
    const githubPattern = /github\.com\/([^\/]+)\/([^\/]+)(?:\/tree\/|\/)?([^\/]+)?\/?(.*)?/;
    const match = url.match(githubPattern);
    
    if (match) {
      const user = match[1];
      const repo = match[2];
      const branch = match[3] || 'main';
      const path = match[4] || '';
      
      // Decode URL encoded characters in the path
      const decodedPath = decodeURIComponent(path);
      
      const newUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${decodedPath}`;
      console.log("Converted GitHub URL to raw.githubusercontent.com:", newUrl);
      return newUrl;
    }
  }
  
  console.log("No conversion needed or pattern not recognized, returning original URL");
  return url;
};

// Fix audio URLs containing parentheses or spaces
const fixSpecialCharactersInUrl = (url: string): string => {
  // First decode the URL to handle any already encoded parts
  let decodedUrl = decodeURIComponent(url);
  
  // Then encode parentheses and spaces properly
  return decodedUrl
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/ /g, '%20');
};

export const playAudio = (
  audioUrl: string, 
  onPlay?: () => void, 
  onEnd?: () => void,
  onError?: (error: any) => void
): void => {
  console.log("Original audio URL:", audioUrl);

  // Check if it's a SoundCloud URL
  if (isSoundCloudUrl(audioUrl)) {
    handleSoundCloudUrl(audioUrl, onPlay, onEnd, onError);
    return;
  }

  // If it's a GitHub URL, ensure it's properly formatted for direct access
  let processedUrl = audioUrl;
  if (isGitHubUrl(audioUrl)) {
    processedUrl = getGitHubRawUrl(audioUrl);
    console.log("Processed GitHub URL to:", processedUrl);
  }

  // Fix special characters in the URL
  processedUrl = fixSpecialCharactersInUrl(processedUrl);
  console.log("URL after fixing special characters:", processedUrl);

  // If it's a Google Drive URL, convert to direct URL
  if (isGoogleDriveUrl(processedUrl)) {
    processedUrl = getGoogleDriveDirectUrl(processedUrl);
    console.log("Converted Google Drive URL to:", processedUrl);
  }
  
  // Add a cache buster to avoid caching issues
  processedUrl = processedUrl + (processedUrl.includes('?') ? '&' : '?') + 'cb=' + new Date().getTime();
  console.log("Final audio URL with cache buster:", processedUrl);
  
  // Stop any currently playing audio
  if (audioInstance) {
    audioInstance.pause();
    audioInstance = null;
  }

  // Create and play new audio
  audioInstance = new Audio(processedUrl);
  audioInstance.crossOrigin = "anonymous"; // Handle CORS issues
  
  // Log the audio URL being used
  console.log("Attempting to play audio from:", processedUrl);
  
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
    console.log('Failed audio URL:', processedUrl);
    console.log('Audio error code:', error?.code);
    console.log('Audio error message:', error?.message);
    
    // Invoke onError callback if provided
    if (onError) {
      onError(error || new Error('Unknown audio error'));
    } else {
      // Otherwise show toast notification with shadcn/ui
      toast({
        title: "Audio Error",
        description: "Could not play pronunciation audio. The audio file might be unavailable or in an unsupported format.",
        variant: "destructive",
      });
    }
    
    if (onEnd) onEnd();
    audioInstance = null;
  });

  // Play the audio with a slight delay to ensure smooth animation
  setTimeout(() => {
    if (!audioInstance) return;
    
    audioInstance.play().catch(err => {
      console.error('Failed to play audio:', err);
      console.log('Failed audio URL details:', processedUrl);
      
      // Invoke onError callback if provided
      if (onError) {
        onError(err);
      } else {
        // Otherwise show toast notification with shadcn/ui
        toast({
          title: "Audio Error",
          description: "Could not play pronunciation audio. The audio file might be unavailable or in an unsupported format.",
          variant: "destructive",
        });
      }
      
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
