import React from 'react';
import { BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            <span className="text-lg font-bold">CampusMart</span>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-300 text-sm">
              © 2024 CampusMart. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;