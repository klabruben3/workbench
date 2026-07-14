"use client";

import { motion } from "motion/react";

export default function Logo() {
  const logoVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const scaleXVariants = {
    hidden: { scaleX: 0 },
    visible: (customScale: number) => ({ scaleX: customScale }),
    exit: { scaleX: 0 }
  };

  const scaleYVariants = {
    hidden: { scaleY: 0 },
    visible: (customScale: number) => ({ scaleY: customScale }),
    exit: { scaleY: 0 }
  };

  const rotateVariants = {
    hidden: { rotate: "-180deg" },
    visible: { rotate: "0" },
    exit: { rotate: "-180deg" }
  };

  return (
    <div className="relative p-8">
      <div className="relative w-[90px] h-[90px]">
        
        <motion.img
          variants={logoVariants}
          transition={{ duration: 3, ease: "linear", delay: 3 }}
          src="/logo/logo.svg"
          className="absolute top-0 left-0 object-contain w-full h-full z-1"
        />

        {/* Horizontal top */}
        <motion.div
          variants={scaleXVariants}
          custom={1.3}
          transition={{ duration: 1, ease: "linear", delay: 1 }}
          className="absolute bottom-full w-full h-[0.5px] bg-gray-500/40 origin-center"
        />

        {/* stage-2 */}
        <motion.div
          variants={scaleXVariants}
          custom={1.6}
          transition={{ duration: 1, ease: "linear", delay: 1.5 }}
          className="absolute left-0 top-[-10px] w-full h-[0.5px] bg-gray-500/40 origin-center"
        />

        {/* Horizontal bottom */}
        {/* stage-1 */}
        <motion.div
          variants={scaleXVariants}
          custom={1.5}
          transition={{ duration: 1, ease: "linear", delay: 2.5 }}
          className="absolute left-0 bottom-0 w-full h-[0.5px] bg-gray-500/40 origin-center"
        />

        {/* stage-2 */}
        <motion.div
          variants={scaleXVariants}
          custom={1.3}
          transition={{ duration: 1, ease: "linear", delay: 3 }}
          className="absolute left-0 bottom-[-10px] w-full h-[0.5px] bg-gray-500/40 origin-center"
        />

        {/* Vertical Center */}
        <motion.div
          variants={scaleYVariants}
          custom={1.4}
          transition={{ duration: 1, ease: "linear", delay: 2 }}
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[0.5px] h-full bg-gray-500/40 origin-center"
        />

        {/* Vertical left */}
        {/* stage-1 */}
        <motion.div
          variants={scaleYVariants}
          custom={1.3}
          transition={{ duration: 1, ease: "linear", delay: 2 }}
          className="absolute left-0 top-0 w-[0.5px] h-full bg-gray-500/40 origin-center"
        />

        {/* stage-2 */}
        <motion.div
          variants={scaleYVariants}
          custom={1.6}
          transition={{ duration: 1, ease: "linear", delay: 3.5 }}
          className="absolute left-[-10px] top-0 w-[0.5px] h-full bg-gray-500/40 origin-center"
        />

        {/* Vertical right */}
        {/* stage-1 */}
        <motion.div
          variants={scaleYVariants}
          custom={1.1}
          transition={{ duration: 1, ease: "linear", delay: 3 }}
          className="absolute right-0 top-0 w-[0.5px] h-full bg-gray-500/40 origin-center"
        />

        {/* stage-2 */}
        <motion.div
          variants={scaleYVariants}
          custom={1.5}
          transition={{ duration: 1, ease: "linear", delay: 4 }}
          className="absolute right-[-10px] top-0 w-[0.5px] h-full bg-gray-500/40 origin-center"
        />

        {/* Center circle */}
        <div className="absolute flex left-[15px] top-0 h-[60px] w-[60px]">
          <div className="overflow-hidden w-[30px] h-full">
            <motion.div
              variants={rotateVariants}
              transition={{ duration: 1, ease: "linear", delay: 1 }}
              className="w-full h-full rounded-full border-l border-gray-500/40"
              style={{
                borderRadius: "30px 0 0 30px",
                transformOrigin: "right center",
              }}
            />
          </div>
          <div className="overflow-hidden w-[30px] h-full">
            <motion.div
              variants={rotateVariants}
              transition={{ duration: 1, ease: "linear" }}
              className="h-full w-full rounded-full border-r border-gray-500/40"
              style={{
                borderRadius: "0 30px 30px 0",
                transformOrigin: "left center",
              }}
            />
          </div>
          {/* Center line */}
          <motion.div
            variants={scaleXVariants}
            custom={1}
            transition={{ duration: 1, ease: "linear" }}
            className="absolute top-1/2 -translate-y-1/2 w-full h-[0.5px] bg-gray-500/40 origin-center"
          />
        </div>

        {/* Left half circle */}
        <div className="absolute top-0 left-0 overflow-hidden w-[30px] h-[60px]">
          <motion.div
            variants={rotateVariants}
            transition={{ duration: 1, ease: "linear", delay: 0.5 }}
            className="h-full w-full rounded-full border-r border-gray-500/40"
            style={{
              borderRadius: "0 30px 30px 0",
              transformOrigin: "left center",
            }}
          />
        </div>

        {/* Right half circle */}
        <div className="absolute top-0 right-0 overflow-hidden w-[30px] h-[60px]">
          <motion.div
            variants={rotateVariants}
            transition={{ duration: 1, ease: "linear" }}
            className="h-full w-full rounded-full border-l border-gray-500/40"
            style={{
              borderRadius: "30px 0 0 30px",
              transformOrigin: "right center",
            }}
          />
        </div>
      </div>
    </div>
  );
}
