const hre = require("hardhat");

async function main() {
    const FACTORY_ADDRESS = '0xB7926C0430Afb07AA7DEfDE6DA862aE0Bde767bc'
    const WBNB_ADDRESS = '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd'
    // Deploy SavvyCoin
    const Router = await hre.ethers.getContractFactory("PancakeRouter");
    const mainRouter = await Router.deploy(FACTORY_ADDRESS, WBNB_ADDRESS);
    console.log("mainRouter 1 deployed to:", mainRouter.address);
    await mainRouter.deployed();
    console.log("mainRouter deployed to:", mainRouter.address);

    const Router01 = await hre.ethers.getContractFactory("PancakeRouter01");
    const mainRouter01 = await Router01.deploy(FACTORY_ADDRESS, WBNB_ADDRESS);
    await mainRouter01.deployed();
    console.log("mainRouter01 deployed to:", mainRouter01.address)

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });