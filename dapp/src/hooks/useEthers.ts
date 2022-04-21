import constate from "constate";
import { ethers } from "ethers";
import { formatBytes32String, formatEther, parseBytes32String, parseEther } from "ethers/lib/utils";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import DonationContract from "../contract/Donation.json";
import { CONTRACT_ADDRESS } from "../constants";
import { newDonationToast } from "../utils/toast";

type RawCampaign = {
  id: string;
  title: ethers.utils.BytesLike;
  owner: string;
  goal: ethers.BigNumberish;
  raised: ethers.BigNumberish;
  withdrawed: ethers.BigNumberish;
  achieved: boolean;
};

type Campaign = {
  id: string;
  title: string;
  owner: string;
  goal: string;
  raised: string;
  achieved: boolean;
  withdrawPending: number;
};

const useEthersHook = () => {
  const [loggedAccount, setLoggedAccount] = useState<string>();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const contract = useRef<ethers.Contract>();

  const attemptToConnectWallet = async () => {
    try {
      if (window.ethereum) {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts'});

        setLoggedAccount(account.toLowerCase());
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  const createCampaign = async (title: string, goal: string) => {
    const txn = await contract.current?.createCampaign(
      formatBytes32String(title),
      parseEther(goal)
    );

    await toast.promise(
      txn.wait,
      {
        pending: 'Creating a campaign...',
        success: 'Campaign created!!',
        error: 'Error creating campaign'
      }
    );

    getCampaigns();
  }

  const donateToCampaign = (campaignId: string) => async (amount: string) => {
    const txn = await contract.current?.donate(
      campaignId,
      { value: parseEther(amount) }
    );

    await toast.promise(
      txn.wait,
      {
        pending: 'Loading ...',
        success: 'Donation done!!',
        error: 'Error donating :('
      }
    );

    getCampaigns();
  }

  const withdrawCampaign = async (campaignId: string) => {    
    const txn = await contract.current?.withdrawFromCampaign(campaignId);

    await toast.promise(
      txn.wait,
      {
        pending: 'Processing withdraw ...',
        success: 'Successful withdraw!!',
        error: 'Error withdrawing :('
      }
    );

    getCampaigns();
  }

  const connectToSmartContract = () => {
    try{    
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const bankContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        DonationContract.abi,
        signer
      );

      contract.current = bankContract;

    } catch (error) {
      console.error(error);
    }
  }

  const disconnectAccount = () => {
    setLoggedAccount(undefined);
  }

  useEffect(() => {
    if(!window.ethereum) return;
    attemptToConnectWallet()
    
    window.ethereum.on('accountsChanged', disconnectAccount);

    return () => {
      window.ethereum.removeListener('accountsChanged', disconnectAccount);
    }
  }, []);

  useEffect(() => {
    if (!loggedAccount) return;
    
    connectToSmartContract();

    getCampaigns();

    contract.current?.on('NewDonation', (_, donator: string, amount: ethers.BigNumberish) => {
      newDonationToast(donator, formatEther(amount));
    });

    return () => {
      contract.current?.removeAllListeners("NewDonation");
    };

  }, [loggedAccount])

  const getCampaigns = async () => {
    const raw = (await contract.current?.getCampaigns() as RawCampaign[]);

    const campaigns = raw?.map((campaign) => {
      const { id, title, owner, goal, raised, achieved, withdrawed } = campaign;

      const raisedEth = formatEther(raised);
      const withdrawedEth = formatEther(withdrawed);
      
      return {
        id,
        title: parseBytes32String(title),
        owner,
        goal: formatEther(goal),
        raised: raisedEth,
        achieved,
        withdrawPending: Number(raisedEth) - Number(withdrawedEth)
      }
    })
    
    setCampaigns(campaigns);
  }

  const checkOwnership = (ownerAddress: string) => {
    return ownerAddress.toLowerCase() === loggedAccount?.toLowerCase();
  }
  
  return {
    attemptToConnectWallet,
    checkOwnership,
    isLogged: Boolean(loggedAccount),
    loggedAccount,
    createCampaign,
    campaigns,
    donateToCampaign,
    withdrawCampaign
  }
}


export const [EthersProvider, useEthers] = constate(useEthersHook);

