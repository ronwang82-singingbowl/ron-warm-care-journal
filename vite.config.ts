import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({base:'/ron-warm-care-journal/',plugins:[react()],build:{outDir:'docs',sourcemap:false}});
