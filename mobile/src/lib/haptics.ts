/**
 * Mobile Haptic Feedback Utility
 * Gracefully vibrates on Android / Mobile Tauri devices where supported.
 */

const HAPTICS_STORAGE_KEY = 'messefy_haptics_enabled';

export const haptics = {
  isEnabled(): boolean {
    try {
      const stored = localStorage.getItem(HAPTICS_STORAGE_KEY);
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  },

  setEnabled(enabled: boolean): void {
    try {
      localStorage.setItem(HAPTICS_STORAGE_KEY, String(enabled));
    } catch (e) {
      console.warn('Failed to persist haptic settings', e);
    }
  },

  vibrate(pattern: number | number[]): void {
    if (!this.isEnabled()) return;
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Silently ignore if not supported or blocked by user gesture policy
      }
    }
  },

  /** Very subtle tick on button press or tab change */
  selection(): void {
    this.vibrate(10);
  },

  /** Impact feedback */
  impact(type: 'light' | 'medium' | 'heavy' = 'medium'): void {
    switch (type) {
      case 'light':
        this.vibrate(15);
        break;
      case 'medium':
        this.vibrate(25);
        break;
      case 'heavy':
        this.vibrate(40);
        break;
    }
  },

  /** Success action confirmation */
  success(): void {
    this.vibrate([15, 30, 20]);
  },

  /** Warning or caution */
  warning(): void {
    this.vibrate([25, 40, 25]);
  },

  /** Error vibration */
  error(): void {
    this.vibrate([40, 40, 40, 40, 40]);
  },
};
