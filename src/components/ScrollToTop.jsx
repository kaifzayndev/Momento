import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
      try {
        window.scrollTo(0, 0);
      } catch {
        // Fallback for environments where scrollTo options aren't supported
      }
    }
  }, [pathname]);

  return null;
}

export default ScrollToTop;
