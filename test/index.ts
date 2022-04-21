import { expect } from "chai";
import { ethers } from "hardhat";

describe("donation", function () {
  it("Should return the new campaign when created", async function () {
    const Donation = await ethers.getContractFactory("Donation");
    const donation = await Donation.deploy();
    await donation.deployed();

    expect(await donation.getCampaigns()).to.deep.equal([]);

    const createCampaignTx = await donation.createCampaign("Buy course", 10);

    // wait until the transaction is mined
    await createCampaignTx.wait();

    expect(await donation.getCampaigns()).to.have.length(1);
  });
});
