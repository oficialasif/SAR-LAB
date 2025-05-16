import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
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

const projectCategories = [
  { id: 'all', name: 'All Projects' },
  { id: 'ai-agriculture', name: 'AI in Agriculture' },
  { id: 'blockchain', name: 'Blockchain Applications' },
  { id: 'deepfake-detection', name: 'Deepfake Detection' },
  { id: 'machine-learning', name: 'Machine Learning' }
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
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
    }
    
    // Check if we navigated from a sub-path
    const path = location.pathname;
    const subPath = path.split('/').pop();
    if (subPath && projectCategories.some(cat => cat.id === subPath)) {
      setActiveCategory(subPath);
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
    navigate(`/projects#${categoryId}`);
  };
  
  const getProjectsByCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      return projects;
    }
    return projects.filter(project => project.category === categoryId);
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
          <div className="flex flex-wrap -mb-px overflow-x-auto">
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
      <Section>
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getProjectsByCategory(activeCategory).map((project, index) => (
              <ProjectCard
                key={project.id}
                {...project}
                delay={index * 0.1}
              />
            ))}
          </div>

          {getProjectsByCategory(activeCategory).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {activeCategory === 'all' 
                  ? 'No projects found. Please add some projects through the admin panel.'
                  : `No projects found in ${projectCategories.find(cat => cat.id === activeCategory)?.name || 'this category'}.`
                }
              </p>
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