"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

// Persists across client-side navigations within the same JS session
let sessionAnimated = false;

export function AnimationManager() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const isHome = pathname === "/";

    if (!isHome) {
      document.documentElement.classList.add("no-animations");
      return;
    }

    const alreadyVisited = sessionStorage.getItem("visited") === "1";

    if (alreadyVisited || sessionAnimated) {
      document.documentElement.classList.add("no-animations");
    } else {
      // First time on home — let animations play
      sessionAnimated = true;
      sessionStorage.setItem("visited", "1"); // set immediately so refresh skips animations
      document.documentElement.classList.remove("no-animations");
    }
  }, [pathname]);

  return null;
}
