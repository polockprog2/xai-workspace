"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      setScrolled(v > 0.01);
    });
    return unsub;
  }, [scrollYProgress]);

  return (
    <motion.header
      role="navigation"
      aria-label="Main navigation"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-surface-border/60 shadow-[0_1px_0_var(--surface-border)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#"
          aria-label="Xai Intelligence Workspace — scroll to top"
          className="probe-target flex items-center gap-1.5 select-none"
          whileHover={{ opacity: 0.8 }}
          transition={{ duration: 0.15 }}
        >
          <span className="text-base font-bold tracking-tight text-foreground">
            Xai<span className="text-accent">.</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] uppercase tracking-[0.2em] text-text-muted/60 font-medium border border-surface-border rounded px-1.5 py-0.5 ml-1">
            Intelligence
          </span>
        </motion.a>

        {/* Right side: scroll HUD + CTA */}
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ opacity: scrolled ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-text-muted/50 tracking-wider"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent/50 animate-pulse" />
            Live Data Feed
          </motion.div>
          <a
            href="#insight-flow"
            className="probe-target hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-accent transition-colors duration-200 px-3 py-1.5 rounded-full border border-surface-border hover:border-accent/40"
          >
            See How It Works
          </a>
        </div>
      </div>

      {/* Thin scroll progress bar under navbar */}
      <motion.div
        className="absolute bottom-0 left-0 h-[1px] bg-accent/40 origin-left"
        style={{ width: progressWidth }}
      />
    </motion.header>
  );
}
