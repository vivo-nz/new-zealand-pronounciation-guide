
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({ onSearch, placeholder = "Search place names...", className }: SearchBarProps) => {
  const [query, setQuery] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Debounce search to avoid too many re-renders
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div 
      className={cn(
        "relative w-full max-w-md transition-all-300",
        isFocused ? "scale-[1.01]" : "scale-100",
        className
      )}
    >
      <div 
        className={cn(
          "glass-morphism flex items-center gap-2 px-4 py-3 rounded-xl w-full",
          "transition-all duration-300 ease-in-out",
          "shadow-sm hover:shadow",
          isFocused ? "ring-2 ring-primary/20 shadow" : ""
        )}
        onClick={() => inputRef.current?.focus()}
      >
        <Search 
          size={20} 
          className={cn(
            "text-muted-foreground transition-colors",
            isFocused ? "text-primary" : ""
          )} 
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="bg-transparent border-none outline-none flex-1 text-foreground placeholder:text-muted-foreground/70 text-base"
          aria-label="Search place names"
        />
        {query && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuery('');
              inputRef.current?.focus();
            }}
            className="text-muted-foreground/70 hover:text-foreground transition-colors text-sm px-2"
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
