interface Tag {
  name: string;
  color: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  tags: Tag[];
  link: string;
}

interface ProjectCategory {
  id: string;
  name: string;
  projects: Project[];
}

export const projectCategories: ProjectCategory[] = [
  {
    id: 'ai-agriculture',
    name: 'AI in Agriculture',
    projects: [
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
      }
    ]
  },
  {
    id: 'blockchain',
    name: 'Blockchain Applications',
    projects: [
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
      }
    ]
  },
  {
    id: 'deepfake-detection',
    name: 'Deepfake Detection',
    projects: [
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
      }
    ]
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    projects: [
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
      }
    ]
  }
];

// Helper function to get featured projects
export const getFeaturedProjects = (): Project[] => {
  return [
    projectCategories.find(c => c.id === 'ai-agriculture')?.projects[0],
    projectCategories.find(c => c.id === 'blockchain')?.projects[0],
    projectCategories.find(c => c.id === 'deepfake-detection')?.projects[0],
  ].filter((project): project is Project => project !== undefined);
};

// Helper function to get all projects
export const getAllProjects = (): Project[] => {
  return projectCategories.flatMap(category => category.projects);
};

// Helper function to get projects by category
export const getProjectsByCategory = (categoryId: string): Project[] => {
  return projectCategories.find(c => c.id === categoryId)?.projects || [];
};

export type { Project, Tag, ProjectCategory }; 