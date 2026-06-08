/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
// Project-page на GitHub Pages обслуживается из подпути /radio-pwa/.
// В dev оставляем корень, чтобы локально открывался по / .
export default defineConfig(function (_a) {
    var command = _a.command;
    var base = command === 'build' ? '/radio-pwa/' : '/';
    return {
        base: base,
        plugins: [
            react(),
            VitePWA({
                registerType: 'autoUpdate',
                manifest: {
                    name: 'Радио',
                    short_name: 'Радио',
                    description: 'Онлайн-радио со всего мира',
                    lang: 'ru',
                    theme_color: '#0f172a',
                    background_color: '#0f172a',
                    display: 'standalone',
                    id: base,
                    start_url: base,
                    scope: base,
                    icons: [
                        { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
                        { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
                        { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
                    ]
                },
                workbox: {
                    globPatterns: ['**/*.{js,css,html,svg,png,ico}']
                }
            })
        ],
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: ['./src/test/setup.ts']
        }
    };
});
