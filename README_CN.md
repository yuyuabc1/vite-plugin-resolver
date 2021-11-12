# vite-plugin-resolver

<p>
  <a href="https://www.npmjs.com/package/vite-plugin-resolver" target="_blank">
    <img alt="NPM package" src="https://img.shields.io/npm/v/vite-plugin-resolver.svg?style=flat">
  </a>
</p>

中文 | [English](README.md)

提供vite 解析器上需要的一些插件，现已实现以下功能
1.使vite正常使用webpack中```externals```配置项中的外部依赖
2.解决vite中```jsx``文件由于丢失lang标签而解析失败的问题

## 用法

```bash
npm i vite-plugin-resolver -D
```

所有方法都配置在 `vite.config.js`，通过直接调用

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

#### 配置

##### externals

Type: `Object`<br>

Default: `{ externals: Record<String, String> }`

##### options

Type: `String`

Default: `'esm' | 'cjs'`

esm 选项生成的代码 - const vue = window['Vue']; export { vue as default };
cjs 选项生成的代码 - const vue = window['Vue']; module.exports = vue;


### andlang

```js
import { andLang } from 'vite-plugin-resolver'
export default {
  plugins: [
    andLang(),
  ]
}
```