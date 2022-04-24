import { Server as HttpServer } from 'http';

import { Server } from 'socket.io';

import memoryGame from '../middleware/socket.io/memoryGame';
import name from '../middleware/socket.io/name';
import room from '../middleware/socket.io/room';

const init = (server: HttpServer) => {
  const io = new Server(server, { path: '/websocket' });

  io.use(name);
  io.use(room);
  io.use(memoryGame);
};

export default init;
