import { motion } from 'framer-motion';
import { FaCalendarAlt } from 'react-icons/fa';
import Section from '../components/ui/Section';

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  highlight?: boolean;
}

export default function History() {
  // Milestones data
  const milestones: Milestone[] = [
    {
      id: 'founding',
      year: '2008',
      title: 'SAR Lab Founded',
      description: 'The lab was established with a focus on developing AI solutions for real-world problems, starting with a small team of 5 researchers.',
      highlight: true,
    },
    {
      id: 'first-grant',
      year: '2010',
      title: 'First Major Research Grant',
      description: 'Received a $1.2M grant to explore artificial intelligence applications in agricultural improvement.',
    },
    {
      id: 'first-publication',
      year: '2011',
      title: 'First Major Publication',
      description: 'Published groundbreaking research on machine learning optimization techniques in the prestigious Journal of Artificial Intelligence Research.',
    },
    {
      id: 'expansion',
      year: '2013',
      title: 'Lab Expansion',
      description: 'Doubled lab size and expanded research focus to include blockchain technologies and their applications.',
      highlight: true,
    },
    {
      id: 'industry-partnership',
      year: '2015',
      title: 'First Industry Partnership',
      description: 'Partnered with AgriTech Industries to implement AI solutions for sustainable farming practices.',
    },
    {
      id: 'international',
      year: '2017',
      title: 'International Collaboration',
      description: 'Began collaborative research projects with universities in Europe and Asia, establishing a global research network.',
    },
    {
      id: 'breakthrough',
      year: '2019',
      title: 'Deepfake Detection Breakthrough',
      description: 'Developed novel algorithms for detecting manipulated media with 95% accuracy, receiving international recognition.',
      highlight: true,
    },
    {
      id: 'award',
      year: '2021',
      title: 'Innovation Excellence Award',
      description: 'Recognized with the National Innovation Excellence Award for contributions to AI ethics and responsible technology development.',
    },
    {
      id: 'new-facility',
      year: '2023',
      title: 'New Research Facility',
      description: 'Opened a state-of-the-art research facility with dedicated spaces for AI, blockchain, and media authentication research.',
      highlight: true,
    },
    {
      id: 'present',
      year: 'Today',
      title: 'Continuing Innovation',
      description: 'Currently leading multiple cutting-edge research projects with a team of 30+ researchers, students, and industry collaborators.',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="bg-primary-800 text-white py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our History</h1>
          <p className="text-xl text-primary-100 max-w-3xl">
            Explore the journey of SAR Lab from its founding to its present status as a leading research institution.
          </p>
        </div>
      </div>
      
      {/* Timeline Section */}
      <Section>
        <div className="relative container mx-auto">
          {/* Timeline Center Line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-primary-200"></div>
          
          {/* Timeline Items */}
          {milestones.map((milestone, index) => (
            <TimelineItem 
              key={milestone.id} 
              milestone={milestone} 
              index={index} 
              isLeft={index % 2 === 0}
            />
          ))}
        </div>
      </Section>
      
      {/* Vision for the Future Section */}
      <Section bgColor="bg-primary-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Vision for the Future</h2>
          <p className="text-lg text-gray-700 mb-8">
            As we continue to grow and innovate, we remain committed to our core mission of developing
            responsible AI and technology solutions that address real-world challenges. Our vision for
            the next decade includes expanding our international collaborations, increasing open-source
            contributions, and training the next generation of ethical AI researchers and practitioners.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-primary-700">Global Impact</h3>
              <p className="text-gray-600">
                Expanding our research to address global challenges in climate change, healthcare, and education through advanced AI solutions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-primary-700">Knowledge Sharing</h3>
              <p className="text-gray-600">
                Increasing our educational outreach through open courses, workshops, and accessible publications.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-primary-700">Ethical Innovation</h3>
              <p className="text-gray-600">
                Leading the conversation on ethical AI development and responsible technology implementation.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

// Timeline Item Component
function TimelineItem({ 
  milestone, 
  index, 
  isLeft 
}: { 
  milestone: Milestone; 
  index: number; 
  isLeft: boolean;
}) {
  return (
    <div className={`flex md:contents ${isLeft ? 'flex-row-reverse' : ''}`}>
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={`relative col-start-1 col-end-5 md:mx-auto py-4 my-4 w-full ${isLeft ? 'md:mr-auto md:ml-0' : 'md:ml-auto md:mr-0'}`}
      >
        <div className={`w-full h-full rounded-md shadow-md border-l-4 ${milestone.highlight ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-white'} p-6`}>
          <div className="flex items-center mb-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${milestone.highlight ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'} mr-3`}>
              <FaCalendarAlt />
            </div>
            <div>
              <span className={`font-bold ${milestone.highlight ? 'text-primary-700' : 'text-gray-800'}`}>
                {milestone.year}
              </span>
              <h3 className="text-xl font-semibold ml-2 inline-block">{milestone.title}</h3>
            </div>
          </div>
          <p className="text-gray-600">
            {milestone.description}
          </p>
        </div>
        
        {/* Timeline Dot/Circle */}
        <div className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'} md:left-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full ${milestone.highlight ? 'bg-primary-600' : 'bg-gray-400'} border-4 border-white z-10`}></div>
      </motion.div>
    </div>
  );
} 