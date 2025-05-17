import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, Timestamp, getDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase.config';
import { FaPlus, FaEdit, FaTrash, FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

interface Tag {
  name: string;
  color?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  content: string; // Rich text content
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

interface FormError {
  field: string;
  message: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [errors, setErrors] = useState<FormError[]>([]);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '', // Rich text content
    status: 'planning' as 'planning' | 'in-progress' | 'completed' | 'published' | 'under-review' | 'on-hold',
    category: 'ai-agriculture' as Project['category'],
    startDate: '',
    endDate: '',
    imageUrl: '',
    liveUrl: '',
    githubUrl: '',
    teamMembers: '',
    tags: '',
    featured: false
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/admin/login');
        return;
      }
      
      // Check if user is admin
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists() || userDoc.data()?.role !== 'admin') {
          console.error('User does not have admin privileges');
          navigate('/admin/login');
          return;
        }
        fetchProjects();
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/admin/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching projects...');
      const projectsRef = collection(db, 'projects');
      const querySnapshot = await getDocs(projectsRef);
      console.log('Found', querySnapshot.size, 'projects');
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setErrors([{ field: 'fetch', message: 'Failed to fetch projects' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // Clear error for this field if it exists
    setErrors(prev => prev.filter(error => error.field !== name));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      status: 'planning',
      category: 'ai-agriculture',
      startDate: '',
      endDate: '',
      imageUrl: '',
      liveUrl: '',
      githubUrl: '',
      teamMembers: '',
      tags: '',
      featured: false
    });
    setEditingProject(null);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      content: project.content,
      status: project.status,
      category: project.category,
      startDate: project.startDate.toDate().toISOString().split('T')[0],
      endDate: project.endDate ? project.endDate.toDate().toISOString().split('T')[0] : '',
      imageUrl: project.imageUrl || '',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      teamMembers: project.teamMembers.join(', '),
      tags: project.tags.map(tag => 
        typeof tag === 'string' ? tag : `${tag.name}|${tag.color || ''}`
      ).join(', '),
      featured: project.featured || false
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await deleteDoc(doc(db, 'projects', projectId));
      
      // Add activity log
      await addDoc(collection(db, 'activities'), {
        type: 'project',
        action: 'deleted',
        timestamp: Timestamp.now(),
        user: 'Admin'
      });

      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleFormat = (command: string) => {
    document.execCommand(command, false);
    const contentDiv = document.getElementById('project-content');
    if (contentDiv) {
      setFormData(prev => ({ ...prev, content: contentDiv.innerHTML }));
    }
  };

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;
    setFormData(prev => ({ ...prev, content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const contentDiv = document.getElementById('project-content');
      const content = contentDiv ? contentDiv.innerHTML : formData.content;

      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: content,
        status: formData.status,
        category: formData.category,
        startDate: Timestamp.fromDate(new Date(formData.startDate)),
        endDate: formData.endDate ? Timestamp.fromDate(new Date(formData.endDate)) : null,
        imageUrl: formData.imageUrl.trim() || '',
        liveUrl: formData.liveUrl.trim() || '',
        githubUrl: formData.githubUrl.trim() || '',
        teamMembers: formData.teamMembers.split(',').map(member => member.trim()).filter(Boolean),
        tags: formData.tags.split(',')
          .map(tag => tag.trim())
          .filter(Boolean)
          .map(tag => {
            const [tagName, color] = tag.split('|');
            return {
              name: tagName.trim(),
              color: color?.trim() || 'primary'
            };
          }),
        featured: formData.featured,
        createdAt: editingProject?.createdAt || Timestamp.now()
      };

      if (editingProject) {
        // Update existing project
        const projectRef = doc(db, 'projects', editingProject.id);
        await updateDoc(projectRef, {
          ...projectData,
          endDate: projectData.endDate || null
        });
        
        setProjects(prevProjects => 
          prevProjects.map(project => 
            project.id === editingProject.id 
              ? { ...project, ...projectData }
              : project
          )
        );
        
        await addDoc(collection(db, 'activities'), {
          type: 'project',
          action: 'updated',
          title: formData.title,
          timestamp: Timestamp.now(),
          user: 'Admin'
        });

        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setIsFormOpen(false);
          resetForm();
        }, 2000);
      } else {
        // Add new project
        const docRef = await addDoc(collection(db, 'projects'), {
          ...projectData,
          endDate: projectData.endDate || null
        });
        
        const newProject = {
          ...projectData,
          id: docRef.id
        };
        setProjects(prevProjects => [newProject, ...prevProjects]);
        
        await addDoc(collection(db, 'activities'), {
          type: 'project',
          action: 'created',
          title: formData.title,
          timestamp: Timestamp.now(),
          user: 'Admin'
        });

        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setIsFormOpen(false);
          resetForm();
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Projects</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
        >
          <FaPlus className="mr-2" /> Add New Project
        </button>
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <ul className="list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in-out">
          Project saved successfully!
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {projects.map((project) => (
                <li key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start space-x-4">
                      {project.imageUrl && (
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="h-24 w-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                project.status === 'published' ? 'bg-green-100 text-green-800' :
                                project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                project.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                project.status === 'planning' ? 'bg-purple-100 text-purple-800' :
                                project.status === 'under-review' ? 'bg-orange-100 text-orange-800' :
                                project.status === 'on-hold' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {project.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </span>
                              {project.featured && (
                                <span className="bg-primary-100 text-primary-800 px-2 py-1 text-xs font-medium rounded-full">
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="mt-2 text-sm text-gray-600">{project.description}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(project)}
                              className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-full transition-colors"
                              title="Edit project"
                            >
                              <FaEdit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(project.id)}
                              className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-full transition-colors"
                              title="Delete project"
                            >
                              <FaTrash className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                          {project.tags.map((tag, index) => {
                            const tagObj = typeof tag === 'string' ? { name: tag } : tag;
                            return (
                              <span 
                                key={index} 
                                className={`px-2 py-1 text-xs rounded-full ${
                                  tagObj.color 
                                    ? `bg-${tagObj.color}-100 text-${tagObj.color}-800` 
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {tagObj.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
                          >
                            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            Live Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
                          >
                            <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            GitHub
                          </a>
                        )}
                      </div>
                      <a
                        href={`/projects/${project.id}`}
                        className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors"
                      >
                        Learn more
                        <svg 
                          className="w-4 h-4 ml-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Add/Edit Project Form Modal */}
          {isFormOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center overflow-y-auto">
              <div className="bg-white rounded-lg max-w-3xl w-full my-8 mx-4">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingProject ? 'Edit Project' : 'Add New Project'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      resetForm();
                      setErrors([]);
                      setSubmitStatus('idle');
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
                  {/* Error Display */}
                  {errors.length > 0 && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                      <ul className="list-disc list-inside">
                        {errors.map((error, index) => (
                          <li key={index}>{error.message}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Title</label>
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status</label>
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                            required
                          >
                            <option value="planning">Planning</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="under-review">Under Review</option>
                            <option value="published">Published</option>
                            <option value="on-hold">On Hold</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Category</label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                            required
                          >
                            <option value="ai-agriculture">AI & Agriculture</option>
                            <option value="blockchain">Blockchain</option>
                            <option value="deepfake-detection">Deepfake Detection</option>
                            <option value="machine-learning">Machine Learning</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input
                              type="date"
                              name="startDate"
                              value={formData.startDate}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <input
                              type="date"
                              name="endDate"
                              value={formData.endDate}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Image URL</label>
                          <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Team Members</label>
                          <input
                            type="text"
                            name="teamMembers"
                            value={formData.teamMembers}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                            placeholder="John Doe, Jane Smith"
                          />
                          <p className="mt-1 text-sm text-gray-500">Separate multiple members with commas</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Tags</label>
                          <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                            placeholder="AI, Machine Learning"
                          />
                          <p className="mt-1 text-sm text-gray-500">Separate tags with commas. For colored tags, use format: tag|color (e.g., AI|blue)</p>
                        </div>

                        <div className="flex items-center">
                          <label className="text-sm font-medium text-gray-700 mr-2">Featured Project</label>
                          <input
                            type="checkbox"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Content Editor with Formatting Controls */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Content</label>
                      <div className="mb-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleFormat('bold')}
                          className="p-2 text-gray-600 hover:text-gray-900"
                        >
                          <FaBold />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFormat('italic')}
                          className="p-2 text-gray-600 hover:text-gray-900"
                        >
                          <FaItalic />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFormat('underline')}
                          className="p-2 text-gray-600 hover:text-gray-900"
                        >
                          <FaUnderline />
                        </button>
                      </div>
                      <div
                        id="project-content"
                        contentEditable
                        suppressContentEditableWarning
                        onInput={handleContentChange}
                        dangerouslySetInnerHTML={{ __html: formData.content }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 min-h-[200px] p-3 overflow-y-auto"
                        style={{ border: '1px solid #D1D5DB' }}
                      />
                    </div>

                    {/* URL fields */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Live Project URL</label>
                      <input
                        type="url"
                        name="liveUrl"
                        value={formData.liveUrl}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
                      <input
                        type="url"
                        name="githubUrl"
                        value={formData.githubUrl}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                        placeholder="https://github.com/username/repo"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setIsFormOpen(false);
                        resetForm();
                        setErrors([]);
                        setSubmitStatus('idle');
                      }}
                      disabled={submitStatus === 'loading'}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitStatus === 'loading'}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {submitStatus === 'loading' ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {editingProject ? 'Updating...' : 'Adding...'}
                        </>
                      ) : (
                        editingProject ? 'Update Project' : 'Add Project'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
