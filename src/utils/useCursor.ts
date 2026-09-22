import { useCallback } from "react";

/**
 * Returns onPointerEnter/onPointerLeave handlers that set body cursor.
 * Spread into a R3F group/mesh: {...useCursor()}
 */
export function useCursor() {
  const enter = useCallback(() => { document.body.style.cursor = "pointer"; }, []);
  const leave = useCallback(() => { document.body.style.cursor = "auto"; }, []);
  return { onPointerEnter: enter, onPointerLeave: leave };
}
