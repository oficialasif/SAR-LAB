import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface HeroProps {
  title: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImage?: string;
}

export default function Hero({
  title,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  backgroundImage = 'https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
}: HeroProps) {
  return (
    <div 
      className="relative text-white overflow-hidden min-h-screen"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="container pt-24 pb-16 lg:py-32 min-h-screen flex flex-col items-center justify-center relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            {/* Main title with dark red background */}
            <div className="inline-block mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-red-900 px-6 py-3 rounded-md text-white">
                {title}
              </h1>
            </div>
            
            {/* SAR Laboratory with brackets and dark background */}
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gray-900/80 px-8 py-4 rounded-md text-white">
                [SAR Laboratory]
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-6 justify-center mt-4">
              <Link 
                to={ctaLink} 
                className="btn bg-white text-gray-800 hover:bg-gray-100 transition-colors"
              >
                {ctaText}
              </Link>
              {secondaryCtaText && secondaryCtaLink && (
                <Link 
                  to={secondaryCtaLink} 
                  className="btn border-2 border-white hover:bg-white/10 transition-colors"
                >
                  {secondaryCtaText}
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}