import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Sidebar />
      <Navbar />
      
      <main className="flex-grow md:ml-64">
        {children}
      </main>
      
      <div className="md:ml-64">
        <Footer />
      </div>
    </div>
  );
} 