// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/ECDSA.sol";

// Signature Verification
/// @title Implement off-chain whitelist and on-chain verification

contract Signature {
    // Using Openzeppelin ECDSA cryptography library
    address public signer = 0x19f24082Bc35dC59a154bAb9c8B09bC0eA577a18;

    function getMessageHash(
        uint256 _amount,
        address _user,
        uint256 _nonce
    ) public pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    _amount,
                    _user,
                    _nonce
                )
            );
    }

    function getClaimRewardMessageHash(
        uint256[] memory _amount,
        address _user,
        uint256 _nonce
    ) public pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    _amount,
                    _user,
                    _nonce
                )
            );
    }

    // Verify signature function
    function _verifySignature(
        bytes32 _msgHash,
        bytes memory signature
    ) public view returns (bool) {
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(_msgHash);

        return getSignerAddress(ethSignedMessageHash, signature) == signer;
    }


    function getSignerAddress(bytes32 _messageHash, bytes memory _signature)
        public
        pure
        returns (address)
    {
        return ECDSA.recover(_messageHash, _signature);
    }

    // Split signature to r, s, v
    function splitSignature(bytes memory _signature)
        public
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(_signature.length == 65, "invalid signature length");

        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }
    }

    function getEthSignedMessageHash(bytes32 _messageHash)
        public
        pure
        returns (bytes32)
    {
        return ECDSA.toEthSignedMessageHash(_messageHash);
    }
}