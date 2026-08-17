"use client";

import { motion } from "framer-motion";
import { Button, type ButtonProps } from "@/components/ui/button";

export function AnimatedButton({ children, ...props }: ButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full">
      <Button {...props} className="w-full">
        {children}
      </Button>
    </motion.div>
  );
}
