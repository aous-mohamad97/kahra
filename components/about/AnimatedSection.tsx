"use client";
import { motion, HTMLMotionProps } from "framer-motion";

interface AnimatedSectionProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  initialVars?: Record<string, any>;
  animateVars?: Record<string, any>;
  transitionVars?: Record<string, any>;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  initialVars = { opacity: 0, y: 30 },
  animateVars = { opacity: 1, y: 0 },
  transitionVars = { duration: 0.8 },
  ...rest
}) => {
  return (
    <motion.div
      className={className}
      initial={initialVars}
      whileInView={animateVars}
      transition={transitionVars}
      viewport={{ once: true }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
