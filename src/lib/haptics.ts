/**
 * Trigger haptic feedback (vibration) on supported devices.
 */
export function hapticFeedback(pattern: 'success' | 'light' | 'error' = 'success') {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;

  const patterns: Record<string, number | number[]> = {
    success: 50,
    light: 20,
    error: [50, 30, 50],
  };

  try {
    navigator.vibrate(patterns[pattern]);
  } catch {
    // silently fail on unsupported devices
  }
}
