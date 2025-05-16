import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';

import { db } from '../../config/firebase.config';
import { FaPlus, FaEdit, FaTrash, FaBold, FaItalic, FaUnderline } from 'react-icons/fa';

interface Research {
  id: string;
  title: string;
  abstract: string;
  content: string; // Rich text content
  imageUrl: string; // Image URL for the research
  status: 'planning' | 'in-progress' | 'completed' | 'published' | 'under-review' | 'on-hold';
  category: 'nlp' | 'vision' | 'quantum' | 'security';
  authors: string[];
  publicationDate?: Timestamp;
  pdfUrl?: string;
  tags: string[];
  createdAt: Timestamp;
  venue?: string;
  doi?: string;
}

export default function ResearchManagement() {
  const [research, setResearch] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResearch, setEditingResearch] = useState<Research | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    content: '', // Rich text content
    imageUrl: '', // Image URL
    status: 'planning' as Research['status'],
    category: 'nlp' as Research['category'],
    authors: '',
    pdfUrl: '',
    publicationDate: '',
    tags: '',
    venue: '',
    doi: ''
  });

  useEffect(() => {
    fetchResearch();
  }, []);

  const fetchResearch = async () => {
    try {
      const querySnapshot = await getDocs(collection(db!, 'research'));
      const researchData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Research[];
      setResearch(researchData);
    } catch (error) {
      console.error('Error fetching research:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormat = (command: string) => {
    document.execCommand(command, false);
    const content = document.getElementById('research-content')?.innerHTML || '';
    setFormData(prev => ({ ...prev, content }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      abstract: '',
      content: '',
      imageUrl: '',
      status: 'planning',
      category: 'nlp',
      authors: '',
      pdfUrl: '',
      publicationDate: '',
      tags: '',
      venue: '',
      doi: ''
    });
    setEditingResearch(null);
  };

  const handleEdit = (paper: Research) => {
    setEditingResearch(paper);
    setFormData({
      title: paper.title,
      abstract: paper.abstract,
      content: paper.content || '',
      imageUrl: paper.imageUrl || '',
      status: paper.status,
      category: paper.category,
      authors: paper.authors.join(', '),
      pdfUrl: paper.pdfUrl || '',
      publicationDate: paper.publicationDate ? paper.publicationDate.toDate().toISOString().split('T')[0] : '',
      tags: paper.tags.join(', '),
      venue: paper.venue || '',
      doi: paper.doi || ''
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (researchId: string) => {
    if (!window.confirm('Are you sure you want to delete this research paper?')) return;

    try {
      await deleteDoc(doc(db!, 'research', researchId));
      
      // Add activity log
      await addDoc(collection(db!, 'activities'), {
        type: 'research',
        action: 'deleted',
        timestamp: Timestamp.now(),
        user: 'Admin'
      });

      fetchResearch();
    } catch (error) {
      console.error('Error deleting research:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const researchData = {
        title: formData.title,
        abstract: formData.abstract,
        content: formData.content,
        imageUrl: formData.imageUrl,
        status: formData.status as Research['status'],
        category: formData.category as Research['category'],
        authors: formData.authors.split(',').map(author => author.trim()),
        pdfUrl: formData.pdfUrl,
        publicationDate: formData.publicationDate ? Timestamp.fromDate(new Date(formData.publicationDate)) : null,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        venue: formData.venue,
        doi: formData.doi,
        createdAt: editingResearch?.createdAt || Timestamp.now()
      };

      if (editingResearch) {
        // Update existing research
        const updateData = {
          ...researchData,
          publicationDate: researchData.publicationDate || null // Ensure null if undefined
        };
        await updateDoc(doc(db!, 'research', editingResearch.id), updateData);
        
        // Add activity log
        await addDoc(collection(db!, 'activities'), {
          type: 'research',
          action: 'updated',
          title: formData.title,
          timestamp: Timestamp.now(),
          user: 'Admin'
        });
      } else {
        // Add new research
        await addDoc(collection(db!, 'research'), researchData);
        
        // Add activity log
        await addDoc(collection(db!, 'activities'), {
          type: 'research',
          action: 'created',
          title: formData.title,
          timestamp: Timestamp.now(),
          user: 'Admin'
        });
      }

      setIsFormOpen(false);
      resetForm();
      fetchResearch();
    } catch (error) {
      console.error('Error saving research:', error);
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
        <h1 className="text-3xl font-bold text-gray-900">Research Papers</h1>
        <button
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FaPlus className="-ml-1 mr-2 h-4 w-4" />
          Add New Research
        </button>
      </div>

      {/* Research List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {research.map((paper) => (
            <li key={paper.id} className="p-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{paper.title}</h3>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      paper.status === 'published' ? 'bg-green-100 text-green-800' :
                      paper.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      paper.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      paper.status === 'planning' ? 'bg-purple-100 text-purple-800' :
                      paper.status === 'under-review' ? 'bg-orange-100 text-orange-800' :
                      paper.status === 'on-hold' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {paper.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                    <button
                      onClick={() => handleEdit(paper)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(paper.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{paper.abstract}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{paper.authors.join(', ')}</span>
                  <span>•</span>
                  <span>{paper.category}</span>
                </div>
                {paper.pdfUrl && (
                  <a
                    href={paper.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm inline-flex items-center"
                  >
                    View PDF
                  </a>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {paper.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Add/Edit Research Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-3xl my-4">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingResearch ? 'Edit Research Paper' : 'Add New Research Paper'}
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
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Abstract</label>
                    <textarea
                      name="abstract"
                      value={formData.abstract}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
                    <label className="block text-sm font-medium text-gray-700">Authors</label>
                    <input
                      type="text"
                      name="authors"
                      value={formData.authors}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="John Doe, Jane Smith"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Separate multiple authors with commas</p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    >
                      <option value="nlp">NLP</option>
                      <option value="vision">Vision</option>
                      <option value="quantum">Quantum</option>
                      <option value="security">Security</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Publication Date</label>
                    <input
                      type="date"
                      name="publicationDate"
                      value={formData.publicationDate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">PDF URL</label>
                    <input
                      type="url"
                      name="pdfUrl"
                      value={formData.pdfUrl}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="https://example.com/paper.pdf"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tags</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="AI, Education Technology"
                    />
                    <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
                  </div>
                </div>

                {/* Full Width Fields */}
                <div className="col-span-full space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Venue</label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">DOI</label>
                    <input
                      type="text"
                      name="doi"
                      value={formData.doi}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                                    <div>                    <label className="block text-sm font-medium text-gray-700 mb-1">Research Content</label>                    <div className="border rounded-md border-gray-300 shadow-sm focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500">                      <div className="flex gap-2 p-2 border-b border-gray-300 bg-gray-50">                        <button                          type="button"                          onClick={() => handleFormat('bold')}                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"                          title="Bold"                        >                          <FaBold className="w-4 h-4 text-gray-600" />                        </button>                        <button                          type="button"                          onClick={() => handleFormat('italic')}                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"                          title="Italic"                        >                          <FaItalic className="w-4 h-4 text-gray-600" />                        </button>                        <button                          type="button"                          onClick={() => handleFormat('underline')}                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"                          title="Underline"                        >                          <FaUnderline className="w-4 h-4 text-gray-600" />                        </button>                      </div>                      <div                        id="research-content"                        contentEditable                        className="p-4 h-48 focus:outline-none resize-y overflow-auto text-gray-700 leading-relaxed"                        style={{                          resize: 'vertical',                          minHeight: '120px',                          maxHeight: '600px',                          wordBreak: 'break-word',                          whiteSpace: 'pre-wrap'                        }}                        dangerouslySetInnerHTML={{ __html: formData.content }}                        onInput={(e) => {                          const content = (e.target as HTMLDivElement).innerHTML;                          setFormData(prev => ({ ...prev, content }));                        }}                        onPaste={(e) => {                          e.preventDefault();                          const text = e.clipboardData.getData('text/plain');                          document.execCommand('insertText', false, text);                        }}                      />                    </div>                    <p className="mt-1 text-xs text-gray-500">Drag the bottom edge to resize • Use formatting buttons or keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U)</p>                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {editingResearch ? 'Update Paper' : 'Add Paper'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
