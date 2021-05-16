const fs = require('fs');
const { ethers, config } = require("hardhat");
const deployArgs = require('./deploy.args');

// This expects a wallet.json with the default Ethereum keystore format and the
// unlock password in the WALLET_PASSWORT environment var.

async function deploy() {
	const j = fs.readFileSync('wallet.json', 'utf8');
	const w  = await new ethers.Wallet.fromEncryptedJson(j, process.env.WALLET_PASSWORD);
	const ip = new ethers.providers.JsonRpcProvider(config.networks.homestead.url);
	const wallet = w.connect(ip);

	const [ cap, initialHolders, initialBalances ] = deployArgs;

	console.log(`Deploying`)
	const tokenFactory = await ethers.getContractFactory("UTUToken", wallet);
	const overrides = undefined; // { gasPrice: 2, gasLimit: 8000000 }; // <- used this for Ropsten
	const token = await tokenFactory.deploy(cap, initialHolders, initialBalances);
	await token.deployed();
	console.log(`UTU token deployed at ${token.address}`);
}

deploy().catch(err => { console.log(err); })

