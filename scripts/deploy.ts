import { ethers } from "hardhat";

async function main() {
  const Donation = await ethers.getContractFactory("Donation");
  const donation = await Donation.deploy();

  await donation.deployed();

  console.log("Donation smart-contract deployed to:", donation.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
