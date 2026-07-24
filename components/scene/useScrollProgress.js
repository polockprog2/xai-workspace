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

    // Define timeline to map page scroll position to 3D scene parameters
    const tl = gsap.timeline({
      scrollTrigger: {
        id: "global-scroll",
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // smooth scrubbing factor
        onUpdate: (self) => {
          scrollState.progress = self.progress;
          
          // Determine active stage based on scroll progress
          let currentStage = -1; // Hero
          if (self.progress >= 0.15 && self.progress < 0.35) {
            currentStage = 0; // Ingest
          } else if (self.progress >= 0.35 && self.progress < 0.55) {
            currentStage = 1; // Analyze
          } else if (self.progress >= 0.55 && self.progress < 0.72) {
            currentStage = 2; // Insight
          } else if (self.progress >= 0.72 && self.progress < 0.88) {
            currentStage = 3; // Signature
          } else if (self.progress >= 0.88) {
            currentStage = 4; // Dashboard Recede
          }
          
          if (scrollState.activeStage !== currentStage) {
            scrollState.activeStage = currentStage;
            setActiveStage(currentStage);
          }
        }
      }
    });

    // --- GSAP CAMERA & MORPH TIMELINE ---
    // Scroll 0 -> 0.15 (Hero)
    // Camera is far, looking at center. Morph is 0 (chaotic raw dots).
    tl.to(scrollState, {
      camX: 0,
      camY: 0,
      camZ: 14,
      lookX: 0,
      lookY: 0,
      lookZ: 0,
      morph: 0,
      duration: 0.15,
      ease: "none"
    });

    // Scroll 0.15 -> 0.35 (Ingest Stage)
    // Camera moves to a side-angle, particles start to organize into flow lanes (morph = 1)
    tl.to(scrollState, {
      camX: 3.5,
      camY: 1.5,
      camZ: 9.5,
      lookX: 0,
      lookY: 0,
      lookZ: 0,
      morph: 1,
      duration: 0.2,
      ease: "none"
    });

    // Scroll 0.35 -> 0.55 (Analyze Stage)
    // Camera rotates, particles gather into 3D clusters/hubs (morph = 2)
    tl.to(scrollState, {
      camX: -3.5,
      camY: 2.2,
      camZ: 8.0,
      lookX: 0.5,
      lookY: 0.5,
      lookZ: 0,
      morph: 2,
      duration: 0.2,
      ease: "none"
    });

    // Scroll 0.55 -> 0.72 (Insight Stage)
    // Camera zooms into a specific transaction anomaly path (morph = 3, highlight connections)
    tl.to(scrollState, {
      camX: 0,
      camY: 1.2,
      camZ: 5.5,
      lookX: 0.8,
      lookY: 0.6,
      lookZ: 0,
      morph: 3,
      duration: 0.17,
      ease: "none"
    });

    // Scroll 0.72 -> 0.88 (Signature Interaction)
    // Camera centers close with a slight high angle to reveal 3D network depth
    tl.to(scrollState, {
      camX: 0,
      camY: 2.0,
      camZ: 7.0,
      lookX: 0,
      lookY: 0.3,
      lookZ: 0,
      morph: 4,
      duration: 0.16,
      ease: "none"
    });

    // Scroll 0.88 -> 1.0 (Dashboard Recede)
    // Camera shifts far left/up, scaling down the core so it recedes into the background
    // of the dashboard screen layout (morph = 5)
    tl.to(scrollState, {
      camX: -6.5,
      camY: 4.0,
      camZ: 11.0,
      lookX: 2.5,
      lookY: -0.5,
      lookZ: 0,
      morph: 5,
      duration: 0.12,
      ease: "none"
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return activeStage;
}
