import { useState } from "react";
import { loadThumbnail } from "../lib/file/ops";

export default function useThumbnail(image: string | null = null, path: string | null = null) {
  const defaultThumb = require("../../assets/default-book.jpg");

  const [thumb, setThumb] = useState(defaultThumb);
  const [fallback, setFallback] = useState(defaultThumb);
  const [hasFired, setHasFired] = useState(false);

  if (!hasFired) {
    (async () => {
      const { thumb: generatedThumb, fallback: generatedFallback } = await loadThumbnail(image, path);
      if (generatedThumb && isNaN(parseInt(generatedThumb))) {
        setThumb({ uri: generatedThumb });
      }
      if (generatedFallback && isNaN(parseInt(generatedFallback))) {
        setFallback({ uri: generatedFallback });
      }
      setHasFired(true);
    })();
  }

  return { thumb, fallback } as const;
};
