import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaFlask, FaHistory, FaNewspaper, FaUsers, FaQuestionCircle, FaMicroscope, FaLock } from 'react-icons/fa';
import { IoMdClose, IoMdMenu } from 'react-icons/io';
import type { ReactElement } from 'react';

interface NavItem {
  title: string;
  path: string;
  icon: ReactElement;
  children?: { name: string; path: string }[];
}

const navItems: NavItem[] = [
  { title: 'Home', path: '/', icon: <FaHome className="text-xl" /> },
  { 
    title: 'Research Areas', 
    path: '/research', 
    icon: <FaMicroscope className="text-xl" />,
    children: [
      { name: 'Natural Language Processing', path: '/research/nlp' },
      { name: 'Computer Vision', path: '/research/vision' },
      { name: 'Quantum Computing', path: '/research/quantum' },
      { name: 'Cybersecurity', path: '/research/security' },
    ] 
  },
  { 
    title: 'Projects', 
    path: '/projects', 
    icon: <FaFlask className="text-xl" />,
    children: [
      { name: 'AI in Agriculture', path: '/projects/ai-agriculture' },
      { name: 'Blockchain', path: '/projects/blockchain' },
      { name: 'Deepfake Detection', path: '/projects/deepfake-detection' },
      { name: 'Machine Learning', path: '/projects/machine-learning' },
    ] 
  },
  { title: 'History', path: '/history', icon: <FaHistory className="text-xl" /> },
  { 
    title: 'News & Awards', 
    path: '/news', 
    icon: <FaNewspaper className="text-xl" />,
    children: [
      { name: 'News', path: '/news/latest' },
      { name: 'Events', path: '/news/events' },
      { name: 'Awards', path: '/news/awards' },
    ] 
  },
  { title: 'Team', path: '/team', icon: <FaUsers className="text-xl" /> },
  { title: 'FAQ', path: '/faq', icon: <FaQuestionCircle className="text-xl" /> },
  { title: 'Admin', path: '/admin/login', icon: <FaLock className="text-xl" /> },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  
  // Check if on mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleSubMenu = (name: string) => {
    setExpandedMenus(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name) 
        : [...prev, name]
    );
  };
  
  const isActiveLink = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const isActiveParent = (item: NavItem) => {
    if (isActiveLink(item.path)) return true;
    if (item.children) {
      return item.children.some(child => location.pathname === child.path);
    }
    return false;
  };

  // Sidebar animation variants
  const sidebarVariants = {
    open: { 
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: { 
      x: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };
  
  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="fixed z-30 top-4 left-4 md:hidden">
        <button 
          onClick={toggleMenu}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 focus:outline-none"
        >
          {isOpen ? <IoMdClose size={24} /> : <IoMdMenu size={24} />}
        </button>
      </div>
      
      {/* Sidebar Backdrop (Mobile only) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={toggleMenu}
        />
      )}
      
      {/* Sidebar */}
      <motion.aside
        className="fixed top-0 left-0 z-30 h-full w-64 bg-gray-100 shadow-lg md:shadow-md flex flex-col"
        initial={false}
        animate={isMobile ? (isOpen ? "open" : "closed") : "open"}
        variants={sidebarVariants}
      >
        {/* Logo & Lab Name */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
            SAR
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-gray-800">SAR Lab</h1>
            <p className="text-xs text-gray-500">Research & Innovation</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="p-4 flex-grow">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.title}>
                {item.children ? (
                  <div>
                    <button
                      className={`w-full flex items-center justify-between p-2 rounded-md transition-colors ${
                        isActiveParent(item) 
                          ? 'bg-gray-200 text-gray-800' 
                          : 'hover:bg-gray-200 text-gray-700'
                      }`}
                      onClick={() => toggleSubMenu(item.title)}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.title}</span>
                      </div>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          expandedMenus.includes(item.title) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    
                    {expandedMenus.includes(item.title) && (
                      <ul className="mt-1 ml-6 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.name}>
                            <NavLink
                              to={child.path}
                              className={({ isActive }) =>
                                `block p-2 rounded-md ${
                                  isActive
                                    ? 'bg-gray-200 text-gray-800'
                                    : 'hover:bg-gray-200 text-gray-700'
                                }`
                              }
                              onClick={() => {
                                if (isMobile) {
                                  setIsOpen(false);
                                }
                              }}
                            >
                              {child.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-md transition-colors ${
                        isActive
                          ? 'bg-gray-200 text-gray-800'
                          : 'hover:bg-gray-200 text-gray-700'
                      }`
                    }
                    onClick={() => {
                      if (isMobile) {
                        setIsOpen(false);
                      }
                    }}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.title}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </motion.aside>
    </>
  );
} 