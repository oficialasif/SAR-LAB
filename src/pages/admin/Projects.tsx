import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

interface Tag {
  name: string;
  color?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed';
  category: 'ai-agriculture' | 'blockchain' | 'deepfake-detection' | 'machine-learning';
  startDate: Timestamp;
  endDate?: Timestamp | null;
  imageUrl?: string;
  teamMembers: string[];
  tags: (string | Tag)[];
  featured: boolean;
  createdAt: Timestamp;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'planned' as 'planned' | 'in-progress' | 'completed',
    category: 'ai-agriculture' as Project['category'],
    startDate: '',
    endDate: '',
    imageUrl: '',
    teamMembers: '',
    tags: '',
    featured: false
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
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
    } finally {
      setLoading(false);
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
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'planned',
      category: 'ai-agriculture',
      startDate: '',
      endDate: '',
      imageUrl: '',
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
      status: project.status,
      category: project.category,
      startDate: project.startDate.toDate().toISOString().split('T')[0],
      endDate: project.endDate ? project.endDate.toDate().toISOString().split('T')[0] : '',
      imageUrl: project.imageUrl || '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Form Data:', formData); // Debug log

      // Create a clean project data object
      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        category: formData.category,
        startDate: Timestamp.fromDate(new Date(formData.startDate)),
        endDate: formData.endDate ? Timestamp.fromDate(new Date(formData.endDate)) : null,
        imageUrl: formData.imageUrl.trim() || '',
        teamMembers: formData.teamMembers.split(',').map(member => member.trim()).filter(Boolean),
        tags: formData.tags.split(',').map(tag => {
          const [tagName, color] = tag.trim().split('|');
          return color ? { name: tagName.trim(), color: color.trim() } : tagName.trim();
        }).filter(Boolean),
        featured: formData.featured, // Keep as is - should be boolean from checkbox
        createdAt: editingProject?.createdAt || Timestamp.now()
      };

      console.log('Project Data to save:', {
        ...projectData,
        featured: Boolean(projectData.featured) // Log the actual boolean value
      });

      if (editingProject) {
        // Update existing project - explicitly include featured flag
        const projectRef = doc(db!, 'projects', editingProject.id);
        const updateData = {
          ...projectData,
          featured: Boolean(projectData.featured) // Ensure boolean
        };
        await updateDoc(projectRef, updateData);
        console.log('Updated project with featured:', Boolean(projectData.featured));
      } else {
        // Add new project - explicitly include featured flag
        const newProjectData = {
          ...projectData,
          featured: Boolean(projectData.featured) // Ensure boolean
        };
        const docRef = await addDoc(collection(db!, 'projects'), newProjectData);
        console.log('Added new project with ID:', docRef.id, 'featured:', Boolean(projectData.featured));
      }

      // Add activity log
      await addDoc(collection(db!, 'activities'), {
        type: 'project',
        action: editingProject ? 'updated' : 'created',
        title: formData.title,
        timestamp: Timestamp.now(),
        user: 'Admin',
        featured: Boolean(projectData.featured) // Log the featured status
      });

      setIsFormOpen(false);
      resetForm();
      await fetchProjects(); // Make sure to await this
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FaPlus className="-ml-1 mr-2 h-4 w-4" />
          Add New Project
        </button>
      </div>

      {/* Project List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {projects.map((project) => (
            <li key={project.id} className="p-6">
              <div className="flex items-center space-x-4">
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="h-16 w-16 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-500">{project.status}</p>
                      <p className="mt-1 text-sm text-gray-600">{project.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
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
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Add/Edit Project Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
                      <option value="planned">Planned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
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

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  {editingProject ? 'Update Project' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
