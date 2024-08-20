import "@/styles/globals.css";
import {NextUIProvider} from "@nextui-org/react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { MyProvider } from "@/context";

export default function App({ Component, pageProps }) {
  return (
  <NextUIProvider>
     <MyProvider>
    <ToastContainer />
    <Component {...pageProps} />
    </MyProvider>
  </NextUIProvider>
  )
}
