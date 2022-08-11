pragma solidity ^0.6.0;

import "@pancakeswap/pancake-swap-lib/contracts/token/BEP20/BEP20.sol";

contract SVCToken is BEP20 {
    uint256 public ETHER = 10**18;

    constructor() public BEP20("SavvyCoin", "SVC") {
        _mint(msg.sender, 1000000000 * ETHER);
    }
}
