async function main() {
  // Deploy SavvyCoin
  const SavvyCoin = await hre.ethers.getContractFactory("SVCToken");
  const coin = await SavvyCoin.deploy();
  await coin.deployed();
  console.log("SavvyToken deployed to:", coin.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });