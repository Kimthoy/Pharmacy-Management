import React, { useState, useEffect } from "react";

const DelayedLoader = ({ delay = 100, children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [delay]);

  return isLoading ? <>{children}</> : null;
};

export default DelayedLoader;
