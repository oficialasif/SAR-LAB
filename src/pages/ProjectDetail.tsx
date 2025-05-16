import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import Section from '../components/ui/Section';

interface Tag {
  name: string;
  color: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  status: string;
  category: string;
  startDate: any;
  endDate?: any;
  teamMembers: string[];
  tags: Tag[];
  liveUrl?: string;
  githubUrl?: string;
}

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;

      try {
        const docRef = doc(db, 'projects', projectId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProject({
            id: docSnap.id,
            title: data.title || 'Untitled Project',
            description: data.description || 'No description available',
            content: data.content || '',
            imageUrl: data.imageUrl || '',
            status: data.status || 'planning',
            category: data.category || 'ai-agriculture',
            startDate: data.startDate,
            endDate: data.endDate || null,
            teamMembers: Array.isArray(data.teamMembers) ? data.teamMembers : [],
            tags: Array.isArray(data.tags) 
              ? data.tags.map((tag: any) => 
                  typeof tag === 'string' ? { name: tag, color: 'primary' } : tag
                )
              : [],
            liveUrl: data.liveUrl || '',
            githubUrl: data.githubUrl || ''
          });
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <Section>
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-8">The project you're looking for doesn't exist or has been removed.</p>
          <Link to="/projects" className="btn btn-primary">
            Back to Projects
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
            <Link to="/projects" className="text-white/80 hover:text-white mb-4 inline-flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Projects
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="bg-white/10 px-3 py-1 rounded-full">
                {project.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
              <span>{project.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
              {project.teamMembers.length > 0 && (
                <span>• {project.teamMembers.join(', ')}</span>
              )}
              {project.startDate && (
                <span>• Started {project.startDate.toDate().toLocaleDateString()}</span>
              )}
              {project.endDate && (
                <span>• Completed {project.endDate.toDate().toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <Section>
        <div className="max-w-4xl mx-auto">
          {/* Overview */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-gray-600">{project.description}</p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            {project.imageUrl && (
              <div className="mb-8">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}
            
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          </div>

          {/* Project Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Project Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Team Members</h3>
                <div className="flex flex-wrap gap-2">
                  {project.teamMembers.map((member, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {member}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Timeline</h3>
                <p className="text-gray-600">
                  {project.startDate && `Started: ${project.startDate.toDate().toLocaleDateString()}`}
                  {project.endDate && ` • Completed: ${project.endDate.toDate().toLocaleDateString()}`}
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm ${
                  tag.color === 'primary' ? 'bg-primary-100 text-primary-800' :
                  `bg-${tag.color}-100 text-${tag.color}-800`
                }`}
              >
                {tag.name}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                View Live Project
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                View on GitHub
              </a>
            )}
          </div>
        </div>
      </Section>
    </>
  );
} 