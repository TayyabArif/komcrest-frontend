import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useCookies } from "react-cookie";

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const socketUrl = baseUrl ? `${baseUrl.split("/api")[0]}/api` : null;

  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const token = cookiesData?.token;

  const tabId = typeof window !== "undefined" ? sessionStorage.getItem("tab_id") : null;
  
  useEffect(() => {
    console.log()
    if (socketUrl && tabId) {
      console.log("tabIdtabIdtabIdtabIdtabIdtabIdtabId",tabId)
      const socketInstance = io(
        process.env.NEXT_PUBLIC_BACKEND_URL.split("/api")[0],
        {
          path: "/api/socket.io",
          query: { tabId },
          transports: ["websocket"],
        }
      );

      socketInstance.on("connect", () => {
        console.log("Socket connected:", socketInstance.id);
        socketInstance.emit("registerSocket", { socketId: socketInstance.id });
        setSocket(socketInstance);
      });

      socketInstance.on("connect_error", (error) => {
        console.error("Connection error:", error);
      });

      socketInstance.on("disconnect", () => {
        console.log("Socket disconnected");
        setSocket(null);
      });
      

      return () => {
        socketInstance.disconnect();
      };
    } else {
      console.error("Socket URL is not defined");
    }
  }, [socketUrl , tabId]);

  return socket;
};

export default useSocket;
