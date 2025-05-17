import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import Section from '../components/ui/Section';
import ProjectCard from '../components/ui/ProjectCard';

interface Tag {
  name: string;
  color?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  content: string;
  status: 'planning' | 'in-progress' | 'completed' | 'published' | 'under-review' | 'on-hold';
  category: 'ai-agriculture' | 'blockchain' | 'deepfake-detection' | 'machine-learning';
  startDate: Timestamp;
  endDate?: Timestamp | null;
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  teamMembers: string[];
  tags: Tag[];
  featured: boolean;
  createdAt: Timestamp;
}

const projectCategories = [  { id: 'all', name: 'All Projects' },  { id: 'ai-agriculture', name: 'AI in Agriculture' },  { id: 'blockchain', name: 'Blockchain Applications' },  { id: 'deepfake-detection', name: 'Deepfake Detection' },  { id: 'machine-learning', name: 'Machine Learning' }];export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 3x2 grid
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  useEffect(() => {
    // Check if there's a hash in the URL
    const hash = location.hash.replace('#', '');
    if (hash && projectCategories.some(cat => cat.id === hash)) {
      setActiveCategory(hash);
      setCurrentPage(1); // Reset to first page when category changes
    }
    
    // Check if we navigated from a sub-path
    const path = location.pathname;
    const subPath = path.split('/').pop();
    if (subPath && projectCategories.some(cat => cat.id === subPath)) {
      setActiveCategory(subPath);
      setCurrentPage(1); // Reset to first page when category changes
      // Redirect to main page with hash
      navigate('/projects#' + subPath, { replace: true });
    }
  }, [location, navigate]);
  
  const fetchProjects = async () => {
    try {
      console.log('Fetching projects from Firestore...');
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      console.log('Found', querySnapshot.size, 'projects');
      
      const projectsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Project data:', { id: doc.id, ...data });
        
        // Ensure all required fields are present with defaults if missing
        return {
          id: doc.id,
          title: data.title || 'Untitled Project',
          description: data.description || 'No description available',
          content: data.content || '',
          status: data.status || 'planning',
          category: data.category || 'ai-agriculture',
          startDate: data.startDate || Timestamp.now(),
          endDate: data.endDate || null,
          imageUrl: data.imageUrl || '',
          liveUrl: data.liveUrl || '',
          githubUrl: data.githubUrl || '',
          teamMembers: Array.isArray(data.teamMembers) ? data.teamMembers : [],
          tags: Array.isArray(data.tags) 
            ? data.tags.map(tag => typeof tag === 'string' ? { name: tag, color: 'primary' } : tag)
            : [],
          featured: Boolean(data.featured),
          createdAt: data.createdAt || Timestamp.now()
        };
      }) as Project[];

      console.log('All processed projects:', projectsData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentPage(1); // Reset to first page when category changes
    navigate(`/projects#${categoryId}`);
  };
  
  const getProjectsByCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      return projects;
    }
    return projects.filter(project => project.category === categoryId);
  };

  // Calculate pagination
  const filteredProjects = getProjectsByCategory(activeCategory);
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

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
            Our Research Projects
          </h1>
          <p className="text-xl max-w-3xl animate-gradient bg-gradient-to-r from-white via-primary-200 to-white bg-[length:200%_100%] bg-clip-text text-transparent">
            Explore our cutting-edge research projects across different domains of artificial intelligence, 
            blockchain technology, and machine learning.
          </p>
        </div>
      </div>
      
      {/* Category Tabs */}
      <div className="bg-white shadow-md">
        <div className="container">
          <div className="flex flex-wrap overflow-x-auto">
            {projectCategories.map((category) => (
              <button
                key={category.id}
                className={`inline-block p-4 text-sm font-medium border-b-2 ${
                  activeCategory === category.id
                    ? 'text-primary-600 border-primary-600'
                    : 'text-gray-500 border-transparent hover:text-primary-600 hover:border-primary-300'
                } transition-colors whitespace-nowrap`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Projects Grid */}
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
            {currentProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                {...project}
                delay={index * 0.1}
              />
            ))}
            
            {currentProjects.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">
                  {activeCategory === 'all' 
                    ? 'No projects found. Please add some projects through the admin panel.'
                    : `No projects found in ${projectCategories.find(cat => cat.id === activeCategory)?.name || 'this category'}.`
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
      
      {/* CTA Section */}
      <Section bgColor="bg-primary-50">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Interested in Collaborating?</h2>
          <p className="text-gray-600 mb-8">
            We're always looking for research partners, industry collaborators, and talented students to join our projects.
          </p>
          <Link to="/team" className="btn btn-primary mx-2">
            Meet Our Team
          </Link>
          <a href="mailto:collaborations@sarlab.edu" className="btn btn-outline mx-2">
            Contact Us
          </a>
        </div>
      </Section>
    </>
  );
} 