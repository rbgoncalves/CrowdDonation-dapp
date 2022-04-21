import { toast } from "react-toastify";

export const newDonationToast = (address: string, amount: string) => {
  toast(`${address.substring(0, 6)} donated ${amount} ETH 🚀`, {
    position: "top-left",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
  });
}