import type { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  bgColor?: string;
  fullWidth?: boolean;
}

export default function Section({
  id,
  title,
  subtitle,
  children,
  className = '',
  bgColor = 'bg-white',
  fullWidth = false,
}: SectionProps) {
  return (
    <section id={id} className={`section ${bgColor} ${className}`}>
      <div className={fullWidth ? 'w-full' : 'container'}>
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && <h2 className="mb-4">{title}</h2>}
            {subtitle && <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
} 