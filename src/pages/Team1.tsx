import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLinkedinIn, FaTwitter, FaGithub, FaGlobe, FaArrowRight, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';

type TeamMember = {
  id: string;
  name: string;
  title: string;
  role: 'faculty' | 'student' | 'collaborator';
  bio: string;
  photo: string;
  links?: {
    email?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
};

// Helper function to extract position and field from title
const extractPositionAndField = (title: string): { position: string; field: string } => {
  const parts = title.split(',');
  return {
    position: parts[0].trim(),
    field: parts.length > 1 ? parts[1].trim() : ''
  };
};

export default function Team() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'faculty' | 'student' | 'collaborator'>('all');
  
  // Team members data
  const teamMembers: TeamMember[] = [
    {
      id: 'dr-james-smith',
      name: 'Dr. James Smith',
      title: 'Lab Director, Professor of Computer Science',
      role: 'faculty',
      bio: 'Leading expert in artificial intelligence with over 15 years of experience in machine learning research and applications.',
      photo: 'https://placehold.co/300x300/e4efe4/1f3f1f?text=JS',
      links: {
        email: 'jsmith@sarlab.edu',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        website: 'https://example.com',
      },
    },
    {
      id: 'dr-sophia-chen',
      name: 'Dr. Sophia Chen',
      title: 'Associate Professor, AI Ethics Specialist',
      role: 'faculty',
      bio: 'Specializes in the ethical implications of AI systems and ensuring responsible development of technology.',
      photo: 'https://placehold.co/300x300/e4efe4/1f3f1f?text=SC',
      links: {
        email: 'schen@sarlab.edu',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com',
      },
    },
    {
      id: 'dr-marcus-johnson',
      name: 'Dr. Marcus Johnson',
      title: 'Assistant Professor, Blockchain Researcher',
      role: 'faculty',
      bio: 'Blockchain specialist focusing on decentralized systems, cryptography, and secure transaction protocols.',
      photo: 'https://placehold.co/300x300/e4efe4/1f3f1f?text=MJ',
      links: {
        email: 'mjohnson@sarlab.edu',
        github: 'https://github.com',
        website: 'https://example.com',
      },
    },
    {
      id: 'alex-rivera',
      name: 'Alex Rivera',
      title: 'PhD Candidate, Computer Vision',
      role: 'student',
      bio: 'Researching advanced computer vision techniques for deepfake detection and media authentication.',
      photo: 'https://placehold.co/300x300/e4efe4/1f3f1f?text=AR',
      links: {
        email: 'arivera@sarlab.edu',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com',
      },
    },
    {
      id: 'priya-patel',
      name: 'Priya Patel',
      title: 'PhD Student, NLP Specialist',
      role: 'student',
      bio: 'Working on improving language understanding in AI systems through advanced transformer architectures.',
      photo: 'https://placehold.co/300x300/e4efe4/1f3f1f?text=PP',
      links: {
        email: 'ppatel@sarlab.edu',
        twitter: 'https://twitter.com',
        github: 'https://github.com',
      },
    },
    {
      id: 'david-kim',
      name: 'David Kim',
      title: 'Masters Student, Agricultural AI',
      role: 'student',
      bio: 'Developing machine learning solutions for precision agriculture and sustainable farming practices.',
      photo: 'https://placehold.co/300x300/e4efe4/1f3f1f?text=DK',
      links: {
        email: 'dkim@sarlab.edu',
        linkedin: 'https://linkedin.com',
      },
    },
    {
      id: 'dr-elena-rodriguez',
      name: 'Dr. Elena Rodriguez',
      title: 'Industry Advisor, AgriTech Co.',
      role: 'collaborator',
      bio: 'Bridges academic research with industry applications, specializing in agricultural technology implementation.',
      photo: 'https://placehold.co/300x300/e4efe4/1f3f1f?text=ER',
      links: {
        email: 'erodriguez@agritech.com',
        linkedin: 'https://linkedin.com',
        website: 'https://agritech.com',
      },
    },
    {
      id: 'tom-nguyen',
      name: 'Tom Nguyen',
      title: 'Research Partner, Cyber Security Institute',
      role: 'collaborator',
      bio: 'Security expert providing insights on protecting AI systems from vulnerabilities and attacks.',
      photo: 'https://placehold.co/300x300/e4efe4/1f3f1f?text=TN',
      links: {
        email: 'tnguyen@csi.org',
        twitter: 'https://twitter.com',
        github: 'https://github.com',
      },
    },
  ];
  
  // Filter team members based on active filter
  const filteredMembers = activeFilter === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => member.role === activeFilter);
  
  return (
    <>
      {/* Hero Section */}
      <div className="bg-primary-800 text-white py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Team</h1>
          <p className="text-xl text-primary-100 max-w-3xl">
            Meet the brilliant minds behind our research initiatives, from faculty leaders to student 
            researchers and industry collaborators.
          </p>
        </div>
      </div>
      
      {/* Filter Tabs */}
      <div className="bg-white shadow-md">
        <div className="container py-2">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {['all', 'faculty', 'student', 'collaborator'].map((filter) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeFilter === filter 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
                onClick={() => setActiveFilter(filter as any)}
              >
                {filter === 'all' ? 'All Members' : `${filter.charAt(0).toUpperCase() + filter.slice(1)}s`}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Team Members Grid */}
      <Section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredMembers.map((member, index) => (
            <TeamMemberCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </Section>
      
      {/* Join Us CTA */}
      <Section bgColor="bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
          <p className="text-gray-600 mb-8">
            We're always looking for passionate researchers, students, and collaborators to join our team.
            If you're interested in our research areas, we'd love to hear from you.
          </p>
          <div className="space-x-4">
            <a href="/opportunities" className="btn btn-primary">
              View Opportunities
            </a>
            <a href="mailto:join@sarlab.edu" className="btn btn-outline">
              Contact Us
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}

// Team Member Card Component
function TeamMemberCard({ member, index }: { member: TeamMember; index: number }) {
  const { position, field } = extractPositionAndField(member.title);
  
  // Get field-specific color
  const getFieldColor = (field: string): string => {
    const fieldLower = field.toLowerCase();
    if (fieldLower.includes('vision') || fieldLower.includes('computer vision')) return 'bg-blue-100 text-blue-700';
    if (fieldLower.includes('nlp') || fieldLower.includes('language')) return 'bg-purple-100 text-purple-700';
    if (fieldLower.includes('ai') || fieldLower.includes('intelligence')) return 'bg-green-100 text-green-700';
    if (fieldLower.includes('blockchain')) return 'bg-yellow-100 text-yellow-700';
    if (fieldLower.includes('security') || fieldLower.includes('cyber')) return 'bg-red-100 text-red-700';
    if (fieldLower.includes('ethics')) return 'bg-indigo-100 text-indigo-700';
    if (fieldLower.includes('professor')) return 'bg-gray-100 text-gray-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white shadow rounded-lg overflow-hidden h-auto hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col h-full">
        {/* Compact Card Layout */}
        <div className="relative">
          {/* Image */}
          <div className="h-32 overflow-hidden">
            <img 
              src={member.photo} 
              alt={member.name} 
              className="w-full h-full object-cover"
            />
            
            {/* Hover Overlay with Social Links */}
            <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex space-x-2">
                {member.links?.email && (
                  <a 
                    href={`mailto:${member.links.email}`} 
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                    aria-label={`Email ${member.name}`}
                  >
                    <FaEnvelope size={16} />
                  </a>
                )}
                {member.links?.linkedin && (
                  <a 
                    href={member.links.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                    aria-label={`${member.name}'s LinkedIn profile`}
                  >
                    <FaLinkedinIn size={16} />
                  </a>
                )}
                {member.links?.twitter && (
                  <a 
                    href={member.links.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                    aria-label={`${member.name}'s Twitter profile`}
                  >
                    <FaTwitter size={16} />
                  </a>
                )}
                {member.links?.github && (
                  <a 
                    href={member.links.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                    aria-label={`${member.name}'s GitHub profile`}
                  >
                    <FaGithub size={16} />
                  </a>
                )}
                {member.links?.website && (
                  <a 
                    href={member.links.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                    aria-label={`${member.name}'s website`}
                  >
                    <FaGlobe size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Compact Text Content */}
        <div className="p-3">
          <h3 className="text-gray-800 font-semibold text-sm">{member.name}</h3>
          <p className="text-gray-600 text-xs mb-1">{position}</p>
          {field && (
            <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${getFieldColor(field)}`}>
              {field}
            </span>
          )}
          
          {/* Truncated Bio */}
          <p className="text-gray-500 text-xs mt-2 line-clamp-2">
            {member.bio}
          </p>

          {/* View Profile Link */}
          <Link 
            to={`/team/${member.id}`} 
            className="text-primary-600 text-xs font-medium flex items-center mt-2 hover:underline"
            onClick={(e) => {
              // Prevent navigation since this is just a demo
              e.preventDefault();
              alert(`Full profile for ${member.name} would open here.`);
            }}
          >
            View Profile 
            <FaArrowRight className="ml-1" size={10} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 