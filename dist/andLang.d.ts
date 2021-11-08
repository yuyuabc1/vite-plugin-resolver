import { Plugin as VitePlugin } from 'vite';
export default function addLang(options?: {
    lang: 'jsx' | 'tsx';
}): VitePlugin;
