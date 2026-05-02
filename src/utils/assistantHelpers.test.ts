import { describe, it, expect } from 'vitest';
import { formatIDR, generateId, getCurrentTime } from './assistantHelpers';

describe('Assistant Helpers', () => {
  describe('formatIDR', () => {
    it('should format 75000 to Rp 75.000', () => {
      const result = formatIDR(75000);
      expect(result).toContain('75.000');
      expect(result).toContain('Rp');
    });

    it('should format 0 to Rp 0', () => {
      const result = formatIDR(0);
      expect(result).toContain('0');
    });
  });

  describe('generateId', () => {
    it('should generate a unique ID starting with msg-', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).toMatch(/^msg-/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('getCurrentTime', () => {
    it('should return time in HH:MM AM/PM format', () => {
      const time = getCurrentTime();
      // Match pattern like 10:30 AM or 02:45 PM
      expect(time).toMatch(/\d{2}:\d{2} (AM|PM)/);
    });
  });
});
