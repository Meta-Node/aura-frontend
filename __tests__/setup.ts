import '@testing-library/jest-dom';
import 'vitest-canvas-mock';
import { setGlobalOrigin } from 'undici';

beforeEach(() => {
  setGlobalOrigin(window.location.href);
});

beforeAll(() => {
  if (typeof ResizeObserver === 'undefined') {
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});
