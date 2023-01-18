import { useEffect, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

interface ScrollStatus {
  contentInset: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  contentOffset: {
    x: number;
    y: number;
  };
  contentSize: {
    height: number;
    width: number;
  };
  layoutMeasurement: {
    height: number;
    width: number;
  };
  zoomScale: number;
}

type EventAxis = "x" | "y";

export interface ScrollThresholdData {
  offset: ScrollStatus;
  hasReachedThreshold: boolean;
}

export default function useScrollThreshold(
  threshold: number,
  axis: EventAxis = "y",
  invert: boolean = false
) {
  const [currentStatus, setCurrentStatus] = useState<ScrollStatus>({
    contentInset: { top: 0, bottom: 0, left: 0, right: 0 },
    contentOffset: { x: 0, y: 0 },
    contentSize: { height: 0, width: 0 },
    layoutMeasurement: { height: 0, width: 0 },
    zoomScale: 1,
  });
  const [hasReachedThreshold, setHasReachedThreshold] = useState(false);

  useEffect(() => {
    const currentAxisOffset = currentStatus?.contentOffset?.[axis] || 0;
    if (
      currentAxisOffset >= threshold ||
      (invert && currentAxisOffset <= threshold)
    ) {
      setHasReachedThreshold(true);
    } else {
      setHasReachedThreshold(false);
    }
  }, [currentStatus]);

  function onEvent(status: NativeSyntheticEvent<NativeScrollEvent>) {
    if (!status) return;
    setCurrentStatus(status.nativeEvent);
  }

  const page: ScrollThresholdData = {
    offset: { ...currentStatus },
    hasReachedThreshold,
  };

  return [page, onEvent] as const;
}
