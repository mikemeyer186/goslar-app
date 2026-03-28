import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

vi.mock('./components/overview', () => ({
    default: () => <div>overview-screen</div>,
}));

vi.mock('./components/imprint', () => ({
    default: () => <div>imprint-screen</div>,
}));

vi.mock('./components/dataprotection', () => ({
    default: () => <div>dataprotection-screen</div>,
}));

describe('App routes', () => {
    it('renders the overview route', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>,
        );

        expect(screen.getByText('overview-screen')).toBeInTheDocument();
    });

    it('renders the imprint route', () => {
        render(
            <MemoryRouter initialEntries={['/imprint']}>
                <App />
            </MemoryRouter>,
        );

        expect(screen.getByText('imprint-screen')).toBeInTheDocument();
    });

    it('renders the data protection route', () => {
        render(
            <MemoryRouter initialEntries={['/dataprotection']}>
                <App />
            </MemoryRouter>,
        );

        expect(screen.getByText('dataprotection-screen')).toBeInTheDocument();
    });
});
