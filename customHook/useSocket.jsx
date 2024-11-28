import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const socketUrl = baseUrl ? `${baseUrl.split('/api')[0]}/api` : null;

  useEffect(() => {
    if (socketUrl) {
      const socketInstance = io(process.env.NEXT_PUBLIC_BACKEND_URL.split('/api')[0], {
        path: '/api/socket.io',
        transports: ['websocket'],
      });

      socketInstance.on('connect', () => {
        console.log('Socket connected:', socketInstance.id);
        setSocket(socketInstance);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
        setSocket(null);
      });

      return () => {
        socketInstance.disconnect();
      };
    } else {
      console.error('Socket URL is not defined');
    }
  }, [socketUrl]);

  return socket;
};

export default useSocket;
