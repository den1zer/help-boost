import React from 'react';
import { motion } from 'framer-motion';

const animations = {
  initial: { opacity: 0, x: 100 }, 
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 }, 
};

const AnimatedPage = ({ children, centerPage = false }) => {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        position: 'absolute', 
        width: '100%',
        height: '100%'
      }}
      className={centerPage ? 'page-center-container' : ''}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;