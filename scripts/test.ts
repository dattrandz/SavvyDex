const EthCrypto = require("eth-crypto");
const { soliditySha3 } = require("web3-utils");

const privateKey =
  "980eb878af9094ff7e948f628c54c3be99f16a429995a669f7861119becba22a";
const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);
const address = EthCrypto.publicKey.toAddress(publicKey);

const message = EthCrypto.hash.keccak256([
  {
    type: "uint256",
    value: "1",
  },
  {
    type: "address",
    value: "0x19f24082Bc35dC59a154bAb9c8B09bC0eA577a18",
  },
  {
    type: "uint256",
    value: "0",
  },
]);

const toEthSignedMessageHash = soliditySha3(
  "\x19Ethereum Signed Message:\n32",
  message
);

const signature = EthCrypto.sign(privateKey, toEthSignedMessageHash);

console.log(`message: ${message}`);
console.log(`toEthSignedMessageHash: ${toEthSignedMessageHash}`);
console.log(`signature: ${signature}`);
