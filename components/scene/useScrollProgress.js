"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/scrollState";

gsap.registerPlugin(ScrollTrigger);

export default function useScrollProgress() {
  const [activeStage, setActiveStage] = useState(-1);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const tl = gsap.timeline({
      scrollTrigger: {
        id: "global-scroll",
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          scrollState.progress = self.progress;

          // 7-phase active stage mapping (scan + hold share stage 4)
          let currentStage = -1;
          if (self.progress >= 0.13 && self.progress < 0.30) {
            currentStage = 0;
          } else if (self.progress >= 0.30 && self.progress < 0.47) {
            currentStage = 1;
          } else if (self.progress >= 0.47 && self.progress < 0.61) {
            currentStage = 2;
          } else if (self.progress >= 0.61 && self.progress < 0.76) {
            currentStage = 3;
          } else if (self.progress >= 0.76 && self.progress < 0.92) {
            currentStage = 4;
          } else if (self.progress >= 0.92) {
            currentStage = 5;
          }

          if (scrollState.activeStage !== currentStage) {
            scrollState.activeStage = currentStage;
            setActiveStage(currentStage);
          }

          // Track hold sub-phase (0.85–0.92)
          scrollState.transformHold = self.progress >= 0.85 && self.progress < 0.92;
        }
      }
    });

    // --- GSAP CAMERA & MORPH TIMELINE ---

    // 0 -> 0.13 (Hero)
    tl.to(scrollState, {
      camX: 0, camY: 0, camZ: 14,
      lookX: 0, lookY: 0, lookZ: 0,
      morph: 0,
      duration: 0.13,
      ease: "none"
    });

    // 0.13 -> 0.30 (Ingest)
    tl.to(scrollState, {
      camX: 3.5, camY: 1.5, camZ: 9.5,
      lookX: 0, lookY: 0, lookZ: 0,
      morph: 1,
      duration: 0.17,
      ease: "none"
    });

    // 0.30 -> 0.47 (Analyze)
    tl.to(scrollState, {
      camX: -3.5, camY: 2.2, camZ: 8.0,
      lookX: 0.5, lookY: 0.5, lookZ: 0,
      morph: 2,
      duration: 0.17,
      ease: "none"
    });

    // 0.47 -> 0.61 (Insight)
    tl.to(scrollState, {
      camX: 0, camY: 1.2, camZ: 5.5,
      lookX: 0.8, lookY: 0.6, lookZ: 0,
      morph: 3,
      duration: 0.14,
      ease: "none"
    });

    // 0.61 -> 0.76 (Signature)
    tl.to(scrollState, {
      camX: 0, camY: 2.0, camZ: 7.0,
      lookX: 0, lookY: 0.3, lookZ: 0,
      morph: 4,
      duration: 0.15,
      ease: "none"
    });

    // 0.76 -> 0.85 (Transformation scan — morph 4->5)
    tl.to(scrollState, {
      camX: 0, camY: 1.5, camZ: 6.5,
      lookX: 0, lookY: 0, lookZ: 0,
      morph: 5,
      duration: 0.09,
      ease: "none"
    });

    // 0.85 -> 0.92 (Transformation hold — morph stays at 5, camera holds)
    tl.to(scrollState, {
      camX: 0, camY: 1.5, camZ: 6.5,
      lookX: 0, lookY: 0, lookZ: 0,
      morph: 5,
      duration: 0.07,
      ease: "none"
    });

    // 0.92 -> 1.0 (Dashboard — morph 5->6, recede)
    tl.to(scrollState, {
      camX: -6.5, camY: 4.0, camZ: 11.0,
      lookX: 2.5, lookY: -0.5, lookZ: 0,
      morph: 6,
      duration: 0.08,
      ease: "none"
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return activeStage;
}
