import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import Section from '../components/ui/Section';

interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  content: string;
  imageUrl: string;
  authors: string[];
  status: string;
  category: string;
  keywords: string[];
  publicationDate: any;
  venue?: string;
  doi?: string;
  url?: string;
}

export default function ResearchPaperDetail() {
  const { paperId } = useParams<{ paperId: string }>();
  const [paper, setPaper] = useState<ResearchPaper | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaper = async () => {
      if (!paperId) return;

      try {
        const docRef = doc(db, 'research', paperId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setPaper({
            id: docSnap.id,
            title: data.title || 'Untitled Research',
            abstract: data.abstract || 'No abstract available',
            content: data.content || '',
            imageUrl: data.imageUrl || '',
            authors: Array.isArray(data.authors) ? data.authors : [],
            status: data.status || 'planning',
            category: data.category || 'nlp',
            keywords: Array.isArray(data.tags) ? data.tags : [],
            publicationDate: data.publicationDate,
            venue: data.venue || '',
            doi: data.doi || '',
            url: data.pdfUrl || ''
          });
        }
      } catch (error) {
        console.error('Error fetching paper:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaper();
  }, [paperId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!paper) {
    return (
      <Section>
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Paper Not Found</h1>
          <p className="text-gray-600 mb-8">The research paper you're looking for doesn't exist or has been removed.</p>
          <Link to="/research" className="btn btn-primary">
            Back to Research
          </Link>
        </div>
      </Section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="bg-primary-800 text-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Link to="/research" className="text-white/80 hover:text-white mb-4 inline-flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Research
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{paper.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="bg-white/10 px-3 py-1 rounded-full">
                {paper.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
              <span>{paper.authors.join(', ')}</span>
              {paper.venue && <span>• {paper.venue}</span>}
              {paper.publicationDate && (
                <span>• {paper.publicationDate.toDate().toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <Section>
        <div className="max-w-4xl mx-auto">
          {/* Abstract */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Abstract</h2>
            <p className="text-gray-600">{paper.abstract}</p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            {paper.imageUrl && (
              <div className="mb-8">
                <img
                  src={paper.imageUrl}
                  alt={paper.title}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}
            
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: paper.content }}
            />
          </div>

          {/* Keywords */}
          <div className="flex flex-wrap gap-2 mb-8">
            {paper.keywords.map((keyword, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-4">
            {paper.doi && (
              <a
                href={`https://doi.org/${paper.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                View DOI
              </a>
            )}
            {paper.url && (
              <a
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Download PDF
              </a>
            )}
          </div>
        </div>
      </Section>
    </>
  );
} 