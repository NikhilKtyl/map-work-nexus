import React from 'react';
import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';

const PlaceholderPage: React.FC = () => {
  const location = useLocation();
  const pageName = location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-surface flex items-center justify-center mb-6">
        <Construction className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">{pageName}</h1>
      <p className="text-surface-foreground/60 text-center max-w-md">
        This module is coming soon. Check back later for updates on {pageName.toLowerCase()} management features.
      </p>
    </div>
  );
};

export default PlaceholderPage;
