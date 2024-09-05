import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MyProvider } from "@/context";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (currentPath == "/") {
        removeCookie("myCookie", { path: "/" });
        router.push("/vendor/login/access");
        localStorage.removeItem("selectedSideBar");
      }
    }
  }, []);

  return (
    <NextUIProvider>
      <MyProvider>
        <ToastContainer />
        <Component {...pageProps} />
      </MyProvider>
    </NextUIProvider>
  );
}
