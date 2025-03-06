
import { useState, useEffect } from 'react';
import { Play, Pause, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { playAudio, stopAudio } from '@/lib/audioUtils';

interface AudioPlayerProps {
  audioUrl: string;
  placeName: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const AudioPlayer = ({ audioUrl, placeName, className, size = 'md' }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Clean up audio on unmount
    return () => stopAudio();
  }, []);

  const handlePlayClick = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      playAudio(
        audioUrl,
        () => setIsPlaying(true),
        () => setIsPlaying(false)
      );
    }
  };

  const handleDownload = async () => {
    try {
      // Create a temporary anchor element
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `${placeName.toLowerCase().replace(/\s+/g, '-')}-pronunciation.ogg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading audio:', error);
    }
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="flex gap-2">
        <button
          aria-label={isPlaying ? `Pause pronunciation of ${placeName}` : `Play pronunciation of ${placeName}`}
          className={cn(
            "glass-morphism rounded-full flex items-center justify-center transition-all duration-300",
            sizeClasses[size],
            isPlaying 
              ? "bg-primary/10 border-primary/20 text-primary" 
              : "hover:bg-primary/5 hover:border-primary/10 hover:text-primary/80 text-foreground",
            isHovered && !isPlaying ? "scale-110" : "scale-100"
          )}
          onClick={handlePlayClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isPlaying ? (
            <Pause size={iconSizes[size]} className="animation-pulse-subtle" />
          ) : (
            <Play size={iconSizes[size]} className="ml-0.5" />
          )}
        </button>
        
        <button
          aria-label={`Download pronunciation of ${placeName}`}
          className={cn(
            "glass-morphism rounded-full flex items-center justify-center transition-all duration-300",
            sizeClasses[size],
            "hover:bg-primary/5 hover:border-primary/10 hover:text-primary/80 text-foreground"
          )}
          onClick={handleDownload}
        >
          <Download size={iconSizes[size]} />
        </button>
      </div>

      {isPlaying && (
        <div className="flex space-x-0.5 h-3 items-end mt-2">
          <div className="w-1 bg-primary rounded-full h-2 animate-wave-1"></div>
          <div className="w-1 bg-primary rounded-full h-3 animate-wave-2"></div>
          <div className="w-1 bg-primary rounded-full h-1.5 animate-wave-3"></div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
