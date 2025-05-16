import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Timestamp } from 'firebase/firestore';

interface Tag {
  name: string;
  color: string;
}

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  content?: string;
  imageUrl?: string;
  status: string;
  category: string;
  startDate?: Timestamp;
  endDate?: Timestamp;
  teamMembers: string[];
  tags: Tag[];
  liveUrl?: string;
  githubUrl?: string;
  delay?: number;
}

export default function ProjectCard({
  id,
  title,
  description,
  imageUrl,
  status,
  category,
  startDate,
  teamMembers,
  tags,
  delay = 0
}: ProjectCardProps) {
  // Status color classes
  const getStatusColorClass = (status: string) => {
    const statusMap: Record<string, string> = {
      'published': 'bg-green-100 text-green-800',
      'completed': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'planning': 'bg-purple-100 text-purple-800',
      'under-review': 'bg-orange-100 text-orange-800',
      'on-hold': 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
    >
      <div className="relative overflow-hidden">
        <img 
          src={imageUrl || 'https://placehold.co/600x400/e6f7ff/0050b3?text=Project+Image'} 
          alt={title} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColorClass(status)}`}>
            {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 flex-grow">
          {description.length > 120 ? `${description.substring(0, 120)}...` : description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                tag.color === 'primary' ? 'bg-primary-100 text-primary-800' :
                `bg-${tag.color}-100 text-${tag.color}-800`
              }`}
            >
              {tag.name}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            {startDate && (
              <span>Started: {startDate.toDate().toLocaleDateString()}</span>
            )}
          </div>
          <Link
            to={`/projects/${id}`}
            className="text-primary-600 font-medium hover:text-primary-800 transition-colors inline-flex items-center"
          >
            Learn more
            <svg 
              className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 