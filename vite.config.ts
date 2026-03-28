import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/',
    server: {
        port: 4200,
    },
    build: {
        chunkSizeWarningLimit: 1000,
    },
    test: {
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        css: false,
        clearMocks: true,
    },
});
