export const BREAKPOINTS = {
  SMALL: 360,
} as const;

export const MEDIA = {
  SMALL: `@media (max-width: ${BREAKPOINTS.SMALL - 1}px)`,
} as const;
