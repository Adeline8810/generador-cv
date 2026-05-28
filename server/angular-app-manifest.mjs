
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://github.com/Adeline8810/generador-cv',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/Adeline8810/generador-cv"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 632, hash: '2535508417dc972530c892bb4e82bc0757152828f3f1c7dc70ad2cfd9f838b39', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1145, hash: '433275e17aa32bd6d96818e65b46f7fef2088aa9dfc8c0cc6cfcd6e62c191d6f', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 25093, hash: 'e309a0811eef0d254fc1af38ff03b269295b1a780c05ad0effa0abab2b1cdfe9', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
