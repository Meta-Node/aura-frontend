import '@testing-library/jest-dom';
import 'vitest-canvas-mock';
import { setGlobalOrigin } from 'undici';

beforeEach(() => {
  setGlobalOrigin(window.location.href);
});

beforeAll(() => {
  window.PointerEvent = class PointerEvent extends Event {} as any;
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.releasePointerCapture = vi.fn();

  if (typeof ResizeObserver === 'undefined') {
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});
