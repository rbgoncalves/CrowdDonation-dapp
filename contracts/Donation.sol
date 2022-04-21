//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;
pragma experimental ABIEncoderV2;

contract Donation {

    event NewCampaign(bytes32 indexed id, address indexed owner, string title, uint256 goal);
    event NewDonation(bytes32 indexed id, address indexed donator, uint256 donation, bool wasGoalAchieved);

    struct Campaign {
        bytes32 id;
        string title;
        uint256 goal;
        uint256 raised;
        uint256 withdrawed;
        bool achieved;
        address owner;
    }

    bytes32[] private campaignsIds;
    mapping(bytes32 => Campaign) public campaigns;

    function createCampaign(string memory _title, uint256 _goal) external {
        bytes32 _id = keccak256(abi.encodePacked(_title, _goal)); 

        Campaign memory newCampaign;
        newCampaign.id = _id;
        newCampaign.title = _title;
        newCampaign.goal = _goal;
        newCampaign.raised = 0;
        newCampaign.withdrawed = 0;
        newCampaign.achieved = false;
        newCampaign.owner = msg.sender;

        campaignsIds.push(_id);
        campaigns[_id] = newCampaign;

        emit NewCampaign(_id, msg.sender, _title, _goal);
    }

    function donate(bytes32 _campaignId) external payable {
        require(msg.value > 0, "You need to send money to donate!");

        Campaign storage campaign = campaigns[_campaignId];
        campaign.raised += msg.value;

        if (campaign.raised >= campaign.goal && campaign.achieved == false) {
            campaign.achieved = true;
        }

        emit NewDonation(_campaignId, msg.sender, msg.value, campaign.achieved);
    }
    
    function withdrawFromCampaign(bytes32 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];

        require(msg.sender == campaign.owner, "You need to be the owner of the campaign to withdraw money!");

        uint256 toBeWithdrawed = campaign.raised - campaign.withdrawed;

        payable(msg.sender).transfer(toBeWithdrawed);

        campaign.withdrawed += toBeWithdrawed;
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory values = new Campaign[](campaignsIds.length);

        for (uint256 i = 0; i < campaignsIds.length; i++) {
            Campaign storage campaign = campaigns[campaignsIds[i]];
            values[i] = campaign;
        }

        return values;
    }
    

}