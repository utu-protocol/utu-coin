const fs = require('fs');
const { ethers, config } = require("@nomiclabs/buidler");

// This expects a wallet.json with the default Ethereum keystore format and the
// unlock password in the WALLET_PASSWORT environment var.

async function deploy() {
	const j = fs.readFileSync('wallet.json', 'utf8');
	const w  = await new ethers.Wallet.fromEncryptedJson(j, process.env.WALLET_PASSWORD);
	const ip = new ethers.providers.JsonRpcProvider(config.networks.homestead.url);
	const wallet = w.connect(ip);

	const cap = ethers.utils.parseEther("1000000000"); // 1B

	// https://github.com/utu-protocol/token/issues/1
	const initialHolders = [];

	const initialBalances = [];

	console.log(`Deploying`)
	const tokenFactory = await ethers.getContractFactory("UTUToken", wallet);
	const token = await tokenFactory.deploy(cap, initialHolders, initialBalances);
	await token.deployed();
	console.log(`UTU token deployed at ${token.address}`);
}

deploy().catch(err => { console.log(err); })

