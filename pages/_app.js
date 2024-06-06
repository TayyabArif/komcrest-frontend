import "@/styles/globals.css";
import {NextUIProvider} from "@nextui-org/react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }) {
  return (
  <NextUIProvider>
    <ToastContainer />
    <Component {...pageProps} />
  </NextUIProvider>
  )
}
