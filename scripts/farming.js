async function main() {
    // Deploy SavvyCoin
    const farming = await hre.ethers.getContractFactory("Farming");
    const farmingContract = await farming.deploy();
    await farmingContract.deployed();
    console.log("farmingContract deployed to:", farmingContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });