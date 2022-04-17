import { Server as HttpServer } from 'http';

import { Server } from 'socket.io';

import table from '../middleware/socket.io/table';

const init = (server: HttpServer) => {
  const io = new Server(server, { path: '/websocket' });

  io.use(table(io));
};

export default init;
