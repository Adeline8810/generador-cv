
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://adeline8810.github.io/generador-cv/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/generador-cv"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 632, hash: '099390bc3ec914d7668a44d0787f2162744ce3580bf062f5c3e089e84744d994', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1145, hash: '2e6b6bc9bf4591879504906be39b2fb4ca5421d1f206861b3b7657641f1eda53', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 25093, hash: 'e1d70b38553695a521a67ab8ef0c44e9483bc69b489c550f03ab285e332fbb1f', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
