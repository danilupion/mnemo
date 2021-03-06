/* eslint-disable @typescript-eslint/no-var-requires */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/websocket', {
      target: 'http://localhost:3100',
      changeOrigin: true,
      ws: true,
    }),
  );
};
