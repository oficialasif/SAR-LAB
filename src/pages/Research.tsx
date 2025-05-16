import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
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
    color: 'gray'
  },
  {
    id: 'nlp',
    title: 'Natural Language Processing',
    description: 'Our NLP research focuses on advancing the understanding, generation, and analysis of human language by machines.',
    icon: <FaRobot className="text-purple-600" size={24} />,
    color: 'purple'
  },
  {
    id: 'vision',
    title: 'Computer Vision',
    description: 'Our computer vision research develops systems that can analyze, understand, and interpret visual information from the world.',
    icon: <FaLaptop className="text-blue-600" size={24} />,
    color: 'blue'
  },
  {
    id: 'quantum',
    title: 'Quantum Computing',
    description: 'Our quantum computing research explores the frontier of computation using quantum mechanical phenomena.',
    icon: <FaCalculator className="text-green-600" size={24} />,
    color: 'green'
  },
  {
    id: 'security',
    title: 'Cybersecurity',
    description: 'Our cybersecurity research focuses on protecting systems, networks, and data from digital attacks and unauthorized access.',
    icon: <FaLock className="text-red-600" size={24} />,
    color: 'red'
  }
];

export default function Research() {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
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

  const activeCategoryData = researchCategories.find(cat => cat.id === activeCategory) || researchCategories[0];

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
          <div className="flex flex-wrap -mb-px overflow-x-auto">
            {researchCategories.map((category) => (
              <button
                key={category.id}
                className={`inline-block p-4 text-sm font-medium border-b-2 ${
                  activeCategory === category.id
                    ? `text-${category.color}-600 border-${category.color}-600`
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
      <Section>
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center mb-6">
              <div className="mr-4">
                {activeCategoryData.icon}
              </div>
              <div>
                <h2 className="text-3xl font-bold">{activeCategoryData.title}</h2>
                <p className="text-lg text-gray-600">{activeCategoryData.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              {getPapersByCategory(activeCategory).map((paper, index) => (
                <ResearchCard
                  key={paper.id}
                  {...paper}
                  delay={index * 0.1}
                />
              ))}
              
              {getPapersByCategory(activeCategory).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {activeCategory === 'all' 
                      ? 'No research papers found. Please add some papers through the admin panel.'
                      : `No research papers found in ${researchCategories.find(cat => cat.id === activeCategory)?.title || 'this category'}.`
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Section>
    </>
  );
}