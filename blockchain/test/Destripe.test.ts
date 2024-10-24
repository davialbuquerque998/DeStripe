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

    await DestripeCollectionInstance.setAuthorizedContract(DestripeAddress);

    return {signers, DestripeCollectionInstance, DestripeInstance, DestripeAddress, DestripeCoinAddress, DestripeCoinInstance};
  }

  it("should mint an NFT (owner)", async ():Promise<void> => {
    const {signers, DestripeCollectionInstance, DestripeInstance, DestripeAddress, DestripeCoinAddress} = await loadFixture(deployFixture);

    const customer = signers[1].address;

    await DestripeCollectionInstance.mint(customer);

    const balanceOfCustomer:bigint = await DestripeCollectionInstance.balanceOf(customer);

    const lastTokenId:bigint = await DestripeCollectionInstance.getLastTokenId();

    const expectBaseUri:string = "http://127.0.0.1:3000/nfts/";

    const tokenUri = await DestripeCollectionInstance.tokenURI(lastTokenId);

    expect(tokenUri).to.equal(`${expectBaseUri}${lastTokenId}.json`);

    expect(balanceOfCustomer).to.equal(lastTokenId);

  });


  it("should NOT mint an NFT (not authorized)", async ():Promise<void> => {
    const {signers, DestripeCollectionInstance, DestripeInstance, DestripeAddress, DestripeCoinAddress} = await loadFixture(deployFixture);

    const customer = signers[1];

    const otherInstance = DestripeCollectionInstance.connect(customer);

    await expect(otherInstance.mint(customer)).to.be.revertedWith("Only the owner or the authorized contract can mint this token");

  });


  it("should NOT set authorized contract (not owner)", async ():Promise<void> => {
    const {signers, DestripeCollectionInstance, DestripeInstance, DestripeAddress, DestripeCoinAddress} = await loadFixture(deployFixture);

    const otherInstance = DestripeCollectionInstance.connect(signers[1]);

    await expect(otherInstance.setAuthorizedContract(hre.ethers.ZeroAddress)).to.be.revertedWithCustomError(DestripeCollectionInstance, "OwnableUnauthorizedAccount")
  });

  it("should set base URI", async ():Promise<void> => {
    const {signers, DestripeCollectionInstance, DestripeInstance, DestripeAddress, DestripeCoinAddress} = await loadFixture(deployFixture);

    const newUri:string = "http://newuri.com/";

    await DestripeCollectionInstance.setBaseUri(newUri);

    const expectedUri:string = await DestripeCollectionInstance.baseUri();

    expect(expectedUri).to.equal(newUri);
  });


  it("should NOT set base URI (not owner)", async ():Promise<void> => {
    const {signers, DestripeCollectionInstance, DestripeInstance, DestripeAddress, DestripeCoinAddress} = await loadFixture(deployFixture);

    const newUri:string = "http://newuri.com/";

    const otherInstance = DestripeCollectionInstance.connect(signers[1]);

    await expect(otherInstance.setBaseUri(newUri)).to.be.revertedWithCustomError(DestripeCollectionInstance, "OwnableUnauthorizedAccount");

  });


  it("should burn a NFT", async ():Promise<void> => {
    const {signers, DestripeCollectionInstance, DestripeInstance, DestripeAddress, DestripeCoinAddress} = await loadFixture(deployFixture);

    const customer = signers[1].address;

    await DestripeCollectionInstance.mint(customer);

    await DestripeCollectionInstance.burn(1);

    const balanceOfCustomer:bigint = await DestripeCollectionInstance.balanceOf(customer);

    expect(balanceOfCustomer).to.equal(0);


  });


  it("should NOT burn a NFT (not owner)", async ():Promise<void> => {
    const {signers, DestripeCollectionInstance, DestripeInstance, DestripeAddress, DestripeCoinAddress} = await loadFixture(deployFixture);

    const customer = signers[1];

    await DestripeCollectionInstance.mint(customer);

    const otherInstance = DestripeCollectionInstance.connect(customer);

    await expect(otherInstance.burn(1)).to.be.revertedWith("Only the owner or the authorized contract can burn this token");


  });


  it("should mint coins", async ():Promise<void> => {
    const {signers, DestripeCollectionInstance, DestripeInstance, DestripeAddress, DestripeCoinAddress, DestripeCoinInstance} = await loadFixture(deployFixture);

    const customer = signers[1];

    const amountToMint:bigint = hre.ethers.parseEther("500");

    await DestripeCoinInstance.mint(customer, amountToMint);

    const balanceOfCustomer:bigint = await DestripeCoinInstance.balanceOf(customer);

    expect(balanceOfCustomer).to.equal(amountToMint);

  });


  it("should NOT mint coins (not owner)", async ():Promise<void> => {
    const {signers, DestripeCollectionInstance, DestripeInstance, DestripeAddress, DestripeCoinAddress, DestripeCoinInstance} = await loadFixture(deployFixture);

    const customer = signers[1];

    const amountToMint:bigint = hre.ethers.parseEther("500");

    const otherInstance = DestripeCoinInstance.connect(customer);

    await expect(otherInstance.mint(customer, amountToMint)).to.be.revertedWithCustomError(DestripeCoinInstance, "OwnableUnauthorizedAccount");

  });


  /* it("should set Approval for All", async ():Promise<void> => {
    const {signers, DestripeCollectionInstance, DestripeInstance, DestripeAddress, DestripeCoinAddress} = await loadFixture(deployFixture);

  }); */

});
