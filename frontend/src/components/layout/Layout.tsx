import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from '../../context/ThemeContext';

interface LayoutProps {
  children: ReactNode;
  fullHeight?: boolean;
  useContainer?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, fullHeight = false, useContainer = false }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'dark bg-dark-bg text-dark-text' : 'bg-gray-50'}`}>
      <Navbar />
      <main className={`flex-grow w-full ${fullHeight ? 'p-0' : 'px-4 py-6'}`}>
        {useContainer ? (
          <div className="mx-auto max-w-5xl">
            <div className={`${darkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-lg shadow-sm overflow-y-auto`}>
              {children}
            </div>
          </div>
        ) : (
          <div className="w-full overflow-y-auto">
            {children}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
