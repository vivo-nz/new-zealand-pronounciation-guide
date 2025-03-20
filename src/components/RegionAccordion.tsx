
import { useState, useEffect } from 'react';
import { PlaceName } from '@/data/placeNames';
import { Region, placeNameRegions } from '@/data/regions';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { AnimatePresence, motion } from 'framer-motion';
import PronunciationCard from './PronunciationCard';
import EmptyState from './EmptyState';

interface RegionAccordionProps {
  placeNames: PlaceName[];
  regions: Region[];
  searchQuery: string;
}

const RegionAccordion = ({ placeNames, regions, searchQuery }: RegionAccordionProps) => {
  const [filteredNames, setFilteredNames] = useState<PlaceName[]>(placeNames);
  const [expandedRegions, setExpandedRegions] = useState<string[]>([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNames(placeNames);
      return;
    }

    const filtered = placeNames.filter(place => 
      place.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNames(filtered);
    
    // Auto-expand regions that have matching place names
    if (filtered.length > 0) {
      const relevantRegions = new Set<string>();
      
      filtered.forEach(place => {
        for (const [regionId, places] of Object.entries(placeNameRegions)) {
          if (places.includes(place.name)) {
            relevantRegions.add(regionId);
          }
        }
      });
      
      setExpandedRegions(Array.from(relevantRegions));
    }
  }, [searchQuery, placeNames]);

  // Get unique place names in a region
  const getRegionPlaceNames = (regionId: string): PlaceName[] => {
    const regionPlaceIds = placeNameRegions[regionId] || [];
    return filteredNames.filter(place => regionPlaceIds.includes(place.name));
  };

  // Toggle expanded state for a region
  const toggleRegion = (regionId: string) => {
    setExpandedRegions(prev => 
      prev.includes(regionId) 
        ? prev.filter(id => id !== regionId)
        : [...prev, regionId]
    );
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  // Check if we have any results at all
  const hasResults = regions.some(region => getRegionPlaceNames(region.id).length > 0);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {hasResults ? (
          <Accordion 
            type="multiple" 
            value={expandedRegions}
            className="w-full"
          >
            {regions.map(region => {
              const regionPlaces = getRegionPlaceNames(region.id);
              // Skip empty regions when searching
              if (searchQuery && regionPlaces.length === 0) return null;
              
              return (
                <AccordionItem 
                  key={region.id} 
                  value={region.id}
                  className={regionPlaces.length > 0 ? "" : "opacity-60"}
                >
                  <AccordionTrigger 
                    onClick={() => toggleRegion(region.id)}
                    className="px-4 hover:no-underline hover:bg-blue-50/50 rounded-lg data-[state=open]:rounded-b-none"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{region.name}</span>
                      <span className="text-sm text-muted-foreground">{regionPlaces.length} places</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-1 space-y-2">
                    {regionPlaces.length > 0 ? (
                      <motion.div className="grid gap-2 p-1">
                        {regionPlaces.map(place => (
                          <motion.div 
                            key={place.id} 
                            variants={item}
                            initial="hidden"
                            animate="show"
                            className="rounded-lg overflow-hidden"
                          >
                            <PronunciationCard placeName={place} />
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <div className="px-4 py-2 text-sm text-muted-foreground italic">
                        No places in this region
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
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

export default RegionAccordion;
