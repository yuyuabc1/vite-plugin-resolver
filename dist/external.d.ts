import { Plugin as VitePlugin } from 'vite';
export default function externals(externals: Record<string, string>, options?: {
    /**
     * @default 'esm'
     * esm will generate code - const vue = window['Vue']; export { vue as default };
     * cjs will generate code - const vue = window['Vue']; module.exports = vue;
     */
    format: 'esm' | 'cjs';
}): VitePlugin;
