
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full py-4 px-4 bg-white shadow-sm mb-6"
    >
      <div className="container mx-auto flex justify-center items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/5736fc7e-042d-4b14-a809-d95a54299a26.png" 
            alt="VIVO Logo" 
            className="h-12 sm:h-16" 
          />
        </Link>
      </div>
    </motion.header>
  );
};

export default Header;
