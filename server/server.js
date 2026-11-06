import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config(); // Fallback if launched from directory with .env

import http from 'node:http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { initSocket } from './sockets/index.js';

// Read port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas before accepting HTTP requests
await connectDB();

// Express alone cannot handle WebSockets. We wrap it in a Node HTTP server,
// attach Socket.IO, and bind both to the same port.
const httpServer = http.createServer(app);
initSocket(httpServer);

// Start listening for incoming HTTP requests and WebSocket handshakes
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

