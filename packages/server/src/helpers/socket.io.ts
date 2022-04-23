import { Server as HttpServer } from 'http';

import { Server } from 'socket.io';

import name from '../middleware/socket.io/name';
import table from '../middleware/socket.io/table';

const init = (server: HttpServer) => {
  const io = new Server(server, { path: '/websocket' });

  io.use(name);
  io.use(table);
};

export default init;
