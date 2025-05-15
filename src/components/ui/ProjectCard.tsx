import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Tag {
  name: string;
  color: string;
}

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  imageSrc?: string;
  imageUrl?: string;
  tags: Tag[];
  link?: string;
  delay?: number;
}

export default function ProjectCard({
  id,
  title,
  description,
  imageSrc,
  imageUrl,
  tags,
  link = `/projects/${id}`,
  delay = 0
}: ProjectCardProps) {
  // Tag color classes
  const getTagColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      green: 'bg-green-100 text-green-800',
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      orange: 'bg-orange-100 text-orange-800',
      red: 'bg-red-100 text-red-800',
      primary: 'bg-primary-100 text-primary-800',
    };
    
    return colorMap[color] || colorMap.primary;
  };

  // Use imageUrl if available, otherwise fall back to imageSrc
  const imageSource = imageUrl || imageSrc || 'https://placehold.co/600x400/e6f7ff/0050b3?text=Project+Image';
  
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
    >
      <div className="relative overflow-hidden">
        <img 
          src={imageSource} 
          alt={title} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-4 flex-grow">
          {description.length > 120 ? `${description.substring(0, 120)}...` : description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getTagColorClass(tag.color)}`}
            >
              {tag.name}
            </span>
          ))}
        </div>
        
        <Link
          to={link}
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
    </motion.div>
  );
} 