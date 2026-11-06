import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

let io = null; // Singleton Socket.IO instance accessible across the server

/**
 * Initializes the Socket.IO server attached to the Node HTTP server.
 * Configures CORS, JWT authentication middleware, and room assignments.
 *
 * @param {import('http').Server} httpServer
 * @returns {Server}
 */
export function initSocket(httpServer) {
  io = new Server(httpServer, {
    // Socket.IO requires its own CORS configuration, distinct from Express middleware
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // ---------------------------------------------------------------------------
  // SOCKET AUTHENTICATION MIDDLEWARE
  // ---------------------------------------------------------------------------
  // Intercepts connection attempts during the initial WebSocket handshake.
  // Enforces that every connected socket presents a valid, unexpired JWT.
  // ---------------------------------------------------------------------------
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication required: Token missing'));
      }

      // Verify cryptographic signature and expiration
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (!payload?.id) {
        return next(new Error('Unauthorized: Invalid token payload'));
      }

      // Confirm user exists in MongoDB and retrieve their active role
      const user = await User.findById(payload.id).select('role');
      if (!user) {
        return next(new Error('Unauthorized: User not found'));
      }

      // Attach verified server-derived identity to socket.data
      socket.data.user = {
        id: user._id.toString(),
        role: user.role,
      };

      next(); // Authentication successful
    } catch (err) {
      next(new Error(`Unauthorized: ${err.message}`));
    }
  });

  // ---------------------------------------------------------------------------
  // ROOM ASSIGNMENT & CONNECTION LIFECYCLE
  // ---------------------------------------------------------------------------
  io.on('connection', (socket) => {
    const { id, role } = socket.data.user;

    // Join user's personal private room:
    // Enables targeted notifications (e.g. donor alerts) across multiple devices/tabs
    socket.join(`user:${id}`);

    // If the authenticated user is an NGO, join the collective 'ngos' discovery room
    if (role === 'ngo') {
      socket.join('ngos');
    }

    socket.on('disconnect', (reason) => {
      // Disconnection handled cleanly; rooms are automatically left by Socket.IO
    });
  });

  return io;
}

/**
 * Returns the active Socket.IO server instance.
 * May be null or undefined if running in standalone test mode without sockets.
 *
 * @returns {Server|null}
 */
export function getIO() {
  return io;
}
