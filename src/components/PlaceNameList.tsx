
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PlaceName } from '@/types/placeNames';
import PronunciationCard from './PronunciationCard';
import EmptyState from './EmptyState';

interface PlaceNameListProps {
  placeNames: PlaceName[];
  searchQuery: string;
}

const PlaceNameList = ({ placeNames, searchQuery }: PlaceNameListProps) => {
  const [filteredNames, setFilteredNames] = useState<PlaceName[]>(placeNames);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNames(placeNames);
      return;
    }

    const filtered = placeNames.filter(place => 
      place.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNames(filtered);
  }, [searchQuery, placeNames]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <AnimatePresence mode="wait">
        {filteredNames.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4"
          >
            {filteredNames.map(place => (
              <motion.div key={place.id} variants={item} layout>
                <PronunciationCard placeName={place} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <EmptyState 
              query={searchQuery} 
              showAllAction={() => setFilteredNames(placeNames)} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlaceNameList;
