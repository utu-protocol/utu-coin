usePlugin("@nomiclabs/buidler-waffle");
usePlugin("buidler-gas-reporter");
usePlugin("@nomiclabs/buidler-solhint");
usePlugin("@nomiclabs/buidler-etherscan");
usePlugin("@nomiclabs/buidler-ganache");

// This is a sample Buidler task. To learn how to create your own go to
// https://buidler.dev/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.getAddress());
  }
});

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
			url: "http://172.16.47.20:8540",
		},
    //ganache: {
      //gasLimit: 6000000000,
      //defaultBalanceEther: 10
    //}
  },
  solc: {
    version: "0.6.12",
  },
};
