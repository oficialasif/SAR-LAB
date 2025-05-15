// Project data
export const projectsData = {
  'ai-agriculture': [
    {
      id: 'crop-yield-prediction',
      title: 'Crop Yield Prediction',
      description: 'Utilizing machine learning models and satellite imagery to predict crop yields with high accuracy.',
      imageSrc: 'https://placehold.co/600x400/e9f5e9/1c4d1c?text=Crop+Yield',
      tags: [
        { name: 'AI', color: 'blue' },
        { name: 'Machine Learning', color: 'purple' },
        { name: 'Satellite Imagery', color: 'green' },
      ],
      link: '/projects/ai-agriculture/crop-yield-prediction',
      date: '2023-09-15', // Adding dates to determine which are latest
    },
    {
      id: 'smart-irrigation',
      title: 'Smart Irrigation Systems',
      description: 'IoT-based precision irrigation systems that reduce water usage by targeting specific plant needs.',
      imageSrc: 'https://placehold.co/600x400/e9f5e9/1c4d1c?text=Smart+Irrigation',
      tags: [
        { name: 'IoT', color: 'blue' },
        { name: 'Sustainability', color: 'green' },
        { name: 'Water Conservation', color: 'primary' },
      ],
      link: '/projects/ai-agriculture/smart-irrigation',
      date: '2023-07-22',
    },
  ],
  'blockchain': [
    {
      id: 'supply-chain',
      title: 'Blockchain Supply Chain',
      description: 'Transparent tracking of agricultural products from farm to table using distributed ledger technology.',
      imageSrc: 'https://placehold.co/600x400/f0f0ff/1a1a7c?text=Supply+Chain',
      tags: [
        { name: 'Blockchain', color: 'purple' },
        { name: 'Traceability', color: 'blue' },
        { name: 'Security', color: 'red' },
      ],
      link: '/projects/blockchain/supply-chain',
      date: '2023-06-10',
    },
    {
      id: 'voting-systems',
      title: 'Secure Voting Systems',
      description: 'Implementing tamper-proof voting solutions through blockchain consensus mechanisms.',
      imageSrc: 'https://placehold.co/600x400/f0f0ff/1a1a7c?text=Voting+Systems',
      tags: [
        { name: 'Blockchain', color: 'purple' },
        { name: 'Security', color: 'red' },
        { name: 'Governance', color: 'blue' },
      ],
      link: '/projects/blockchain/voting-systems',
      date: '2023-08-05',
    },
  ],
  'deepfake-detection': [
    {
      id: 'audio-detection',
      title: 'Audio Deepfake Detection',
      description: 'Algorithms to identify artificially generated or manipulated voice recordings.',
      imageSrc: 'https://placehold.co/600x400/fff5e9/8b4000?text=Audio+Detection',
      tags: [
        { name: 'Audio Processing', color: 'orange' },
        { name: 'Machine Learning', color: 'purple' },
        { name: 'Media Forensics', color: 'red' },
      ],
      link: '/projects/deepfake-detection/audio-detection',
      date: '2023-10-30', // One of the newest
    },
    {
      id: 'video-analysis',
      title: 'Video Deepfake Analysis',
      description: 'Advanced computer vision techniques to detect manipulated facial expressions and movements in videos.',
      imageSrc: 'https://placehold.co/600x400/fff5e9/8b4000?text=Video+Analysis',
      tags: [
        { name: 'Computer Vision', color: 'blue' },
        { name: 'Neural Networks', color: 'purple' },
        { name: 'Media Authentication', color: 'green' },
      ],
      link: '/projects/deepfake-detection/video-analysis',
      date: '2023-05-17',
    },
  ],
  'machine-learning': [
    {
      id: 'nlp-research',
      title: 'Natural Language Processing',
      description: 'Research on language understanding, generation, and translation using transformer architectures.',
      imageSrc: 'https://placehold.co/600x400/e6f7ff/0050b3?text=NLP+Research',
      tags: [
        { name: 'NLP', color: 'blue' },
        { name: 'Transformers', color: 'purple' },
        { name: 'Language AI', color: 'primary' },
      ],
      link: '/projects/machine-learning/nlp-research',
      date: '2023-11-12', // One of the newest
    },
    {
      id: 'reinforcement-learning',
      title: 'Reinforcement Learning',
      description: 'Developing algorithms that learn through interaction with environments to optimize decision-making.',
      imageSrc: 'https://placehold.co/600x400/e6f7ff/0050b3?text=Reinforcement+Learning',
      tags: [
        { name: 'RL', color: 'blue' },
        { name: 'Decision Systems', color: 'green' },
        { name: 'Game Theory', color: 'orange' },
      ],
      link: '/projects/machine-learning/reinforcement-learning',
      date: '2023-12-05', // Newest project
    },
  ],
};

export type ProjectType = {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  tags: {
    name: string;
    color: string;
  }[];
  link: string;
  date: string;
  category?: string;
};

export type CategoryKeys = keyof typeof projectsData;

// Get all projects from all categories as a flat array
export const getAllProjects = (): ProjectType[] => {
  const allProjects: ProjectType[] = [];
  
  Object.entries(projectsData).forEach(([category, projects]) => {
    projects.forEach(project => {
      allProjects.push({
        ...project,
        category
      });
    });
  });
  
  return allProjects;
};

// Get the latest 3 projects based on date
export const getLatestProjects = (count: number = 3): ProjectType[] => {
  const allProjects = getAllProjects();
  
  // Sort by date (newest first)
  return allProjects
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
};

// Get projects by category
export const getProjectsByCategory = (category: CategoryKeys): ProjectType[] => {
  return projectsData[category] || [];
};

// Get all categories
export const getAllCategories = (): CategoryKeys[] => {
  return Object.keys(projectsData) as CategoryKeys[];
};

// Format category name for display (e.g., "ai-agriculture" to "Ai Agriculture")
export const formatCategoryName = (category: string): string => {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}; 