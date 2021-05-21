require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-solhint");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ganache");
require("solidity-coverage");
require('hardhat-contract-sizer');

// You have to export an object to set up your config
// This object can have the following optional entries:
// defaultNetwork, networks, solc, and paths.
// Go to https://hardhat.dev/config/ to learn more
module.exports = {
	gasReporter: {
    enabled: (process.env.REPORT_GAS) ? true : false
  },
	etherscan: { apiKey: process.env.ETHERSCAN_API },
  //defaultNetwork: "ganache",
  networks: {
		remote: {
			url: "http://localhost:8540",
		},
		homestead: {
			url: process.env.WEB3_API || "",
		},
		bsc_mainnet: {
			url: "https://bsc-dataseed.binance.org"
		},
		bsc_testnet: {
			// "--network bsc_testnet" didn't work when deploying; I used the default (homestead) instead and set WEB3_API
			url: "https://data-seed-prebsc-1-s1.binance.org:8545"
		},
		coverage: {
			url: 'http://localhost:8555'
		}
		//ganache: {
		//gasLimit: 6000000000,
		//defaultBalanceEther: 10
		//}
	},
	solidity: {
		version: "0.6.12",
	},
};
