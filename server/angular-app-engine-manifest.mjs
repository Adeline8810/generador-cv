
export default {
  basePath: 'https://github.com/Adeline8810/generador-cv',
  allowedHosts: [],
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
