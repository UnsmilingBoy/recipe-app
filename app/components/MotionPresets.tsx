"use client";

import React, { useState } from "react";
import { motion, MotionProps } from "framer-motion";

export const pageFade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export function MotionContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{ initial: pageFade.initial, animate: pageFade.animate }}
      transition={{ duration: 0.45 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export type MotionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  Partial<MotionProps> & { children?: React.ReactNode };

export const MotionButton = React.forwardRef<
  HTMLButtonElement,
  MotionButtonProps
>(function MotionButton({ className = "", children, ...rest }, ref) {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "tween", duration: 0.12 }}
      className={className}
      {...rest}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.button>
  );
});

MotionButton.displayName = "MotionButton";

export type MotionInputProps = React.InputHTMLAttributes<HTMLInputElement> &
  Partial<MotionProps>;

export const MotionInput = React.forwardRef<HTMLInputElement, MotionInputProps>(
  function MotionInput({ className = "", ...rest }, ref) {
    const [focused, setFocused] = useState(false);

    // preserve any user provided onFocus/onBlur handlers
    const typedRest = rest as MotionInputProps;
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      typedRest.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      typedRest.onBlur?.(e);
    };

    return (
      <motion.input
        ref={ref}
        onFocus={handleFocus}
        onBlur={handleBlur}
        animate={
          focused
            ? { scale: 1.01, boxShadow: "0 6px 18px rgba(59,130,246,0.12)" }
            : { scale: 1, boxShadow: "0 0px 0px rgba(0,0,0,0)" }
        }
        transition={{ duration: 0.18 }}
        className={className}
        {...rest}
        style={{ ...(typedRest.style ?? {}), willChange: "transform" }}
      />
    );
  }
);

MotionInput.displayName = "MotionInput";

export function MotionCard(
  props: MotionProps & { children?: React.ReactNode; className?: string }
) {
  const { children, className = "", ...rest } = props;
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.18 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export default MotionPresets;

function MotionPresets() {
  return null;
}
