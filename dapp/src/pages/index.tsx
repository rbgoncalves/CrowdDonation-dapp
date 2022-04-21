import { styled } from "@stitches/react";
import type { NextPage } from "next";
import { ToastContainer } from "react-toastify";
import Campaign from "../components/Campaign";
import CreateCampaign from "../components/CreateCampaign";
import NavBar from "../components/NavBar";
import { EthersProvider, useEthers } from "../hooks/useEthers";

const Container = styled("div", {
  background:
    "linear-gradient(159deg, rgba(240,240,240,1) 0%, rgba(213,238,211,1) 100%)",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  padding: "0 20%",
});

const Campaigns = styled("div", {
  marginTop: 30,
});


const Home: NextPage = () => {
  const {
    isLogged,
    checkOwnership,
    donateToCampaign,
    withdrawCampaign,
    campaigns
  } = useEthers();
  
  return (
    <Container>
      <NavBar />
      <h1 style={{alignSelf: "center"}}>Crowd-Donation</h1>
      {isLogged && <CreateCampaign />}
      <Campaigns>
        {campaigns?.map((campaign) => {
            return (
              <Campaign
                key={campaign.id}
                {...campaign}
                donationEnabled={isLogged && !checkOwnership(campaign.owner)}
                isOwner={checkOwnership(campaign.owner)}
                donate={donateToCampaign(campaign.id)}
                withdraw={() => withdrawCampaign(campaign.id)}
              />
            );
        })}
      </Campaigns>
    </Container>
  );
};

export default Home;
