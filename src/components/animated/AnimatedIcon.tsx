/**
 * Animated Icon Component
 * Enhanced icon component with cosmic animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { spin, bounce, cosmicFloat, pulseOnHover, getMotionVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface AnimatedIconProps {
  children: React.ReactNode;
  animation?: 'spin' | 'bounce' | 'float' | 'pulse' | 'hover' | 'none';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  children,
  animation = 'none',
  size = 'md',
  className,
  onClick,
}) => {
  const getAnimationVariants = () => {
    switch (animation) {
      case 'spin':
        return getMotionVariants(spin);
      case 'bounce':
        return getMotionVariants(bounce);
      case 'float':
        return getMotionVariants(cosmicFloat);
      case 'pulse':
        return getMotionVariants({ animate: { scale: [1, 1.1, 1], transition: { duration: 1, repeat: Infinity } } });
      case 'hover':
        return pulseOnHover;
      case 'none':
        return {};
      default:
        return {};
    }
  };

  const iconClasses = cn(
    'inline-block transition-all duration-200',
    {
      'h-4 w-4': size === 'sm',
      'h-5 w-5': size === 'md',
      'h-6 w-6': size === 'lg',
      'h-8 w-8': size === 'xl',
      'cursor-pointer': onClick,
    },
    className
  );

  return (
    <motion.div
      className={iconClasses}
      variants={getAnimationVariants()}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};