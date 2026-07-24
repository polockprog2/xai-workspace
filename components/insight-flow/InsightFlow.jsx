"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { mockData } from "@/lib/mockData";
import { scrollState } from "@/lib/scrollState";

gsap.registerPlugin(ScrollTrigger);

const STAGES = mockData.stages;

const INACTIVE_BADGE = {
  borderColor: "var(--surface-border)",
  color: "var(--text-muted)",
  scale: 1,
  boxShadow: "0 0 0px transparent",
};

const ACTIVE_BADGE = {
  borderColor: "var(--accent)",
  color: "var(--accent)",
  scale: 1.1,
  boxShadow: "0 0 18px var(--accent-glow)",
};

export default function InsightFlow() {
  const sectionRef = useRef(null);
  const lineFillRef = useRef(null);
  const cardRefs = useRef([]);
  const badgeRefs = useRef([]);

  useEffect(() => {
    let ctx;

    const timeout = setTimeout(() => {
      ctx = gsap.context(() => {
        const cards = cardRefs.current.filter(Boolean);
        const badges = badgeRefs.current.filter(Boolean);

        if (!sectionRef.current || cards.length !== STAGES.length) return;

        const inactiveCard = { autoAlpha: 0, y: 28, scale: 0.97, pointerEvents: "none" };
        const activeCard = { autoAlpha: 1, y: 0, scale: 1, pointerEvents: "auto" };

        gsap.set(lineFillRef.current, { scaleY: 0, transformOrigin: "top center" });
        gsap.set(cards[0], { ...activeCard, zIndex: 3 });
        gsap.set(cards[1], { ...inactiveCard, zIndex: 2 });
        gsap.set(cards[2], { ...inactiveCard, zIndex: 1 });
        gsap.set(badges[0], ACTIVE_BADGE);
        gsap.set(badges.slice(1), INACTIVE_BADGE);

        const tl = gsap.timeline({
          scrollTrigger: {
            id: "insight-flow",
            trigger: sectionRef.current,
            start: "top top",
            end: "+=3200",
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              scrollState.insightFlowComplete = self.progress >= 0.92;
            },
            onLeave: () => {
              scrollState.insightFlowComplete = true;
            },
            onEnterBack: () => {
              scrollState.insightFlowComplete = false;
            },
          },
        });

        const stageTransition = (fromIdx, toIdx, lineScale) => {
          tl.to(lineFillRef.current, { scaleY: lineScale, duration: 1.5, ease: "none" });
          tl.to(
            cards[fromIdx],
            { autoAlpha: 0, y: -28, scale: 0.96, pointerEvents: "none", duration: 0.7, ease: "power2.in" },
            "<+=0.2"
          );
          tl.to(badges[fromIdx], { ...INACTIVE_BADGE, duration: 0.4 }, "<");
          tl.fromTo(
            cards[toIdx],
            { autoAlpha: 0, y: 28, scale: 0.97, pointerEvents: "none", zIndex: 4 },
            { autoAlpha: 1, y: 0, scale: 1, pointerEvents: "auto", duration: 0.8, ease: "power2.out" },
            "<+=0.15"
          );
          tl.to(badges[toIdx], { ...ACTIVE_BADGE, duration: 0.5 }, "<");
        };

        stageTransition(0, 1, 0.5);
        stageTransition(1, 2, 1.0);

        // Hold final stage on screen until transitions fully settle, then release pin
        tl.to({}, { duration: 0.85 });
      }, sectionRef);

      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timeout);
      ctx?.revert();
    };
  }, []);

  return (
    <section
      id="insight-flow"
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center pointer-events-none"
    >
      {/* Subtle background tint when pinned for readability */}
      <div className="absolute inset-0 bg-background/30 pointer-events-none" />

      <div className="relative z-10 max-w-3xl w-full px-8 py-24 pointer-events-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] uppercase text-accent mb-5 border-l-2 border-accent pl-3">
            How it works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] text-foreground">
            From raw signal
            <br />
            to <span className="text-accent">autonomous mitigation.</span>
          </h2>
          <p className="mt-4 text-text-muted text-base leading-relaxed max-w-md">
            Three stages. One unified intelligence layer. Zero human bottlenecks.
          </p>
        </motion.div>

        {/* Stepper container */}
        <div className="relative flex gap-10 md:gap-16 items-start">

          {/* Left side: Vertical spine indicator */}
          <div className="relative w-12 flex flex-col items-center py-1 flex-shrink-0">
            {/* Spine track */}
            <div className="absolute top-0 bottom-0 w-[1px] bg-surface-border pointer-events-none z-0" />
            {/* Spine fill — GSAP drives scaleY; no CSS transition */}
            <div
              ref={lineFillRef}
              className="absolute top-0 w-[1px] h-full bg-accent shadow-[0_0_10px_var(--accent)] origin-top pointer-events-none z-0"
            />

            {/* Badges container — aligned to match card height */}
            <div className="flex flex-col justify-between h-[280px] relative z-10">
              {STAGES.map((stage, i) => (
                <div
                  key={stage.step}
                  ref={(el) => (badgeRefs.current[i] = el)}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border border-surface-border bg-surface text-foreground"
                >
                  {stage.step}
                </div>
              ))}
            </div>
          </div>

          {/* Right side: Absolutely-stacked sliding cards */}
          <div className="relative flex-1 h-[280px]">
            {STAGES.map((stage, i) => (
              <div
                key={stage.step}
                ref={(el) => (cardRefs.current[i] = el)}
                className="probe-target absolute inset-x-0 top-0 p-8 rounded-2xl border border-surface-border bg-surface/60 backdrop-blur-sm hover:bg-surface"
                style={{
                  opacity: i === 0 ? 1 : 0,
                  visibility: i === 0 ? "visible" : "hidden",
                  zIndex: i === 0 ? 3 : STAGES.length - i,
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-foreground">{stage.label}</h3>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted/50 bg-surface-border/50 rounded px-2 py-0.5">
                    Stage {stage.step}
                  </span>
                </div>
                <p className="text-text-muted leading-relaxed mb-5">{stage.description}</p>
                <div className="flex items-center gap-2 text-xs font-mono tracking-wide font-medium" style={{ color: stage.color }}>
                  <span className="inline-block w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: stage.color }} />
                  {stage.detail}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Bridge label */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 flex items-center gap-4"
        >
          <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-surface-border" />
          <span className="flex items-center gap-2 bg-accent/8 border border-accent/20 rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.15em] uppercase text-accent">
            <span className="text-accent">→</span>
            AI Automations
          </span>
          <span className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-surface-border" />
        </motion.div>
      </div>
    </section>
  );
}
