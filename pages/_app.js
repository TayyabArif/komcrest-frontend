import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MyProvider } from "@/context"; // Use MyProvider here at the top level
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Loader from "@/components/commonComponent/Loader";
import { useMyContext } from "@/context";


// Move the component that uses `useMyContext` inside MyProvider

export default function App({ Component, pageProps }) {
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const router = useRouter();
 
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
        <AppContent Component={Component} pageProps={pageProps} />
      </MyProvider>
    </NextUIProvider>
  );
}

// Create a separate component to use `useMyContext`
const AppContent = ({ Component, pageProps }) => {
  const { overAllLoading} = useMyContext();
  // const socket = useSocket()
  return (
    <>
      {overAllLoading && <Loader />}
      <Component {...pageProps} />
    </>
  );
};
