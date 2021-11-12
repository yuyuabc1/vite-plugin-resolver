# vite-plugin-resolver

<p>
  <a href="https://www.npmjs.com/package/vite-plugin-resolver" target="_blank">
    <img alt="NPM package" src="https://img.shields.io/npm/v/vite-plugin-resolver.svg?style=flat">
  </a>
</p>

English | [中文](README_CN.md)

Provide some plug-ins required on vite parser, and now realize the following functions
1.Make vite work normally in webpack```externals```External dependencies in configuration items
2.Solve the problem that the ```JSX ``` file in vite fails to parse due to the loss of Lang tag

## 用法

```bash
npm i vite-plugin-resolver -D
```

All methods are configured in `vite.config.js`

### externals

```js
import { externals } from 'vite-plugin-resolver'
export default {
  plugins: [
    // externals(/* options */)
    externals({
      vue: 'Vue',
      react: 'React',
      'react-dom': 'ReactDOM',
    }),
  ]
}
```

#### Options

##### externals

Type: `Object`<br>

Default: `{ externals: Record<String, String> }`

##### options

Type: `String`

Default: `'esm' | 'cjs'`

esm will generate code - const vue = window['Vue']; export { vue as default };
cjs will generate code - const vue = window['Vue']; module.exports = vue;


### andlang

```js
import { andLang } from 'vite-plugin-resolver'
export default {
  plugins: [
    andLang(),
  ]
}
```