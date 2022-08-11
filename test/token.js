// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");

describe("SavvyToken contract", function () {
    let SavvyCoin;
    let hardhatSavvycoin;
    let owner;
    let addr1;
    let addr2;
    let addr3;
    let addrs;
    EXCHANGE_WALLET = "0x23f15B362CfC6038E0248c5Fa56f57bcf5B3EA1b";
    DIVIDEND_WALLET = "0x90ec93f24EffffEDf7e44F79AC32fF1EB4ee7e2f";
    LIFE_WALLET = "0xFDB4070D9c150B7a97b9789e286A0b342a320390";

    // `beforeEach` will run before each test, re-deploying the contract every
    // time. It receives a callback, which can be async.
    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        SavvyCoin = await ethers.getContractFactory("SavvyCoinUpgradable");
        [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

        // To deploy our contract, we just have to call Token.deploy() and await
        // for it to be deployed(), which happens once its transaction has been
        // mined.
        hardhatSavvycoin = await upgrades.deployProxy(SavvyCoin);
    });

    // You can nest describe calls to create subsections.
    describe("Deployment", function () {
        // `it` is another Mocha function. This is the one you use to define your
        // tests. It receives the test name, and a callback function.

        // If the callback function is async, Mocha will `await` it.
        it("Should set the right owner", async function () {
            // Expect receives a value, and wraps it in an Assertion object. These
            // objects have a lot of utility methods to assert values.

            // This test expects the owner variable stored in the contract to be equal
            // to our Signer's owner.
            expect(await hardhatSavvycoin.owner()).to.equal(owner.address);
        });

        it("Should initiate 1000000 tokens to owner", async function () {
            expect(await hardhatSavvycoin.balanceOf(owner.address)).to.equal(
                ethers.utils.parseEther("1000000.0")
            );
        });

        it("Should initiate 500 amountMinting tokens", async function () {
            expect(await hardhatSavvycoin.amountMinting()).to.equal(
                ethers.utils.parseEther("500.0")
            );
        });
    });

    describe("Mint Function", function () {
        it("People without allow to access to mint cannot use this function", async function () {
            await expect(hardhatSavvycoin.connect(addr1).mint()).to.be.revertedWith(
                "Not allowed!"
            );
        });

        it("People who is allowed to access to mint can use this function", async function () {
            await hardhatSavvycoin.mint();
            const currentMintingCoin = await hardhatSavvycoin.currentMintingCoin();
            await expect(BigNumber.from(currentMintingCoin)).to.equal(
                BigNumber.from("500000000000000000000")
            );
        });

        it("Should emit Transfer event", async function () {
            await expect(await hardhatSavvycoin.mint())
                .to.emit(hardhatSavvycoin, "Transfer")
                .withArgs(
                    "0x0000000000000000000000000000000000000000",
                    owner.address,
                    BigNumber.from("500000000000000000000")
                );
        });
    });

    describe("Punish Function", function () {
        beforeEach(async function () {
            await hardhatSavvycoin.transfer(
                addr1.address,
                ethers.utils.parseEther("100000.0")
            );
        });

        it("LIFE_WALLET should recieve 50% fee", async function () {
            await hardhatSavvycoin
                .connect(addr1)
                .punish(ethers.utils.parseEther("100000.0"));
            const money_LIFE_WALLET = await hardhatSavvycoin.balanceOf(LIFE_WALLET);
            await expect(money_LIFE_WALLET).to.equal(
                ethers.utils.parseEther("50000.0")
            );
        });

        it("OWNER should recieve 50% fee", async function () {
            const money_before_OWNER = (
                await hardhatSavvycoin.balanceOf(owner.address)
            ).toString();
            console.log(ethers.utils.formatEther(money_before_OWNER));
            await hardhatSavvycoin
                .connect(addr1)
                .punish(ethers.utils.parseEther("100000.0"));
            const money_OWNER = await hardhatSavvycoin.balanceOf(owner.address);
            await expect(parseInt(ethers.utils.formatEther(money_OWNER))).to.equal(
                parseInt(ethers.utils.formatEther(money_before_OWNER)) + 50000
            );
        });
    });

    describe("sendTokenToStaff Function", function () {
        it("People without right to access to reward cannot use this function", async function () {
            await expect(
                hardhatSavvycoin
                    .connect(addr1)
                    .sendTokenToStaff([addr2.address, addr3.address])
            ).to.be.revertedWith("Not allowed!");
        });

        describe("if addresses array has length not equal to 0", function () {
            beforeEach(async () => {
                await hardhatSavvycoin.mint();
            });

            it("The users should receive equal amount of reward", async function () {
                const params = [addr1.address, addr2.address];
                const currentMintingCoin = await hardhatSavvycoin.currentMintingCoin();
                const amount = currentMintingCoin / params.length;

                await hardhatSavvycoin.sendTokenToStaff(params);
                const balanceOfArr1 = await hardhatSavvycoin.balanceOf(addr1.address);
                const balanceOfArr2 = await hardhatSavvycoin.balanceOf(addr2.address);

                await expect(BigNumber.from(balanceOfArr1)).to.equal(
                    BigNumber.from(amount.toString())
                );
                await expect(BigNumber.from(balanceOfArr2)).to.equal(
                    BigNumber.from(amount.toString())
                );
            });

            it("The currentMintingCoin should be equal to 0", async function () {
                const params = [addr1.address, addr2.address];
                await hardhatSavvycoin.sendTokenToStaff(params);
                const currentMintingCoin = await hardhatSavvycoin.currentMintingCoin();

                await expect(currentMintingCoin).to.equal(0);
            });
        });

        describe("if addresses array has length equal to 0", function () {
            beforeEach(async () => {
                await hardhatSavvycoin.mint();
            });

            it("The owner should receive all currentMintingCoin", async function () {
                await hardhatSavvycoin.sendTokenToStaff([]);
                const balanceOfOwner = await hardhatSavvycoin.balanceOf(owner.address);

                await expect(BigNumber.from(BigNumber.from(balanceOfOwner))).to.equal(
                    "1000500000000000000000000"
                );
            });

            it("The currentMintingCoin should be equal to 0", async function () {
                await hardhatSavvycoin.sendTokenToStaff([]);
                const currentMintingCoin = await hardhatSavvycoin.currentMintingCoin();

                await expect(currentMintingCoin).to.equal(0);
            });
        });
    });
});
