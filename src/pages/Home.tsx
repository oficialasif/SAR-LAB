import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLightbulb, FaEye, FaBullseye, FaArrowRight } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import Section from '../components/ui/Section';
import Hero from '../components/ui/Hero';
import InfoCard from '../components/ui/InfoCard';
import ProjectCard from '../components/ui/ProjectCard';

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags: Array<{ name: string; color?: string; }>;
  category: string;
  featured: boolean;
}

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        console.log('Fetching featured projects...');
        const projectsRef = collection(db, 'projects');
        
        // Use the optimized query with the new index
        const q = query(
          projectsRef,
          where('featured', '==', true),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        
        console.log('Executing featured projects query...');
        const querySnapshot = await getDocs(q);
        console.log('Found featured projects:', querySnapshot.size);
        
        // Log each document for debugging
        querySnapshot.forEach(doc => {
          const data = doc.data();
          console.log('Featured project:', {
            id: doc.id,
            title: data.title,
            featured: data.featured,
            createdAt: data.createdAt?.toDate()
          });
        });

        const projects = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];

        console.log('Setting featured projects:', projects.length);
        setFeaturedProjects(projects);
      } catch (error) {
        console.error('Error fetching featured projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        title="Applied Research in Security & Intelligence"
        ctaText="Explore Our Projects"
        ctaLink="/projects"
        secondaryCtaText="Meet Our Team"
        secondaryCtaLink="/team"
        backgroundImage="https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      
      {/* Mission, Vision, Goals Section */}
      <Section 
        title="Our Foundation" 
        subtitle="The core principles that guide our research and innovation"
        bgColor="bg-gray-50"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <InfoCard 
            title="Mission" 
            description="To conduct innovative research that addresses real-world challenges through the application of advanced computational techniques and ethical technology development."
            icon={<FaLightbulb size={24} />}
            delay={0.1}
          />
          <InfoCard 
            title="Vision" 
            description="A world where technology empowers communities, enhances sustainability, and creates equitable access to information and resources."
            icon={<FaEye size={24} />}
            delay={0.2}
          />
          <InfoCard 
            title="Goals" 
            description="Develop open-source solutions, publish impactful research, train the next generation of innovators, and collaborate across disciplines."
            icon={<FaBullseye size={24} />}
            delay={0.3}
          />
        </div>
      </Section>
      
      {/* Project Preview Section */}
      <Section 
        title="Featured Projects" 
        subtitle="Explore our groundbreaking research initiatives"
      >
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <ProjectCard
                  delay={index * 0.2}
                  id={project.id}
                  title={project.title}
                  description={project.description}
                  imageUrl={project.imageUrl}
                  tags={project.tags}
                  status="published"
                  key={project.id}
                />
              ))}
              {featuredProjects.length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">No featured projects available.</p>
                </div>
              )}
            </div>
            
            <div className="mt-12 text-center">
              <Link 
                to="/projects" 
                className="btn btn-primary inline-flex items-center"
              >
                View All Projects
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </>
        )}
      </Section>
      
      {/* Quick Links Section */}
      <Section bgColor="bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Our Team</h3>
            <p className="mb-4 text-gray-600">Meet our diverse team of researchers, faculty, and students working together to push the boundaries of knowledge.</p>
            <Link 
              to="/team" 
              className="text-gray-700 font-medium hover:text-gray-900 inline-flex items-center"
            >
              Meet the Team
              <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Lab History</h3>
            <p className="mb-4 text-gray-600">Explore our journey from a small research group to a leading technology innovation lab.</p>
            <Link 
              to="/history" 
              className="text-gray-700 font-medium hover:text-gray-900 inline-flex items-center"
            >
              View Timeline
              <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">News & Awards</h3>
            <p className="mb-4 text-gray-600">Stay updated with our latest achievements, events, and recognition in the field.</p>
            <Link 
              to="/news" 
              className="text-gray-700 font-medium hover:text-gray-900 inline-flex items-center"
            >
              Latest Updates
              <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </Section>
      
      {/* Newsletter CTA */}
      <Section bgColor="bg-white" className="border-t border-gray-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Stay Updated with Our Research</h2>
          <p className="text-gray-600 text-lg mb-8">
            Join our newsletter to receive the latest updates on our research, publications, and events.
          </p>
          
          <form className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                required
                placeholder="Your email address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <button
                type="submit"
                className="btn btn-primary whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </Section>
    </div>
  );
} 