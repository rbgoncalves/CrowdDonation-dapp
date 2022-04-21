import { styled } from "@stitches/react";
import { useState } from "react";
import Button from "../styles/Button";
import { Card } from "../styles/Card";
import { Input } from "../styles/Input";

const Headline = styled("div", {
  display: "flex",
  justifyContent: "space-between",
});

type CampaignProps = {
  title: string;
  goal: string;
  raised: string;
  donationEnabled: boolean;
  isOwner: boolean;
  withdrawPending: number;
  donate: (amount: string) => void;
  withdraw: () => void
};

const getAchievedPercentage = (goal: string, raised: string) => {
  return (Number(raised) / Number(goal)) * 100;
}

const Campaign = (Props: CampaignProps) => {
  const {
    title,
    goal,
    raised,
    donationEnabled,
    isOwner,
    donate,
    withdraw,
    withdrawPending
  } = Props;

 const [input, setInput] = useState('');

  return (
    <Card>
      <Headline>
        <h3>{title}</h3>
        {donationEnabled && 
          <div>
            <Input type="number" placeholder="ETH" value={input} onChange={({ target }) => setInput(target.value)}/>
            <Button
              primary
              disabled={input.length === 0}
              onClick={() => {
                donate(input);
                setInput('');
              }}
            >
              Donate 🚀
            </Button>
          </div>
        }
        {isOwner &&
            <Button
              primary
              onClick={withdraw}
              disabled={withdrawPending <= 0}>
                Withdraw {withdrawPending} ETH 💰
            </Button>
        }
      </Headline>
      <p><b>Goal:</b> {goal} ETH</p>
      <p><b>Raised:</b> {raised} ETH</p>
      <p><b>Achieved:</b> {getAchievedPercentage(goal, raised)} %</p>
    </Card>
  )
}


export default Campaign;