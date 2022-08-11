// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/Uniswap/solidity-lib/blob/master/contracts/libraries/TransferHelper.sol";
import "./libraries/Signature.sol";
import "./interfaces/IERC20.sol";

contract Recover is Signature, Ownable {
    address public rewardToken;

    constructor(address _rewardToken) public {
        rewardToken = _rewardToken;
    }

    function claimReward(
        uint256 _amount,
        address _user,
        uint256 _nonce,
        bytes memory _signature
    ) public {
        bytes32 msgHash = getMessageHash(_amount, _user, _nonce);

        require(
            _verifySignature(msgHash, _signature),
            "StakingPool: invalid signature"
        );

        TransferHelper.safeTransfer(rewardToken, _user, _amount);
    }

    function withdrawAll() external onlyOwner returns (bool success) {
        TransferHelper.safeTransfer(
            rewardToken,
            msg.sender,
            getBalanceTokenReward()
        );
        TransferHelper.safeTransferETH(msg.sender, address(this).balance);
        return true;
    }

    function getBalanceTokenReward() public view returns (uint256) {
        IERC20 t = IERC20(rewardToken);
        return (t.balanceOf(address(this)));
    }

    function setReward(address newReward) public onlyOwner {
        require(newReward != address(0), "New reward is the zero address");
        rewardToken = newReward;
    }
}
