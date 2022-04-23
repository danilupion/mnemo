import { ExtendedError } from 'socket.io/dist/namespace';
import { Socket } from 'socket.io/dist/socket';

const nameMiddleware = (socket: Socket, next: (err?: ExtendedError) => void) => {
  socket.data.name = socket.handshake.query.name;
  next();
};

export default nameMiddleware;
