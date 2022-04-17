import http = require('http');
import path from 'path';

import config from 'config';
import express, { static as staticMiddleware } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { isDev } from './helpers/env';
import initSocketIo from './helpers/socket.io';
import errorHandler from './middleware/express/errorHandler';
import notFoundHandler from './middleware/express/notFoundHandler';

const app = express();
const port = config.get<number>('server.port');

const startServer = async () => {
  // Configure some security headers
  if (isDev) {
    app.use(helmet({ contentSecurityPolicy: false }));
  } else {
    app.use(helmet());
  }

  // Register HTTP request logger
  app.use(morgan('dev'));

  // Configure body parser to accept json
  // app.use(json({ limit: config.server.bodyParserLimits.json }));
  // Configure body parser to accept urlencoded (file uploads)
  // app.use(urlencoded({ limit: config.server.bodyParserLimits.urlencoded, extended: true }));

  // Register handler for static assets
  app.use(staticMiddleware(path.resolve(__dirname, 'public')));

  // Register routes
  // app.use('/', routes);

  // Serve public/index.html
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  // Register custom not found handler
  app.use(notFoundHandler);

  // Register custom error handler (should registered the last)
  app.use(errorHandler);

  const server = http.createServer(app);

  initSocketIo(server);

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

startServer().catch((e) => console.log('Error while creating the server', e));

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Caught exception:', err.stack, err);
});
