usePlugin("@nomiclabs/buidler-waffle");
usePlugin("buidler-gas-reporter");
usePlugin("@nomiclabs/buidler-solhint");
usePlugin("@nomiclabs/buidler-etherscan");
usePlugin("@nomiclabs/buidler-ganache");
usePlugin("solidity-coverage");
usePlugin('buidler-contract-sizer');

// You have to export an object to set up your config
// This object can have the following optional entries:
// defaultNetwork, networks, solc, and paths.
// Go to https://buidler.dev/config/ to learn more
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
		coverage: {
			url: 'http://localhost:8555'
		}
		//ganache: {
		//gasLimit: 6000000000,
		//defaultBalanceEther: 10
		//}
	},
	solc: {
		version: "0.6.12",
	},
};
