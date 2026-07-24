"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorProbe() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Tight spring for the core, slightly looser for the ring — creates the lag effect
  const smoothX = useSpring(mouseX, { stiffness: 700, damping: 42, mass: 0.4 });
  const smoothY = useSpring(mouseY, { stiffness: 700, damping: 42, mass: 0.4 });

  const ringX = useSpring(mouseX, { stiffness: 200, damping: 28, mass: 0.6 });
  const ringY = useSpring(mouseY, { stiffness: 200, damping: 28, mass: 0.6 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target;
      const isTarget = target.closest && target.closest(".probe-target");
      setIsHovering(!!isTarget);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  return (
    <>
      {/* Outer lagging ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 1.8 : 1,
          opacity: isVisible ? (isHovering ? 0.7 : 0.25) : 0,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed top-0 left-0 pointer-events-none z-[99] w-9 h-9 rounded-full border border-foreground mix-blend-multiply"
      />

      {/* Inner sharp crosshair dot — follows mouse precisely */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 0.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center"
      >
        <div className="w-[5px] h-[5px] rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
      </motion.div>
    </>
  );
}
