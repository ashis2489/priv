import { useEffect, useRef, useCallback } from "react";
import { useProgress } from "@react-three/drei";
import { useStore } from "../../store/useStore";

/**
 * Reads actual Three.js asset loading progress from drei and
 * pushes it into the Zustand store so LoadingScreen can display it.
 * Also has a hard timeout fallback in case useProgress never fires.
 */
export function ProgressTracker() {
  const { progress, active } = useProgress();
  const { setLoadingProgress, setLoadingComplete } = useStore();
  const done = useRef(false);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    setLoadingComplete(true);
  }, [setLoadingComplete]);

  useEffect(() => {
    setLoadingProgress(progress);
  }, [progress, setLoadingProgress]);

  // drei useProgress fires once assets resolve; hard-cap at 3s as safety net
  useEffect(() => {
    if (!active) finish();
    const t = setTimeout(finish, 3000);
    return () => clearTimeout(t);
  }, [active, finish]);

  return null;
}
