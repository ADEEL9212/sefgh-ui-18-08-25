/**
 * Animated Text Component
 * Enhanced text component with cosmic animations and gradient effects
 */

import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, slideInFromLeft, getMotionVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideIn' | 'none';
  gradient?: boolean;
  cosmic?: boolean;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  delay?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  animation = 'fadeIn',
  gradient = false,
  cosmic = false,
  className,
  as: Component = 'div',
  delay = 0,
}) => {
  const getAnimationVariants = () => {
    const baseVariants = (() => {
      switch (animation) {
        case 'fadeIn':
          return fadeIn;
        case 'slideIn':
          return slideInFromLeft;
        case 'none':
          return {};
        default:
          return fadeIn;
      }
    })();

    // Add delay to the animation
    if (delay > 0 && baseVariants.visible) {
      baseVariants.visible = {
        ...baseVariants.visible,
        transition: {
          ...baseVariants.visible.transition,
          delay,
        },
      };
    }

    return getMotionVariants(baseVariants);
  };

  const textClasses = cn(
    'transition-all duration-200',
    {
      'gradient-text': gradient,
      'cosmic-float': cosmic,
    },
    className
  );

  const MotionComponent = motion(Component);

  return (
    <MotionComponent
      className={textClasses}
      variants={getAnimationVariants()}
      initial="hidden"
      animate="visible"
    >
      {children}
    </MotionComponent>
  );
};