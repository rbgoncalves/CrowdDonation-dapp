import "../styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from "next/app";
import { EthersProvider } from "../hooks/useEthers";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <EthersProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </EthersProvider>
  );
}

export default MyApp;
