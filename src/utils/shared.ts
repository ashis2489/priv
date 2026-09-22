/** Shared yaw ref so PlayerController stays in sync after fast-travel */
export const yawRef = { current: Math.PI };

/** Mobile joystick input — shared via ref so the R3F scene can read it */
export const mobileInput = { dx: 0, dz: 0 };
