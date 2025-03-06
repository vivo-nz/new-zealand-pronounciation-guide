
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import PlaceNameList from '@/components/PlaceNameList';
import { placeNames } from '@/data/placeNames';
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-white px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl font-medium tracking-tight text-foreground mb-2 mt-4">
              Place Name Pronunciation Guide
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Search and listen to the correct pronunciation of place names to enhance staff communication.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mb-8"
        >
          <SearchBar 
            onSearch={setSearchQuery} 
            placeholder="Type a place name..."
            className="w-full max-w-2xl"
          />
        </motion.div>

        <PlaceNameList 
          placeNames={placeNames} 
          searchQuery={searchQuery}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center text-muted-foreground text-sm mt-12"
        >
          <p>Listen to the correct pronunciation to avoid common mispronunciations.</p>
          <p className="mt-1">Additional place names can be added by the admin team.</p>
        </motion.div>
      </motion.div>
      
      <Toaster />
    </div>
  );
};

export default Index;
