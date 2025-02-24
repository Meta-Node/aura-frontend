import '@testing-library/jest-dom';
import { setGlobalOrigin } from 'undici';

beforeEach(() => {
  setGlobalOrigin(window.location.href);
});
