import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/shoehorn.ts'),
            name: 'Shoehorn',
            formats: ['es', 'iife'],
            fileName: (format) => {
                if (format === 'es') {
                    return 'shoehorn.esm.js';
                }
                return 'shoehorn.min.js';
            },
        },
        minify: 'terser',
    },
    plugins: [
        dts({
            insertTypesEntry: true,
        }),
    ],
});
