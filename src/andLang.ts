import { Plugin as VitePlugin } from 'vite'
import { parseComponent } from 'vue-template-compiler'

 export default function addLang(options?: { lang: 'jsx' | 'tsx' }): VitePlugin {
  return {
    name: 'vite-plugin-resolver-lang-jsx',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('.vue')) return

      const { script } = parseComponent(code)
      const JSX = script?.content && /<[A-Za-z]/.test(script.content)
      if (JSX) {
        return code.replace('<script>', `<script lang="${options?.lang || 'jsx'}">`)
      }
    },
  }
}