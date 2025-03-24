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

// Helper to check if a URL is relative (not starting with 'http' or '/')
const isRelativeUrl = (url: string): boolean => {
  return !url.startsWith('http') && !url.startsWith('/');
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

// Try alternative audio formats if the first one fails
const tryAlternativeFormats = (
  baseUrl: string, 
  onPlay?: () => void, 
  onEnd?: () => void,
  onError?: (error: any) => void
): void => {
  // Extract the base filename without extension
  const parts = baseUrl.split('.');
  const extension = parts.pop() || '';
  const baseName = parts.join('.');
  
  // Define alternative formats to try - updated order based on broader browser support
  // mp3 has the widest browser support, followed by wav
  const formats = ['mp3', 'wav', 'ogg', 'm4a'];
  
  // Remove the current format from the list if it exists
  const currentFormatIndex = formats.indexOf(extension.toLowerCase());
  if (currentFormatIndex !== -1) {
    formats.splice(currentFormatIndex, 1);
  }
  
  // Put the current format at the beginning if it's a known audio format
  if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension.toLowerCase())) {
    formats.unshift(extension.toLowerCase());
  }
  
  console.log(`Will try formats in this order:`, formats);
  
  // Function to try each format recursively
  const tryFormat = (index: number) => {
    if (index >= formats.length) {
      console.error('All audio formats failed to load');
      if (onError) onError(new Error('All audio formats failed to load'));
      return;
    }
    
    const url = `${baseName}.${formats[index]}`;
    console.log(`Trying format ${index + 1}/${formats.length}: ${url}`);
    
    // Add cache buster
    const urlWithCacheBuster = url + (url.includes('?') ? '&' : '?') + 'cb=' + new Date().getTime();
    
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    
    // Set up event listeners
    audio.addEventListener('canplaythrough', () => {
      console.log(`Format ${formats[index]} loaded successfully`);
      
      if (onPlay) onPlay();
      
      audio.addEventListener('ended', () => {
        if (onEnd) onEnd();
        audio.remove();
      });
      
      audio.play().catch(err => {
        console.error(`Error playing ${formats[index]} format:`, err);
        tryFormat(index + 1);
      });
    });
    
    audio.addEventListener('error', (e) => {
      console.warn(`Format ${formats[index]} failed to load:`, e);
      tryFormat(index + 1);
    });
    
    // Add load timeout to handle scenarios where neither error nor canplaythrough fire
    let loadTimeout = setTimeout(() => {
      console.log(`Timeout for format ${formats[index]}`);
      if (audio.readyState < 3) { // HAVE_FUTURE_DATA
        tryFormat(index + 1);
      }
    }, 3000);
    
    // Clean up timeout if we do get a valid response
    audio.addEventListener('loadeddata', () => {
      clearTimeout(loadTimeout);
    });
    
    // Set source and load
    audio.src = urlWithCacheBuster;
    audio.load();
  };
  
  // Start trying formats
  tryFormat(0);
};

// Check if the audio format is supported by the browser
const isAudioFormatSupported = (format: string): boolean => {
  const audio = document.createElement('audio');
  
  // Check basic MIME type support
  const mimeTypes = {
    'm4a': 'audio/mp4; codecs="mp4a.40.2"',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg; codecs="vorbis"'
  };
  
  const type = mimeTypes[format as keyof typeof mimeTypes];
  if (!type) return false;
  
  return audio.canPlayType(type) !== '';
};

// Explicitly build absolute URLs from relative ones
const getAbsoluteUrl = (url: string): string => {
  // If it's already an absolute URL, return it
  if (url.startsWith('http') || url.startsWith('//')) {
    return url;
  }
  
  // Remove any leading dots or slashes for consistency
  let cleanUrl = url;
  while (cleanUrl.startsWith('./') || cleanUrl.startsWith('../')) {
    cleanUrl = cleanUrl.replace(/^\.\//, '').replace(/^\.\.\//, '');
  }
  
  // If it's a root-relative URL (starts with /)
  if (cleanUrl.startsWith('/')) {
    // Remove the leading slash to prevent double slashes
    cleanUrl = cleanUrl.substring(1);
  }
  
  // For published apps, we need to check if we're running in a subdirectory
  const baseUrl = window.location.origin;
  const pathPrefix = window.location.pathname.split('/').slice(0, -1).join('/');
  
  // Construct the full URL
  let fullUrl = `${baseUrl}`;
  
  // Add the path prefix if we're in a subdirectory
  if (pathPrefix && pathPrefix !== '/') {
    fullUrl += pathPrefix;
  }
  
  // Ensure there's a slash between the base and the file
  if (!fullUrl.endsWith('/')) {
    fullUrl += '/';
  }
  
  // Add the file path
  fullUrl += cleanUrl;
  
  console.log(`Resolved relative URL "${url}" to absolute URL "${fullUrl}"`);
  return fullUrl;
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

  // Handle relative URLs first - this is crucial for the published app
  let processedUrl = audioUrl;
  
  // Use a more aggressive approach to handling relative URLs
  if (isRelativeUrl(processedUrl) || isLocalUrl(processedUrl)) {
    processedUrl = getAbsoluteUrl(processedUrl);
    console.log("Converted relative URL to absolute:", processedUrl);
    
    // Force a fallback if the audio file doesn't contain 'audio' in the name
    // This helps with files like takapuna.1.mp3 that might not follow naming conventions
    if (!processedUrl.toLowerCase().includes('audio') && !processedUrl.includes('.1.')) {
      const baseName = processedUrl.substring(0, processedUrl.lastIndexOf('.'));
      console.log("Using fallback URL pattern for:", processedUrl);
      processedUrl = `${baseName}-audio.mp3`;
      console.log("Fallback URL:", processedUrl);
    }
  }

  // If it's a GitHub URL, ensure it's properly formatted for direct access
  if (isGitHubUrl(processedUrl)) {
    processedUrl = getGitHubRawUrl(processedUrl);
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
  
  // Detect the audio format from the URL
  const fileExtension = processedUrl.split('.').pop()?.toLowerCase() || '';
  
  // Check browser support for this audio format
  const isFormatSupported = isAudioFormatSupported(fileExtension);
  console.log(`Audio format ${fileExtension} supported by browser: ${isFormatSupported}`);
  
  // If format is not supported, try alternative formats right away
  if (!isFormatSupported && ['m4a', 'mp3', 'wav', 'ogg'].includes(fileExtension)) {
    console.log(`Browser doesn't support ${fileExtension}, trying alternative formats...`);
    tryAlternativeFormats(processedUrl, onPlay, onEnd, onError);
    return;
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
  audioInstance = new Audio();
  audioInstance.crossOrigin = "anonymous"; // Handle CORS issues
  
  // Log the audio URL being used
  console.log("Attempting to play audio from:", processedUrl);
  
  if (onPlay) {
    // Use both canplaythrough and playing events for better browser compatibility
    const playHandler = () => {
      console.log("Audio playback started");
      onPlay();
      // Remove the event listener after it fires to prevent duplicates
      audioInstance?.removeEventListener('playing', playHandler);
    };
    
    audioInstance.addEventListener('playing', playHandler);
  }
  
  if (onEnd) {
    const endHandler = () => {
      console.log("Audio playback ended");
      onEnd();
      audioInstance = null;
      // Remove the event listener after it fires
      audioInstance?.removeEventListener('ended', endHandler);
    };
    
    audioInstance.addEventListener('ended', endHandler);
  }

  // Handle errors with detailed logging
  audioInstance.addEventListener('error', (e) => {
    const error = audioInstance?.error;
    console.error('Error playing audio:', e);
    console.log('Failed audio URL:', processedUrl);
    console.log('Audio error code:', error?.code);
    console.log('Audio error message:', error?.message);
    
    // Try alternative formats if the main format fails
    console.log('Trying alternative audio formats...');
    tryAlternativeFormats(audioUrl, onPlay, onEnd, onError);
    
    // Clear the current audio instance
    audioInstance = null;
  });

  // Set source and load the audio
  audioInstance.src = processedUrl;
  audioInstance.load();

  // Play the audio with a slight delay to ensure smooth animation
  setTimeout(() => {
    if (!audioInstance) return;
    
    audioInstance.play().catch(err => {
      console.error('Failed to play audio:', err);
      console.log('Failed audio URL details:', processedUrl);
      
      // Try alternative formats if the main format fails
      console.log('Trying alternative audio formats after play failure...');
      tryAlternativeFormats(audioUrl, onPlay, onEnd, onError);
      
      audioInstance = null;
    });
  }, 50);
};

// Helper function to handle SoundCloud URLs
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

export const stopAudio = (): void => {
  if (audioInstance) {
    audioInstance.pause();
    audioInstance = null;
  }
};
