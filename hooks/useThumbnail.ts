import { useEffect, useState } from "react";
import { getThumbnail } from "../utils/misc.util";

export const useThumbnail = (
  image: string | null = null,
  path: string | null = null
) => {
  const defaultThumb = require("../assets/default-book.jpg");

  const [thumb, setThumb] = useState(defaultThumb);
  const [fallback, setFallback] = useState(defaultThumb);

  useEffect(() => {
    (async () => {
      const { thumb, fallback } = await getThumbnail(image, path);
      if (thumb && isNaN(parseInt(thumb))) setThumb({ uri: thumb });
      if (fallback && isNaN(parseInt(fallback))) setFallback({ uri: fallback });
    })();
  }, [image, path]);

  return { thumb, fallback };
};
