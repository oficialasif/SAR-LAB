import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="text-gray-800 border-t border-gray-200">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">SAR Lab</h3>
            <p className="text-gray-600 mb-4">
              Dedicated to advancing research in AI, blockchain technology, and machine learning solutions for real-world problems.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-700">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-700">
                <FaTwitter />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-700">
                <FaLinkedinIn />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-700">
                <FaGithub />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors group inline-block">
                  <span className="group-hover:translate-x-1 transition-transform inline-block">Home</span>
                </Link>
              </li>
              <li>
                <Link to="/research" className="text-gray-600 hover:text-primary-600 transition-colors group inline-block">
                  <span className="group-hover:translate-x-1 transition-transform inline-block">Research Areas</span>
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-600 hover:text-primary-600 transition-colors group inline-block">
                  <span className="group-hover:translate-x-1 transition-transform inline-block">Projects</span>
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-gray-600 hover:text-primary-600 transition-colors group inline-block">
                  <span className="group-hover:translate-x-1 transition-transform inline-block">Team</span>
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-gray-600 hover:text-primary-600 transition-colors group inline-block">
                  <span className="group-hover:translate-x-1 transition-transform inline-block">News & Events</span>
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-gray-600 hover:text-primary-600 transition-colors group inline-block">
                  <span className="group-hover:translate-x-1 transition-transform inline-block">Lab History</span>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-primary-600 transition-colors group inline-block">
                  <span className="group-hover:translate-x-1 transition-transform inline-block">FAQ</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-gray-500" />
                <span className="text-gray-600">Daffodil International University, Dahka</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-gray-500" />
                <span className="text-gray-600">017********</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-gray-500" />
                <a href="mailto:afjal.cse@diu.edu.bd" className="text-gray-600 hover:text-primary-600 transition-colors">
                  afjal.cse@diu.edu.bd
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="py-4 border-t border-gray-200">
        <div className="container text-center text-gray-500 text-sm">
          <p>© {currentYear} SAR Lab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 