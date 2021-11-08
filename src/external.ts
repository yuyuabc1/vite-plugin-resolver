/* eslint-disable */
import path from 'path'
import * as fs from 'fs'
import { Alias, Plugin as VitePlugin } from 'vite'

export default function externals(
  externals: Record<string, string>,
  options?: {
    /**
     * @default 'esm'
     * esm will generate code - const vue = window['Vue']; export { vue as default };
     * cjs will generate code - const vue = window['Vue']; module.exports = vue;
     */
    format: 'esm' | 'cjs'
  },
): VitePlugin {
  const modCache: Record<string, string> = {}
  const root = process.cwd()
  const node_modules = path.join(root, 'node_modules')
  const viteExternals = '.vite-plugin-resolver-externals'
  const emptyExternals = Object.keys(externals).length === 0;

  return {
    name: '.vite-plugin-resolver-externals',
    config(config) {
      if (emptyExternals) return;
      // ensure viteExternals exist
      const externalsDir = path.join(node_modules, viteExternals)
      fs.existsSync(externalsDir) || fs.mkdirSync(externalsDir)

      // generate external module file.
      for (const [mod, iifeName] of Object.entries(externals)) {
        const modFilename = path.join(node_modules, viteExternals, `${mod}.js`)
        if (!fs.existsSync(modFilename)) {
          const modContent = options?.format === 'cjs'
            ? `module.exports = window['${iifeName}'];`
            : `const ${mod} = window['${iifeName}']; export { ${mod} as default }`
          fs.writeFileSync(modFilename, modContent)
        }
      }

      // merge externals module to alias
      const withExternalsAlias: Alias[] = Object.keys(externals).map(key => ({
        find: key,
        // splice node_modules prefix for third party package.jon correct resolved
        // eg: vue
        replacement: `node_modules/${viteExternals}/${key}.js`,
      }))
      const alias = config.resolve?.alias ?? {}
      if (Object.prototype.toString.call(alias) === '[object Object]') {
        for (const [find, replacement] of Object.entries(alias)) {
          withExternalsAlias.push({ find, replacement })
        }
      } else if (Array.isArray(alias)) {
        withExternalsAlias.push(...alias)
      }

      config.resolve = {
        ...(config.resolve ?? {}),
        alias: withExternalsAlias,
      }
    },
    load(id) {
      if (id.includes(viteExternals)) {
        const modFilename = path.join(root, id)

        return modCache[modFilename] || (modCache[modFilename] = fs.readFileSync(modFilename, 'utf8'))
      }
    },
  }
}
