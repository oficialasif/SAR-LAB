import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export default function Card({ title, children, className = '', hoverEffect = false }: CardProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden ${
        hoverEffect ? 'transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg' : ''
      } ${className}`}
    >
      {title && (
        <div className="px-6 py-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className={`${title ? 'px-6 py-4' : 'p-6'}`}>
        {children}
      </div>
    </div>
  );
} 