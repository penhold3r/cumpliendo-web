import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as unknown as typeof IntersectionObserver;

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as unknown as typeof ResizeObserver;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

global.indexedDB = vi.fn() as unknown as IDBFactory;

// jsdom's ElementInternals is missing the form-associated custom element API
// that Latty's form components (lt-select, lt-input…) call on update.
if (typeof ElementInternals !== 'undefined') {
  const internals = ElementInternals.prototype as unknown as Record<string, unknown>;
  internals.setFormValue ??= () => {};
  internals.setValidity ??= () => {};
  internals.checkValidity ??= () => true;
  internals.reportValidity ??= () => true;
  internals.states ??= new Set();
}
