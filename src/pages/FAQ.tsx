import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus, FaSearch } from 'react-icons/fa';
import Section from '../components/ui/Section';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQ() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // FAQ data
  const faqItems: FAQItem[] = [
    {
      id: 'faq-1',
      question: 'What areas of research does SAR Lab focus on?',
      answer: 'SAR Lab focuses on several key areas including artificial intelligence, machine learning, blockchain technology, and deepfake detection. Our work spans both theoretical research and practical applications in fields such as agriculture, cybersecurity, and media authenticity.',
      category: 'general',
    },
    {
      id: 'faq-2',
      question: 'How can I collaborate with SAR Lab on research projects?',
      answer: 'We welcome collaborations with academic institutions, industry partners, and individual researchers. To initiate a collaboration, please email our partnerships team at collaborations@sarlab.edu with details about your organization and research interests.',
      category: 'collaboration',
    },
    {
      id: 'faq-3',
      question: 'Are there opportunities for students to join the lab?',
      answer: 'Yes, we regularly accept undergraduate and graduate students for research positions, internships, and thesis projects. Check our "Join Us" page for current openings or contact student-opportunities@sarlab.edu for more information.',
      category: 'opportunities',
    },
    {
      id: 'faq-4',
      question: 'Does SAR Lab publish its research openly?',
      answer: 'We are committed to open science principles and publish most of our research in peer-reviewed journals with open access options. We also share code repositories, datasets, and research tools on our GitHub page when possible.',
      category: 'research',
    },
    {
      id: 'faq-5',
      question: 'How is SAR Lab funded?',
      answer: 'Our funding comes from a combination of university support, government research grants, industry partnerships, and philanthropic donations. This diverse funding base helps us maintain independence in our research directions.',
      category: 'general',
    },
    {
      id: 'faq-6',
      question: 'Can I visit SAR Lab in person?',
      answer: 'We host regular open days and tours for interested visitors. Due to the nature of our research, some areas require prior arrangements. Please contact visits@sarlab.edu to schedule a visit or check our events calendar for upcoming open days.',
      category: 'general',
    },
    {
      id: 'faq-7',
      question: 'What software and tools does SAR Lab use in its research?',
      answer: 'We use a variety of tools depending on the specific research project. Common frameworks include TensorFlow, PyTorch, and Scikit-learn for machine learning; React, Node.js, and various blockchain platforms for technology development; and specialized tools for media analysis and deepfake detection.',
      category: 'research',
    },
    {
      id: 'faq-8',
      question: 'How does SAR Lab address ethical concerns in AI research?',
      answer: 'Ethics is central to our research approach. We have an dedicated Ethics Committee that reviews all research proposals, maintain transparency in our methods and findings, actively work to identify and mitigate bias in our systems, and regularly publish on ethical AI practices.',
      category: 'ethics',
    },
    {
      id: 'faq-9',
      question: 'Does SAR Lab offer consulting services for industry?',
      answer: 'Yes, we provide expert consulting in our areas of expertise. Our researchers can help organizations implement AI solutions, evaluate technology options, conduct security audits, or provide training for technical teams. Contact industry@sarlab.edu for details.',
      category: 'collaboration',
    },
    {
      id: 'faq-10',
      question: 'How can I stay updated on SAR Lab\'s research and events?',
      answer: 'You can subscribe to our monthly newsletter, follow us on social media platforms, or check our website\'s News section regularly. We also announce major findings and events through university press releases.',
      category: 'general',
    },
  ];
  
  // Get all unique categories
  const categories = ['all', ...new Set(faqItems.map(item => item.category))];
  
  // Toggle accordion item
  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };
  
  // Filter items based on search query and active category
  const filteredItems = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Format category name for display
  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  return (
    <>
      {/* Hero Section */}
      <div className="bg-primary-800 text-white py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-primary-100 max-w-3xl">
            Find answers to common questions about our research, collaboration opportunities, and more.
          </p>
        </div>
      </div>
      
      {/* Search & Filter Section */}
      <div className="bg-white shadow-md">
        <div className="container py-6">
          {/* Search */}
          <div className="relative max-w-2xl mx-auto mb-6">
            <input
              type="text"
              placeholder="Search questions..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <FaSearch className="text-gray-400" />
            </div>
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activeCategory === category 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
                onClick={() => setActiveCategory(category)}
              >
                {category === 'all' ? 'All Questions' : formatCategoryName(category)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* FAQ Items */}
      <Section>
        <div className="max-w-3xl mx-auto">
          {filteredItems.length > 0 ? (
            <div className="divide-y border-t border-b">
              {filteredItems.map((item) => (
                <FAQItem 
                  key={item.id} 
                  item={item} 
                  isOpen={openItems.includes(item.id)} 
                  toggle={() => toggleItem(item.id)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-xl font-semibold mb-2">No matching questions found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or selecting a different category.
              </p>
            </div>
          )}
        </div>
      </Section>
      
      {/* Still Have Questions Section */}
      <Section bgColor="bg-primary-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-8">
            If you couldn't find the answer you were looking for, feel free to contact us directly.
          </p>
          <div className="space-x-4">
            <a href="mailto:info@sarlab.edu" className="btn btn-primary">
              Email Us
            </a>
            <a href="tel:+15551234567" className="btn btn-outline">
              Call Us
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}

// FAQ Item Component
function FAQItem({ 
  item, 
  isOpen, 
  toggle 
}: { 
  item: FAQItem; 
  isOpen: boolean; 
  toggle: () => void;
}) {
  return (
    <div className="py-5">
      <button
        className="flex justify-between items-center w-full text-left focus:outline-none"
        onClick={toggle}
        aria-expanded={isOpen}
      >
        <h3 className="text-xl font-semibold text-gray-800 pr-8">{item.question}</h3>
        <span className={`flex-shrink-0 ml-2 text-primary-600 ${isOpen ? 'transform rotate-180' : ''}`}>
          {isOpen ? <FaMinus /> : <FaPlus />}
        </span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 text-gray-600">
              <p>{item.answer}</p>
              
              <div className="mt-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {formatCategoryName(item.category)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper function
function formatCategoryName(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1);
} 