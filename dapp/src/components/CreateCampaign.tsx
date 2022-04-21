import { useCallback, useState } from "react";
import { useEthers } from "../hooks/useEthers";
import Button from "../styles/Button";
import { Card } from "../styles/Card";
import { Input } from "../styles/Input";

const CreateCampaign = () => {
  const { createCampaign } = useEthers();
  const [title, setTitle] = useState('');
  const [amountGoal, setAmountGoal] = useState('');

  const allowSubmission = title.length > 0 && amountGoal.length > 0; 

  const submitNewCampaign = () => createCampaign(title, amountGoal);
  
  return (
    <Card>
      <h3 style={{marginBottom: 10}}>Create new campaign</h3>
      <div style={{ display: 'flex', justifyContent: 'end'}}>
        <Input placeholder="Title" defaultValue={title} onChange={({ target }) => setTitle(target.value)}/>
        <Input placeholder="Goal ETH" type="number" defaultValue={amountGoal} onChange={({ target }) => setAmountGoal(target.value)}/>
        <Button primary disabled={!allowSubmission} onClick={submitNewCampaign}>Create ✨</Button>
      </div>
    </Card>
  )
}

export default CreateCampaign;