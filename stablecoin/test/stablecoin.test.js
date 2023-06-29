const { expect } = require("chai");
const { ethers } = require("hardhat")
describe("nUSD", function () {
  let nUsdContract;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Deploy the contract
    const NUsdContract = await ethers.getContractFactory("nUSD");
    nUsdContract = await NUsdContract.deploy();
    await nUsdContract.deployed();

    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  it("should mint nUSD tokens when depositing ETH", async function () {
    // Deposit 1 ETH from addr1
    const depositAmount = ethers.utils.parseEther("1");
    await nUsdContract.connect(addr1).deposit({ value: depositAmount });

    // Check the balance of addr1
    const balance = await nUsdContract.balanceOf(addr1.address);
    expect(balance).to.equal(depositAmount.div(2));
  });

  it("should redeem ETH when calling the redeem function", async function () {
    // Mint nUSD tokens for addr1
    const nUsdAmount = ethers.utils.parseUnits("100", 18);
    await nUsdContract.connect(addr1).deposit({ value: ethers.utils.parseEther("1") });
  
    // Get the initial ETH balance of addr1
    const initialEthBalance = await ethers.provider.getBalance(addr1.address);
  
    // Redeem nUSD tokens for ETH
    await nUsdContract.connect(addr1).redeem(nUsdAmount);
  
    // Get the final ETH balance of addr1
    const finalEthBalance = await ethers.provider.getBalance(addr1.address);
  
    // Calculate the redeemed ETH amount
    const redeemedEthAmount = finalEthBalance.sub(initialEthBalance);
  
    // Check the redeemed ETH amount
    expect(redeemedEthAmount).to.be.above(0);
  });
  
it("Should have 18 decimals", async () => {
    expect(await nUsdContract.decimals()).to.equal(18)
})

});
