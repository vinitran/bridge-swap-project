// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fromWei = (value) => {
  return ethers.formatEther(value);
}

const toWei = (value) => {
  return ethers.parseUnits(value.toString(), "ether");
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function main() {
  // const BRIDGEPOOL = await hre.ethers.getContractFactory("BridgePool");
  // const TOKEN = await hre.ethers.getContractFactory("Token");
  const WETH = await hre.ethers.getContractFactory("WETH");
  const BRIDGEROUTER = await hre.ethers.getContractFactory("BridgeRouter");

  console.log("1");
  // const vini = await TOKEN.deploy("Vini Tran", "VINI", toWei(1000000000));
  const weth = await WETH.deploy("Wrapper Ether", "WETH");
  await weth.waitForDeployment();
  console.log("weth: ", weth.target);

  const bridgeRouter = await BRIDGEROUTER.deploy(weth.target);
  await bridgeRouter.waitForDeployment();
  
  console.log("bridge: ");
  console.log("bridge: ", bridgeRouter.target);

  // await bridgeRouter.createBridgePool("0x32D7eEE6513224f459D221BfED0C3af45343CbB7");
  // sleep(3000)
  // sleep(30000)
  // await bridgeRouter.createBridgePool("0x5846e4dbff5E8B3718281997264bD2B3e074C3A8");

  // const bridgePoolWETHAddr = await bridgeRouter.bridgePools(weth.target);
  // sleep(30000)
  // sleep(30000)
  // await weth.changeBridgePool(bridgePoolWETHAddr);

  // sleep(30000)
  // await vini.transfer(addr1, toWei(1000000))
  // sleep(30000)
  // await vini.transfer(addr2, toWei(1000000))

  // sleep(30000)
  // await bridgeRouter.grantRole(deployer.address);
  console.log("end.")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.log(error)
});
