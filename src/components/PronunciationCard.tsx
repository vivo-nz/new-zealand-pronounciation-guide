
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import AudioPlayer from './AudioPlayer';
import { PlaceName } from '@/data/placeNames';
import { Building, Store } from 'lucide-react';
import { placeTypes } from '@/data/regions';

interface PronunciationCardProps {
  placeName: PlaceName;
  className?: string;
}

const PronunciationCard = ({ placeName, className }: PronunciationCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Get the place type (defaulting to store if not specified)
  const placeDetails = placeTypes[placeName.name] || { type: 'store' };
  const isCity = placeDetails.type === 'city';

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
      <div className="flex items-center gap-3 flex-1">
        {isCity ? (
          <Building className="text-blue-600 flex-shrink-0" size={20} />
        ) : (
          <Store className="text-green-600 flex-shrink-0" size={20} />
        )}
        <div>
          <h3 className="font-medium text-foreground text-lg">{placeName.name}</h3>
          {placeName.description && (
            <p className="text-muted-foreground text-sm mt-1">{placeName.description}</p>
          )}
        </div>
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
