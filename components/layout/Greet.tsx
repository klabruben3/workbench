"use client";

import { useEffect, useState } from "react";
import Logo from "../ui/Logo";
import { AnimatePresence, motion } from "motion/react";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
      duration: 0.3,
    },
  },
};

export function Greet() {
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLogo(false);
    }, 7000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {showLogo && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex justify-center items-center fixed inset-0 z-70 bg-black"
        >
          <Logo />
        </motion.div>
      )}
    </AnimatePresence>
  );
}