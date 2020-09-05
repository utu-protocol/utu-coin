usePlugin("@nomiclabs/buidler-waffle");
usePlugin("buidler-gas-reporter");
usePlugin("@nomiclabs/buidler-solhint");
usePlugin("@nomiclabs/buidler-etherscan");
usePlugin("@nomiclabs/buidler-ganache");
usePlugin("solidity-coverage");

// You have to export an object to set up your config
// This object can have the following optional entries:
// defaultNetwork, networks, solc, and paths.
// Go to https://buidler.dev/config/ to learn more
module.exports = {
  // This is a sample solc configuration that specifies which version of solc to use
	gasReporter: {
    enabled: (process.env.REPORT_GAS) ? true : false
  },
  //defaultNetwork: "ganache",
  networks: {
		remote: {
			url: "http://localhost:8540",
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
