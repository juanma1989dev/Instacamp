import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    server: {
        host: process.env.VITE_HOST || 'localhost',
        port: Number(process.env.VITE_PORT) || 5173,
        hmr: {
            host: 'localhost', // o la IP de tu máquina si accedes desde fuera
        },
    },
    esbuild: {
        jsx: 'automatic',
    },
});
