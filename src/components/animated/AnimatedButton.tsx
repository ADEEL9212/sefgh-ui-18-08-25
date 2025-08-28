/**
 * Animated Button Component
 * Enhanced button component with cosmic theme and animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { buttonTap, pulseOnHover, glowOnHover, getMotionVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonProps {
  animation?: 'tap' | 'pulse' | 'glow' | 'none';
  useGradient?: boolean;
  cosmic?: boolean;
  children?: React.ReactNode;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  animation = 'tap',
  useGradient = false,
  cosmic = false,
  className,
  children,
  ...props
}) => {
  const getAnimationVariants = () => {
    const variants: any = {};
    
    if (animation === 'tap') {
      Object.assign(variants, buttonTap);
    }
    
    if (animation === 'pulse' || cosmic) {
      Object.assign(variants, pulseOnHover);
    }
    
    if (animation === 'glow' || cosmic) {
      Object.assign(variants, glowOnHover);
    }
    
    return variants;
  };

  const buttonClasses = cn(
    'transition-all duration-200',
    {
      'btn-gradient-primary': useGradient && props.variant === 'default',
      'relative overflow-hidden': cosmic,
      'shadow-elevation-2 hover:shadow-elevation-3': cosmic,
    },
    className
  );

  const MotionButton = motion(Button);

  return (
    <MotionButton
      className={buttonClasses}
      variants={getAnimationVariants()}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {cosmic && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      )}
      {children}
    </MotionButton>
  );
};