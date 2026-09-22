export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  const width = window.innerWidth;
  const coarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const hasTouch = navigator.maxTouchPoints > 0;
  const compactTouch = width < 1024 && (coarsePointer || hasTouch);
  const compactViewport = width < 700;
  const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  return (
    compactViewport ||
    compactTouch ||
    (mobileUserAgent && width < 1024)
  );
}

export function isLowEnd(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { hardwareConcurrency?: number; deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory ?? 4;
  return cores <= 2 || mem <= 2;
}
