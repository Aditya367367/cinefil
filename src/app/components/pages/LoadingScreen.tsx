import { useState, useEffect } from "react";
import Lottie from "lottie-react";

export function LoadingScreen() {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch("/src/imports/movie app (2).json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error("Failed to load animation:", error));
  }, []);

  console.log("=== LOADING SCREEN COMPONENT RENDERED ===");
  console.log("Animation data loaded:", !!animationData);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      {animationData ? (
        <Lottie
          animationData={animationData}
          loop={true}
          style={{ width: 300, height: 300 }}
        />
      ) : (
        <div className="animate-spin rounded-full h-16 w-16  mb-4"></div>
      )}
      <p className="absolute bottom-10  font-medium"></p>
    </div>
  );
}
