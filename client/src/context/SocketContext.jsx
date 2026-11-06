import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext({
  socket: null,
  connected: false,
});

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const userId = user?._id || user?.id;

  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // If unauthenticated or logged out, ensure no active socket connection remains
    if (!userId) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    const token = localStorage.getItem('annaseva_token');
    if (!token) return;

    // Connect to backend WebSocket origin (without /api)
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    // Transmit JWT token during handshake for socket middleware verification
    const newSocket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'], // Prioritize WebSocket with polling fallback
    });

    newSocket.on('connect', () => {
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
      setConnected(false);
    });

    setSocket(newSocket);

    // CLEANUP on unmount, logout, or session renewal:
    // Disconnect socket cleanly to avoid ghost connections and duplicate listeners
    return () => {
      newSocket.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
}

/**
 * Custom hook to access the active socket instance and connection status.
 *
 * @returns {{ socket: import('socket.io-client').Socket|null, connected: boolean }}
 */
export const useSocket = () => useContext(SocketContext);
