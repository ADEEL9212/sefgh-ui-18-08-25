/**
 * Core Animation Library for Cosmic Harmony Theme
 * Comprehensive animation system with Framer Motion variants
 */

import { Variants } from 'framer-motion';

// ===============================
// ENTRANCE ANIMATIONS
// ===============================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } }
};

export const slideInFromBottom: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

export const slideInFromTop: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

export const slideInFromLeft: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5 } }
};

export const slideInFromRight: Variants = {
  hidden: { x: 20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5 } }
};

export const scaleIn: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.4 } }
};

// ===============================
// STAGGERED ANIMATIONS
// ===============================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export const staggerChild: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

// ===============================
// HOVER ANIMATIONS
// ===============================

export const pulseOnHover = {
  initial: {},
  hover: { scale: 1.02, transition: { duration: 0.2 } }
};

export const glowOnHover = {
  initial: { boxShadow: '0 0 0 rgba(108, 92, 231, 0)' },
  hover: { boxShadow: '0 0 15px rgba(108, 92, 231, 0.5)', transition: { duration: 0.3 } }
};

export const liftOnHover = {
  initial: { y: 0, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' },
  hover: { 
    y: -2, 
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)', 
    transition: { duration: 0.2 } 
  }
};

// ===============================
// MICRO-INTERACTIONS
// ===============================

export const buttonTap = {
  tap: { scale: 0.97, transition: { duration: 0.1 } }
};

export const buttonPress = {
  initial: { scale: 1 },
  tap: { scale: 0.95, transition: { duration: 0.1, ease: "easeInOut" } }
};

// ===============================
// LOADING ANIMATIONS
// ===============================

export const spin: Variants = {
  animate: { rotate: 360, transition: { duration: 1, repeat: Infinity, ease: "linear" } }
};

export const pulse: Variants = {
  animate: { 
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
  }
};

export const bounce: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
  }
};

// ===============================
// PAGE TRANSITIONS
// ===============================

export const pageTransition: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      duration: 0.5, 
      when: "beforeChildren", 
      staggerChildren: 0.2 
    } 
  },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

export const slidePageTransition: Variants = {
  hidden: { x: 20, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { 
      duration: 0.4, 
      ease: "easeOut",
      staggerChildren: 0.1 
    } 
  },
  exit: { x: -20, opacity: 0, transition: { duration: 0.3 } }
};

// ===============================
// COSMIC THEMED ANIMATIONS
// ===============================

export const cosmicFloat: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  }
};

export const cosmicPulse: Variants = {
  animate: {
    boxShadow: [
      '0 0 0 rgba(108, 92, 231, 0)',
      '0 0 20px rgba(108, 92, 231, 0.5)',
      '0 0 0 rgba(108, 92, 231, 0)'
    ],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  }
};

export const cosmicOrbit: Variants = {
  animate: {
    rotate: 360,
    transition: { duration: 20, repeat: Infinity, ease: "linear" }
  }
};

export const starTwinkle: Variants = {
  animate: {
    opacity: [0.3, 1, 0.3],
    scale: [0.8, 1.2, 0.8],
    transition: { 
      duration: 2, 
      repeat: Infinity, 
      ease: "easeInOut",
      delay: Math.random() * 2 // Random delay for each star
    }
  }
};

// ===============================
// SCROLL ANIMATIONS
// ===============================

export const scrollFadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

export const scrollSlideIn: Variants = {
  hidden: { x: -50, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

// ===============================
// CARD ANIMATIONS
// ===============================

export const cardHover: Variants = {
  initial: { 
    scale: 1, 
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' 
  },
  hover: { 
    scale: 1.02, 
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

export const cardFlip: Variants = {
  initial: { rotateY: 0 },
  hover: { 
    rotateY: 5, 
    transition: { duration: 0.3, ease: "easeOut" } 
  }
};

// ===============================
// NOTIFICATION ANIMATIONS
// ===============================

export const toastSlideIn: Variants = {
  hidden: { x: 300, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { duration: 0.3, ease: "easeOut" } 
  },
  exit: { 
    x: 300, 
    opacity: 0, 
    transition: { duration: 0.2, ease: "easeIn" } 
  }
};

export const modalSlideIn: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    transition: { duration: 0.3, ease: "easeOut" } 
  },
  exit: { 
    scale: 0.8, 
    opacity: 0, 
    transition: { duration: 0.2, ease: "easeIn" } 
  }
};

// ===============================
// PARTICLE EFFECTS
// ===============================

export const floatingParticle: Variants = {
  animate: {
    y: [0, -20, 0],
    x: [0, 10, -10, 0],
    opacity: [0.3, 0.8, 0.3],
    transition: {
      duration: 6 + Math.random() * 4, // 6-10 seconds
      repeat: Infinity,
      ease: "easeInOut",
      delay: Math.random() * 2
    }
  }
};

export const confettiPiece: Variants = {
  animate: {
    y: [0, 300],
    x: [0, Math.random() * 200 - 100],
    rotate: [0, 360],
    opacity: [1, 0],
    transition: {
      duration: 3,
      ease: "easeOut"
    }
  }
};

// ===============================
// UTILITY FUNCTIONS
// ===============================

/**
 * Creates a staggered container with custom delay
 */
export const createStaggerContainer = (staggerDelay: number = 0.1): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: staggerDelay }
  }
});

/**
 * Creates a slide animation with custom direction and distance
 */
export const createSlideAnimation = (
  direction: 'up' | 'down' | 'left' | 'right', 
  distance: number = 20
): Variants => {
  const getOffset = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
    }
  };

  return {
    hidden: { ...getOffset(), opacity: 0 },
    visible: { 
      x: 0, 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };
};

/**
 * Animation variants for reduced motion preference
 */
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } }
};

/**
 * Get appropriate animation based on user's motion preference
 */
export const getMotionVariants = (
  normalVariants: Variants,
  respectReducedMotion: boolean = true
): Variants => {
  if (respectReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return reducedMotionVariants;
  }
  return normalVariants;
};