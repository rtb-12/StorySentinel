import { ethers } from "hardhat";

async function main() {
  console.log("Deploying StorySentinel IP contract...");

  // Get the contract factory
  const StorySentinelIP = await ethers.getContractFactory("StorySentinelIP");

  // Deploy the contract
  const storySentinelIP = await StorySentinelIP.deploy();

  await storySentinelIP.deployed();

  console.log(`StorySentinelIP deployed to: ${storySentinelIP.address}`);

  // Verify contract on etherscan (if on mainnet/testnet)
  if (
    process.env.ETHERSCAN_API_KEY &&
    (network.name === "ethereum" || network.name === "polygon")
  ) {
    console.log("Waiting for block confirmations...");
    await storySentinelIP.deployTransaction.wait(6);

    console.log("Verifying contract...");
    try {
      await run("verify:verify", {
        address: storySentinelIP.address,
        constructorArguments: [],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.log("Contract verification failed:", error);
    }
  }

  // Save deployment info
  const deploymentInfo = {
    contractAddress: storySentinelIP.address,
    network: network.name,
    deployedAt: new Date().toISOString(),
    deployer: (await ethers.getSigners())[0].address,
  };

  console.log("Deployment Info:", deploymentInfo);

  // You can save this to a file for reference
  const fs = require("fs");
  fs.writeFileSync(
    `./deployments/${network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
