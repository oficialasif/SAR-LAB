import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import Section from '../components/ui/Section';
import ResearchCard from '../components/ui/ResearchCard';
import { FaArrowRight, FaLaptop, FaRobot, FaLock, FaCalculator } from 'react-icons/fa';

interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  status: 'planning' | 'in-progress' | 'completed' | 'published' | 'under-review' | 'on-hold';
  category: 'nlp' | 'vision' | 'quantum' | 'security';
  keywords: string[];
  publicationDate: Timestamp;
  venue?: string;
  doi?: string;
  url?: string;
  createdAt: Timestamp;
}

const researchCategories = [
  { 
    id: 'all',
    title: 'All Research',
    description: 'All our research papers across different domains',
    icon: <FaArrowRight className="text-gray-600" size={24} />,
    colorClass: 'text-gray-600 border-gray-600'
  },
  {
    id: 'nlp',
    title: 'Natural Language Processing',
    description: 'Our NLP research focuses on advancing the understanding, generation, and analysis of human language by machines.',
    icon: <FaRobot className="text-purple-600" size={24} />,
    colorClass: 'text-purple-600 border-purple-600'
  },
  {
    id: 'vision',
    title: 'Computer Vision',
    description: 'Our computer vision research develops systems that can analyze, understand, and interpret visual information from the world.',
    icon: <FaLaptop className="text-blue-600" size={24} />,
    colorClass: 'text-blue-600 border-blue-600'
  },
  {
    id: 'quantum',
    title: 'Quantum Computing',
    description: 'Our quantum computing research explores the frontier of computation using quantum mechanical phenomena.',
    icon: <FaCalculator className="text-green-600" size={24} />,
    colorClass: 'text-green-600 border-green-600'
  },
  {
    id: 'security',
    title: 'Cybersecurity',
    description: 'Our cybersecurity research focuses on protecting systems, networks, and data from digital attacks and unauthorized access.',
    icon: <FaLock className="text-red-600" size={24} />,
    colorClass: 'text-red-600 border-red-600'
  }
];

export default function Research() {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 3x2 grid
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    fetchPapers();
  }, []);

  useEffect(() => {
    // Check if there's a hash in the URL
    const hash = location.hash.replace('#', '');
    if (hash && researchCategories.some(cat => cat.id === hash)) {
      setActiveCategory(hash);
    }
    
    // Check if we navigated from a sub-path
    const path = location.pathname;
    const subPath = path.split('/').pop();
    if (subPath && researchCategories.some(cat => cat.id === subPath)) {
      setActiveCategory(subPath);
      navigate('/research#' + subPath, { replace: true });
    }
  }, [location, navigate]);

  const fetchPapers = async () => {
    try {
      console.log('Fetching research papers from Firestore...');
      const papersRef = collection(db, 'research');
      const q = query(papersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      console.log('Found', querySnapshot.size, 'papers');
      
      const papersData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Paper data:', { id: doc.id, ...data });
        
        // Ensure all required fields are present with defaults if missing
        return {
          id: doc.id,
          title: data.title || 'Untitled Research',
          abstract: data.abstract || 'No abstract available',
          authors: Array.isArray(data.authors) ? data.authors : [],
          status: data.status || 'planning',
          category: data.category || 'nlp',
          keywords: Array.isArray(data.tags) ? data.tags : [], // Using tags as keywords
          publicationDate: data.publicationDate || Timestamp.now(),
          venue: data.venue || '',
          doi: data.doi || '',
          url: data.pdfUrl || '', // Using pdfUrl as url
          createdAt: data.createdAt || Timestamp.now()
        };
      }) as ResearchPaper[];

      console.log('All processed papers:', papersData);
      setPapers(papersData);
    } catch (error) {
      console.error('Error fetching papers:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    navigate(`/research#${categoryId}`);
  };

  const getPapersByCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      return papers;
    }
    return papers.filter(paper => paper.category === categoryId);
  };

  // Calculate pagination
  const filteredPapers = getPapersByCategory(activeCategory);
  const totalPages = Math.ceil(filteredPapers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPapers = filteredPapers.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      if (currentPage > 3) {
        pageNumbers.push('...');
      }
      
      // Show pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pageNumbers.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pageNumbers.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="bg-primary-800 text-white py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-gradient bg-gradient-to-r from-white via-primary-200 to-white bg-[length:200%_100%] bg-clip-text text-transparent">
            Research Areas
          </h1>
          <p className="text-xl max-w-3xl animate-gradient bg-gradient-to-r from-white via-primary-200 to-white bg-[length:200%_100%] bg-clip-text text-transparent">
            Explore our diverse research areas where we're pushing the boundaries of knowledge and technology.
          </p>
        </div>
      </div>
      
      {/* Category Tabs */}
      <div className="bg-white shadow-md">
        <div className="container">
          <div className="flex flex-wrap overflow-x-auto">
            {researchCategories.map((category) => (
              <button
                key={category.id}
                className={`inline-block p-4 text-sm font-medium border-b-2 ${
                  activeCategory === category.id
                    ? category.colorClass
                    : 'text-gray-500 border-transparent hover:text-primary-600 hover:border-primary-300'
                } transition-colors whitespace-nowrap`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Research Area Content */}
      <Section className="pt-6">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPapers.map((paper, index) => (
              <ResearchCard
                key={paper.id}
                {...paper}
                delay={index * 0.1}
              />
            ))}
            
            {currentPapers.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">
                  {activeCategory === 'all' 
                    ? 'No research papers found. Please add some papers through the admin panel.'
                    : `No research papers found in ${researchCategories.find(cat => cat.id === activeCategory)?.title || 'this category'}.`
                  }
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Previous
              </button>
              
              {getPageNumbers().map((pageNum, index) => (
                <button
                  key={index}
                  onClick={() => typeof pageNum === 'number' ? handlePageChange(pageNum) : null}
                  className={`px-3 py-1 rounded-md ${
                    pageNum === currentPage
                      ? 'bg-primary-600 text-white'
                      : pageNum === '...'
                      ? 'bg-white text-gray-700 cursor-default'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                  disabled={pageNum === '...'}
                >
                  {pageNum}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </motion.div>
      </Section>
    </>
  );
}