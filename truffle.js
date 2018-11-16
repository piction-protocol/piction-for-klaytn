require('dotenv-flow').config({default_node_env: 'klaytn'});
var HDWalletProvider = require("truffle-hdwallet-provider-privkey");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(process.env.PRIVATE_KEY, "https://ropsten.infura.io/"),
      network_id: 3,
      gas: 7000000,
      gasPrice: 100000000000
    },
    klaytn: {
      provider: new HDWalletProvider(process.env.PRIVATE_KEY, "http://52.78.136.229:8551/"),
      network_id: 1000,
      gas: 20000000, // transaction gas limit
      gasPrice: 25000000000, // gasPrice of Aspen is 25 Gpeb
    }
  }
};
