(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('path'), require('fs')) :
  typeof define === 'function' && define.amd ? define(['path', 'fs'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["vite-plugin-resolver"] = factory(global.path, global.fs));
})(this, (function (path, fs) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n["default"] = e;
    return Object.freeze(n);
  }

  var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
  var fs__namespace = /*#__PURE__*/_interopNamespace(fs);

  /* eslint-disable */
  function externals(externals, options) {
      const modCache = {};
      const root = process.cwd();
      const node_modules = path__default["default"].join(root, 'node_modules');
      const viteExternals = '.vite-plugin-resolver-externals';
      const emptyExternals = Object.keys(externals).length === 0;
      return {
          name: '.vite-plugin-resolver-externals',
          config(config) {
              var _a, _b, _c;
              if (emptyExternals)
                  return;
              // ensure viteExternals exist
              const externalsDir = path__default["default"].join(node_modules, viteExternals);
              fs__namespace.existsSync(externalsDir) || fs__namespace.mkdirSync(externalsDir);
              // generate external module file.
              for (const [mod, iifeName] of Object.entries(externals)) {
                  const modFilename = path__default["default"].join(node_modules, viteExternals, `${mod}.js`);
                  if (!fs__namespace.existsSync(modFilename)) {
                      const modContent = (options === null || options === void 0 ? void 0 : options.format) === 'cjs'
                          ? `module.exports = window['${iifeName}'];`
                          : `const ${mod} = window['${iifeName}']; export { ${mod} as default }`;
                      fs__namespace.writeFileSync(modFilename, modContent);
                  }
              }
              // merge externals module to alias
              const withExternalsAlias = Object.keys(externals).map(key => ({
                  find: key,
                  // splice node_modules prefix for third party package.jon correct resolved
                  // eg: vue
                  replacement: `node_modules/${viteExternals}/${key}.js`,
              }));
              const alias = (_b = (_a = config.resolve) === null || _a === void 0 ? void 0 : _a.alias) !== null && _b !== void 0 ? _b : {};
              if (Object.prototype.toString.call(alias) === '[object Object]') {
                  for (const [find, replacement] of Object.entries(alias)) {
                      withExternalsAlias.push({ find, replacement });
                  }
              }
              else if (Array.isArray(alias)) {
                  withExternalsAlias.push(...alias);
              }
              config.resolve = {
                  ...((_c = config.resolve) !== null && _c !== void 0 ? _c : {}),
                  alias: withExternalsAlias,
              };
          },
          load(id) {
              if (id.includes(viteExternals)) {
                  const modFilename = path__default["default"].join(root, id);
                  return modCache[modFilename] || (modCache[modFilename] = fs__namespace.readFileSync(modFilename, 'utf8'));
              }
          },
      };
  }

  function parsePagesDirectory() {
      const files = fs__namespace.readdirSync('./src/views').map((f) => ({ name: f.split('.')[0], importPath: `/src/views/${f}` }));
      const imports = files.map((f) => `import ${f.name} from '${f.importPath}'`);
      const routes = files.map((f) => `{ name: '${f.name}', path: '/${f.name}',component: ${f.name},}`);
      return { imports, routes };
  }
  function generate() {
      const { imports, routes } = parsePagesDirectory();
      const moduleContent = `${imports.join('')}    export const routes = [${routes.join(', ')}]`;
      const configureServer = [async ({ app }) => {
              app.use(async (ctx, next) => {
                  if (ctx.path.startsWith('/@modules/vue-auto-routes')) {
                      ctx.type = 'js';
                      ctx.body = moduleContent;
                  }
                  else {
                      await next();
                  }
              });
          }];
      return { configureServer };
  }

  // import { langJsx } from './utils';
  var index = {
      externals,
      generateRoute: generate
  };

  return index;

}));
