import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FaCalendarAlt, FaAward, FaNewspaper, FaChalkboardTeacher } from 'react-icons/fa';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';

type ItemType = 'news' | 'event' | 'award';

interface NewsItem {
  id: string;
  type: ItemType;
  title: string;
  date: Date;
  summary: string;
  link?: string;
  image?: string;
  tags?: string[];
}

export default function News() {
  const [activeFilter, setActiveFilter] = useState<ItemType | 'all'>('all');
  
  // Dummy data for news, events, and awards
  const newsItems: NewsItem[] = [
    {
      id: 'news-1',
      type: 'news',
      title: 'New Research Partnership with European Technology Institute',
      date: new Date('2023-11-15'),
      summary: 'SAR Lab announces a new international partnership to advance AI research in climate change prediction.',
      image: 'https://placehold.co/600x400/e9f5e9/1c4d1c?text=Partnership',
      tags: ['International', 'Climate AI', 'Research'],
    },
    {
      id: 'news-2',
      type: 'news',
      title: 'Lab Publishes Breakthrough in Ethical AI Development',
      date: new Date('2023-10-02'),
      summary: 'New paper in Nature AI presents framework for addressing bias in machine learning models.',
      image: 'https://placehold.co/600x400/e9f5e9/1c4d1c?text=Publication',
      tags: ['Ethics', 'Publication', 'ML Models'],
    },
    {
      id: 'news-3',
      type: 'news',
      title: 'SAR Lab Researchers Features in Science Today Magazine',
      date: new Date('2023-09-18'),
      summary: 'Our work on agricultural AI solutions was highlighted in this month\'s issue of Science Today.',
      image: 'https://placehold.co/600x400/e9f5e9/1c4d1c?text=Magazine',
      tags: ['Media', 'AgriTech', 'Recognition'],
    },
    {
      id: 'event-1',
      type: 'event',
      title: 'Annual AI Ethics Symposium',
      date: new Date('2023-12-10'),
      summary: 'Join us for a day of discussions and presentations on the ethical implications of AI in society.',
      image: 'https://placehold.co/600x400/e6f7ff/0050b3?text=Symposium',
      tags: ['Ethics', 'Conference', 'Upcoming'],
    },
    {
      id: 'event-2',
      type: 'event',
      title: 'Workshop: Introduction to Machine Learning in Agriculture',
      date: new Date('2023-11-25'),
      summary: 'A hands-on workshop for agricultural professionals interested in implementing AI solutions.',
      image: 'https://placehold.co/600x400/e6f7ff/0050b3?text=Workshop',
      tags: ['Workshop', 'AgriTech', 'Education'],
    },
    {
      id: 'event-3',
      type: 'event',
      title: 'Guest Lecture: The Future of Blockchain in Research',
      date: new Date('2023-10-15'),
      summary: 'Distinguished Professor Alex Rivera will discuss emerging blockchain applications in scientific research.',
      image: 'https://placehold.co/600x400/e6f7ff/0050b3?text=Lecture',
      tags: ['Lecture', 'Blockchain', 'Open to Public'],
    },
    {
      id: 'award-1',
      type: 'award',
      title: 'National Science Foundation Excellence in Research Award',
      date: new Date('2023-09-05'),
      summary: 'SAR Lab received this prestigious award for contributions to sustainable technology development.',
      image: 'https://placehold.co/600x400/fff5e9/8b4000?text=Award',
      tags: ['National', 'Recognition', 'Sustainability'],
    },
    {
      id: 'award-2',
      type: 'award',
      title: 'Dr. Sophia Chen Named to AI Innovators List',
      date: new Date('2023-08-22'),
      summary: 'Our very own Dr. Chen was recognized as one of the top 50 innovators in artificial intelligence.',
      image: 'https://placehold.co/600x400/fff5e9/8b4000?text=Innovator',
      tags: ['Faculty', 'Recognition', 'AI'],
    },
    {
      id: 'award-3',
      type: 'award',
      title: 'Best Paper Award at International Conference on ML Applications',
      date: new Date('2023-07-12'),
      summary: 'Research team led by Dr. Johnson awarded for their paper on reinforcement learning.',
      image: 'https://placehold.co/600x400/fff5e9/8b4000?text=Paper+Award',
      tags: ['Publication', 'Conference', 'Machine Learning'],
    },
  ];
  
  // Filter news items based on active filter
  const filteredItems = activeFilter === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.type === activeFilter);
  
  // Sort by date (most recent first)
  const sortedItems = [...filteredItems].sort((a, b) => b.date.getTime() - a.date.getTime());
  
  return (
    <>
      {/* Hero Section */}
      <div className="bg-primary-800 text-white py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Awards</h1>
          <p className="text-xl text-primary-100 max-w-3xl">
            Stay up to date with the latest news, upcoming events, and recent recognitions from SAR Lab.
          </p>
        </div>
      </div>
      
      {/* Filter Tabs */}
      <div className="bg-white shadow-md">
        <div className="container py-4">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { id: 'all', label: 'All Updates' },
              { id: 'news', label: 'News', icon: <FaNewspaper /> },
              { id: 'event', label: 'Events', icon: <FaChalkboardTeacher /> },
              { id: 'award', label: 'Awards', icon: <FaAward /> },
            ].map((filter) => (
              <button
                key={filter.id}
                className={`px-4 py-2 rounded-full text-sm font-medium inline-flex items-center ${
                  activeFilter === filter.id 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
                onClick={() => setActiveFilter(filter.id as any)}
              >
                {filter.icon && <span className="mr-2">{filter.icon}</span>}
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* News Items Grid */}
      <Section>
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedItems.map((item, index) => (
              <NewsCard key={item.id} item={item} index={index} />
            ))}
          </div>
          
          {sortedItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No items found for the selected filter.</p>
            </div>
          )}
        </motion.div>
      </Section>
      
      {/* Newsletter CTA */}
      <Section bgColor="bg-primary-700" className="text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
          <p className="text-primary-100 mb-8">
            Subscribe to our newsletter to receive the latest updates on research, events, and opportunities.
          </p>
          
          <form className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-md text-gray-800 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary-600 text-white rounded-md border border-primary-500 hover:bg-primary-500 transition-colors"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </Section>
    </>
  );
}

// News Card Component
function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col" hoverEffect>
        {item.image && (
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 right-0 bg-white rounded-bl-lg px-3 py-1 m-2">
              <div className="flex items-center">
                {getItemTypeIcon(item.type)}
                <span className="ml-1 text-sm font-medium text-gray-600">
                  {formatItemType(item.type)}
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-6 flex-grow flex flex-col">
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <FaCalendarAlt className="mr-1" />
            <span>{format(item.date, 'MMM d, yyyy')}</span>
          </div>
          
          <h3 className="text-xl font-semibold mb-3 text-gray-800">{item.title}</h3>
          <p className="text-gray-600 mb-4 flex-grow">{item.summary}</p>
          
          {item.tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {item.tags.map((tag) => (
                <span 
                  key={tag}
                  className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {item.link && (
            <Link 
              to={item.link} 
              className="text-primary-600 font-medium hover:text-primary-800 inline-flex items-center mt-auto"
            >
              Read more
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

// Helper functions
function getItemTypeIcon(type: ItemType) {
  switch (type) {
    case 'news':
      return <FaNewspaper className="text-blue-600" />;
    case 'event':
      return <FaChalkboardTeacher className="text-green-600" />;
    case 'award':
      return <FaAward className="text-orange-600" />;
  }
}

function formatItemType(type: ItemType) {
  switch (type) {
    case 'news':
      return 'News';
    case 'event':
      return 'Event';
    case 'award':
      return 'Award';
  }
} 