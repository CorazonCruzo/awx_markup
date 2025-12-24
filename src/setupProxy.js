const { createProxyMiddleware } = require('http-proxy-middleware');

const API_CONFIG = {
  TARGET: 'https://awx.pro',
  SERIAL: 'a7307e89-fbeb-4b28-a8ce-55b7fb3c32aa',
};

module.exports = function(app) {
  app.use(
    '/b2api',
    createProxyMiddleware({
      target: API_CONFIG.TARGET,
      changeOrigin: true,
      onProxyReq: (proxyReq) => {
        proxyReq.setHeader('serial', API_CONFIG.SERIAL);
      },
    })
  );
};
