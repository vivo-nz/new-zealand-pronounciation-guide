
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { playAudio, stopAudio } from '@/lib/audioUtils';
import { toast } from "@/hooks/use-toast";

interface AudioPlayerProps {
  audioUrl: string;
  placeName: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const AudioPlayer = ({ audioUrl, placeName, className, size = 'md' }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    // Reset error state when component receives a new audioUrl
    setHasError(false);
    
    return () => {
      isMounted.current = false;
      stopAudio();
    };
  }, [audioUrl]);

  const handlePlayClick = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
      return;
    }

    // Reset error state on new play attempt
    setHasError(false);
    
    playAudio(
      audioUrl,
      () => {
        if (isMounted.current) {
          setIsPlaying(true);
        }
      },
      () => {
        if (isMounted.current) {
          setIsPlaying(false);
        }
      },
      (error) => {
        console.error("Audio player error:", error);
        if (isMounted.current) {
          setHasError(true);
          setIsPlaying(false);
          toast({
            title: "Audio Error",
            description: `Could not play "${placeName}" pronunciation. The audio file might be unavailable or in an unsupported format.`,
            variant: "destructive",
          });
        }
      }
    );
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
      <button
        aria-label={isPlaying ? `Pause pronunciation of ${placeName}` : `Play pronunciation of ${placeName}`}
        className={cn(
          "glass-morphism rounded-full flex items-center justify-center transition-all duration-300",
          sizeClasses[size],
          isPlaying 
            ? "bg-primary/10 border-primary/20 text-primary" 
            : hasError
              ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
              : "hover:bg-primary/5 hover:border-primary/10 hover:text-primary/80 text-foreground",
          isHovered && !isPlaying ? "scale-110" : "scale-100"
        )}
        onClick={handlePlayClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isPlaying ? (
          <Pause size={iconSizes[size]} className="animation-pulse-subtle" />
        ) : hasError ? (
          <AlertCircle size={iconSizes[size]} />
        ) : (
          <Play size={iconSizes[size]} className="ml-0.5" />
        )}
      </button>

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
