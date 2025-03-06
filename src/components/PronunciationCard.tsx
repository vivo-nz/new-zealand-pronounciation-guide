
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import AudioPlayer from './AudioPlayer';
import { PlaceName } from '@/data/placeNames';

interface PronunciationCardProps {
  placeName: PlaceName;
  className?: string;
}

const PronunciationCard = ({ placeName, className }: PronunciationCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className={cn(
        "glass-morphism rounded-xl p-4 transition-all-300",
        "hover:shadow-md flex items-center justify-between gap-4",
        isHovered ? "bg-white/80" : "bg-white/70",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-1">
        <h3 className="font-medium text-foreground text-lg">{placeName.name}</h3>
        {placeName.description && (
          <p className="text-muted-foreground text-sm mt-1">{placeName.description}</p>
        )}
      </div>
      
      <AudioPlayer
        audioUrl={placeName.audioUrl}
        placeName={placeName.name}
        size="md"
      />
    </div>
  );
};

export default PronunciationCard;
