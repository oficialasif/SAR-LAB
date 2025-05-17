import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Timestamp } from 'firebase/firestore';
import { FaArrowRight, FaExternalLinkAlt, FaFilePdf } from 'react-icons/fa';

interface ResearchCardProps {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  status: string;
  keywords: string[];
  publicationDate: Timestamp;
  venue?: string;
  doi?: string;
  url?: string;
  delay?: number;
}

export default function ResearchCard({
  id,
  title,
  abstract,
  authors,
  status,
  keywords,
  publicationDate,
  venue,
  doi,
  url,
  delay = 0
}: ResearchCardProps) {
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
      className="group bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColorClass(status)}`}>
            {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </span>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          <p className="mb-1 font-medium">{authors.join(', ')}</p>
          {venue && <p className="italic text-gray-600">{venue}</p>}
          <p className="text-gray-400">{publicationDate.toDate().toLocaleDateString()}</p>
        </div>

        <p className="text-gray-600 mb-4 flex-grow">
          {abstract.length > 200 ? `${abstract.substring(0, 200)}...` : abstract}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {keywords.map((keyword, index) => (
            <span
              key={index}
              className="bg-primary-50 text-primary-700 px-2.5 py-0.5 rounded-full text-xs font-medium"
            >
              {keyword}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            {doi && (
              <a
                href={`https://doi.org/${doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
                title="View DOI"
              >
                <FaExternalLinkAlt className="w-5 h-5" />
              </a>
            )}
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
                title="View PDF"
              >
                <FaFilePdf className="w-5 h-5" />
              </a>
            )}
          </div>
          <Link
            to={`/research/${id}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors group"
          >
            Read more
            <FaArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 