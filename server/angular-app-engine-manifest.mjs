
export default {
  basePath: 'https://adeline8810.github.io/generador-cv',
  allowedHosts: [],
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
