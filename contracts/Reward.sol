// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.6.12;

import "@uniswap/lib/contracts/libraries/TransferHelper.sol";
import "@pancakeswap/pancake-swap-lib/contracts/access/Ownable.sol";
import "./interfaces/IERC20.sol";

contract Reward is Ownable {
    address public devAddress;
    address public rewardToken;
    
    event RewardEvent(address indexed, uint256 amountSVC ,uint256 amountBNB);

    constructor(address _rewardToken, address _devAddress) public {
        rewardToken = _rewardToken;
        devAddress = _devAddress;
    }

    modifier onlyDev() {
        require(
            devAddress == msg.sender,
            "Permisition Error: caller is not the dev"
        );
        _;
    }

    function reward(
        address recipient,
        uint256 amountSVC,
        uint256 amountBNB
    ) external onlyDev returns (bool success) {
        // rewardToken.transferFrom(REWARD_WALLET, recipient, amountSVC);
        // payable(recipient).transfer(amountBNB);
        require(amountSVC <= 5000 * 10**18, "Reward Quiz: amountSVC too much");
        require(amountBNB <= 0.001 * 10**18, "Reward Quiz: amountBNB too much");
        TransferHelper.safeTransfer(rewardToken, recipient, amountSVC);
        TransferHelper.safeTransferETH(recipient, amountBNB);
        RewardEvent(recipient, amountSVC, amountBNB);
        return true;
    }

    function withdrawAll() external onlyOwner returns (bool success) {
        TransferHelper.safeTransfer(rewardToken, msg.sender, getBalanceTokenReward());
        TransferHelper.safeTransferETH(msg.sender, address(this).balance);
        return true;
    }

    function setDevAddress(address newDevAddress) public onlyOwner {
        require(newDevAddress != address(0), 'DevAddress: new devAddress is the zero address');
        devAddress = newDevAddress;
    }

    function setReward(address newReward) public onlyOwner {
        require(newReward != address(0), 'DevAddress: new reward is the zero address');
        rewardToken = newReward;
    }

    function getBalanceTokenReward() public view returns(uint256) {
        IERC20 t = IERC20(rewardToken);
        return (t.balanceOf(address(this)));
    }

    function getBalanceETH() external view returns (uint256) {
        return address(this).balance;
    }
    receive() external payable {}
}
