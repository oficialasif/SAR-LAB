import { useState, useRef, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Sample suggestions - in a real app, these would be dynamically generated
  const sampleSuggestions = [
    'Artificial Intelligence',
    'Machine Learning',
    'Natural Language Processing',
    'Computer Vision',
    'Blockchain',
    'Quantum Computing',
    'Cybersecurity',
    'Sustainable AI'
  ];
  
  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([]);
      return;
    }
    
    const filtered = sampleSuggestions.filter(item => 
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
  }, [searchQuery]);
  
  // Close search box when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // In a real app, implement search functionality here
    setIsSearchOpen(false);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    console.log('Searching for suggestion:', suggestion);
    // In a real app, implement search functionality here
    setIsSearchOpen(false);
  };
  
  return (
    <div className="h-16 fixed top-0 right-0 left-0 md:left-64 z-40 pointer-events-none">
      <div className="h-full px-4 md:px-8 flex items-center justify-end">
        <div className="pointer-events-auto relative">
          {/* Search Icon */}
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 rounded-full bg-gray-800/70 backdrop-blur-sm hover:bg-gray-800/80 text-white focus:outline-none transition-colors shadow-md"
            aria-label="Toggle search"
          >
            <FaSearch size={18} />
          </button>
          
          {/* Search Box - Only shown when isSearchOpen is true */}
          {isSearchOpen && (
            <div 
              ref={searchRef}
              className="absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out border border-gray-200"
              style={{ zIndex: 100 }}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Search</h3>
                  <button 
                    onClick={() => setIsSearchOpen(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
                
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search research, projects, people..."
                    className="w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <FaSearch />
                  </span>
                </form>
                
                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="mt-2 border-t">
                    <ul className="py-1">
                      {suggestions.map((suggestion) => (
                        <li key={suggestion}>
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 