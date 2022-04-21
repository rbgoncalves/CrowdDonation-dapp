import { styled } from "@stitches/react";
import { useEthers } from "../hooks/useEthers";
import Button from "../styles/Button";

const Container = styled("div", {
  display: "flex",
  justifyContent: "end",
});

const NavBar = () => {
  const { attemptToConnectWallet, isLogged, loggedAccount } = useEthers();
  
  return (
    <Container>
      <Button 
        secondary
        style={{ margin: 20 }}
        big
        onClick={attemptToConnectWallet}>
          {isLogged ? `${loggedAccount?.substring(0, 8)}...🔓` : "Connect your wallet 🔑"}
      </Button>
    </Container>
  );
};

export default NavBar;
