import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Destripe", function () {
  
  async function deployFixture() {
    const signers = await hre.ethers.getSigners();
    const DestripeCollectionFactory = await hre.ethers.getContractFactory("DestripeCollection");

    const DestripeCollectionInstance = await DestripeCollectionFactory.deploy();

    await DestripeCollectionInstance.waitForDeployment();

    const DestripeCollectionAddress = await DestripeCollectionInstance.getAddress();

    const DestripeCoinFactory = await hre.ethers.getContractFactory("DestripeCoin");

    const DestripeCoinInstance = await DestripeCoinFactory.deploy();

    const DestripeCoinAddress = await DestripeCoinInstance.getAddress();

    const DestripeFactory = await hre.ethers.getContractFactory("Destripe");

    const DestripeInstance = await DestripeFactory.deploy(DestripeCoinAddress, DestripeCollectionAddress);

    const DestripeAddress = await DestripeInstance.getAddress();

    return {signers, DestripeCollectionInstance, DestripeInstance, DestripeAddress};
  }

  it("should mint a token", async ():Promise<void> => {
    const {signers, DestripeCollectionInstance, DestripeInstance, DestripeAddress} = await loadFixture(deployFixture);

    const customer = signers[1].address;

    await DestripeCollectionInstance.setAuthorizedContract(DestripeAddress);
    await DestripeCollectionInstance.mint(customer);

    const balanceOfCustomer:bigint = await DestripeCollectionInstance.balanceOf(customer);

    expect(balanceOfCustomer).to.equal(1);

  })

});
