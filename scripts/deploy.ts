import { ethers, network, run } from "hardhat";

const main = async () => {
  // Instance
  const [owner] = await ethers.getSigners();

  // Compile contracts
  await run("compile");
  console.log("Compiled contracts.");

  const networkName = network.name;

  // Sanity checks
  if (networkName === "mainnet") {
    if (!process.env.KEY_MAINNET) {
      throw new Error(
        "Missing private key, refer to README 'Deployment' section"
      );
    }
  } else if (networkName === "testnet") {
    if (!process.env.KEY_TESTNET) {
      throw new Error(
        "Missing private key, refer to README 'Deployment' section"
      );
    }
  } else if (networkName === "mumbai") {
    if (!process.env.KEY_POLYGON_TESTNET) {
      throw new Error(
        "Missing private key, refer to README 'Deployment' section"
      );
    }
  } else if (networkName === "local") {
    if (!process.env.KEY_LOCAL) {
      throw new Error(
        "Missing private key, refer to README 'Deployment' section"
      );
    }
  }

  console.log("Deploying to network:", networkName);

  // Deploy GameReward
  console.log("Deploying GameReward");
  const GameReward = await ethers.getContractFactory("GameReward");
  const gameReward = await GameReward.deploy();
  await gameReward.deployed();
  const gameRewardAddress = gameReward.address;
  console.log("Deploy successfully! GameReward address = ", gameRewardAddress);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
