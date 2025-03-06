
import { Search, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  query: string;
  showAllAction: () => void;
  className?: string;
}

const EmptyState = ({ query, showAllAction, className }: EmptyStateProps) => {
  return (
    <div 
      className={cn(
        "glass-morphism rounded-xl py-12 px-6 text-center",
        "flex flex-col items-center justify-center space-y-4",
        className
      )}
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-2"
      >
        <Search size={32} className="text-muted-foreground" />
      </motion.div>
      
      <motion.h3 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="text-foreground font-medium text-lg"
      >
        No matching place names found
      </motion.h3>
      
      <motion.p 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="text-muted-foreground max-w-md"
      >
        {query ? (
          <>
            We couldn't find any place names matching "<span className="font-medium">{query}</span>".
            Try a different search term or check your spelling.
          </>
        ) : (
          "Start typing to search for place names."
        )}
      </motion.p>
      
      {query && (
        <motion.button 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          onClick={showAllAction}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mt-2 px-4 py-2 rounded-md hover:bg-primary/5"
        >
          <RefreshCw size={16} />
          <span>Show all place names</span>
        </motion.button>
      )}
    </div>
  );
};

export default EmptyState;
