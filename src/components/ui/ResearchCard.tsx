import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Timestamp } from 'firebase/firestore';

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
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors">
          {title}
        </h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColorClass(status)}`}>
          {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </span>
      </div>

      <p className="text-gray-600 mb-4">
        {abstract.length > 200 ? `${abstract.substring(0, 200)}...` : abstract}
      </p>

      <div className="text-sm text-gray-500 mb-4">
        <p className="mb-1">{authors.join(', ')}</p>
        {venue && <p className="italic">{venue}</p>}
        <p>{publicationDate.toDate().toLocaleDateString()}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {keywords.map((keyword, index) => (
          <span
            key={index}
            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
          >
            {keyword}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <Link
          to={`/research/${id}`}
          className="text-primary-600 hover:text-primary-800 font-medium flex items-center transition-colors"
        >
          Read More
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>

        <div className="flex space-x-4">
          {doi && (
            <a
              href={`https://doi.org/${doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800"
            >
              DOI
            </a>
          )}
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800"
            >
              PDF
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
} 