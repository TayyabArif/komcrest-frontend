import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useSocket = () => {
  const [socket, setSocket] = useState(null);
const url = process.env.NEXT_PUBLIC_BACKEND_URL.split('/api')[0]
  useEffect(() => {
    if (url) {
      const socketInstance = io(url, {
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
      console.error('URL is not defined');
    }
  }, [url]);

  return socket;
};

export default useSocket;
