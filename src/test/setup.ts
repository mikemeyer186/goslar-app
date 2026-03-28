import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
    cleanup();
    localStorage.clear();
    document.body.className = '';
    document.head.innerHTML = '';
});

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock);
vi.stubGlobal('UC_UI', {
    showSecondLayer: vi.fn(),
    areAllConsentsAccepted: vi.fn(() => true),
    isInitialized: vi.fn(() => true),
    getServicesBaseInfo: vi.fn(),
});
