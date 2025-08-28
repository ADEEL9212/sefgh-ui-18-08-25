/**
 * Animated Card Component
 * Enhanced card component with modern design and animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardProps } from '@/components/ui/card';
import { cardHover, fadeIn, getMotionVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends CardProps {
  animation?: 'fadeIn' | 'cardHover' | 'none';
  useGradient?: boolean;
  useGlass?: boolean;
  elevation?: 1 | 2 | 3 | 4;
  children?: React.ReactNode;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  animation = 'cardHover',
  useGradient = false,
  useGlass = false,
  elevation = 2,
  className,
  children,
  ...props
}) => {
  const getAnimationVariants = () => {
    switch (animation) {
      case 'fadeIn':
        return getMotionVariants(fadeIn);
      case 'cardHover':
        return cardHover;
      case 'none':
        return {};
      default:
        return cardHover;
    }
  };

  const cardClasses = cn(
    'transition-all duration-200',
    {
      'card-gradient': useGradient,
      'glass-panel': useGlass,
      'shadow-elevation-1': elevation === 1,
      'shadow-elevation-2': elevation === 2,
      'shadow-elevation-3': elevation === 3,
      'shadow-elevation-4': elevation === 4,
      'border-none': useGlass || useGradient,
    },
    className
  );

  const MotionCard = motion(Card);

  return (
    <MotionCard
      className={cardClasses}
      variants={getAnimationVariants()}
      initial="initial"
      animate="visible"
      whileHover="hover"
      {...props}
    >
      {children}
    </MotionCard>
  );
};