import { describe, expect, it } from 'vitest';

import { canOptimizeImage } from './images';

describe('canOptimizeImage', () => {
  it('accepts configured https hosts', () => {
    expect(canOptimizeImage('https://images.unsplash.com/photo-1?w=800')).toBe(true);
  });

  it('rejects other hosts, http and malformed values', () => {
    expect(canOptimizeImage('https://storage.example.com/a.jpg')).toBe(false);
    expect(canOptimizeImage('http://images.unsplash.com/photo-1')).toBe(false);
    expect(canOptimizeImage('not a url')).toBe(false);
  });
});
