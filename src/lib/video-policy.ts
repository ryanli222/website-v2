export function shouldAutoplayVideo(
  requested: boolean,
  prefersReducedMotion: boolean,
): boolean {
  return requested && !prefersReducedMotion;
}
