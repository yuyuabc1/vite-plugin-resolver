import * as fs from 'fs'

declare class File {
  name: string

  importPath: string
}

function parsePagesDirectory() {
  const files = fs.readdirSync('./src/views').map((f: string) => (
    { name: f.split('.')[0], importPath: `/src/views/${f}` }));
  const imports = files.map((f: File) => `import ${f.name} from '${f.importPath}'`);
  const routes = files.map((f: File) => `{ name: '${f.name}', path: '/${f.name}',component: ${f.name},}`);
  return { imports, routes };
}


export default function generate() {
  const { imports, routes } = parsePagesDirectory();
  const moduleContent = `${imports.join('')}    export const routes = [${routes.join(', ')}]`;
  const configureServer = [async ({ app }) => {
    app.use(async (ctx, next) => {
      if (ctx.path.startsWith('/@modules/vue-auto-routes')) {
        ctx.type = 'js';
        ctx.body = moduleContent;
      } else {
        await next();
      }
    });
  }];
  return { configureServer };
};