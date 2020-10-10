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
	const initialHolders = [
		"0xf4760E54f5B5A9FC472B752fDeAcD86951f330bf", // (Growth Round): 308,545,455
		"0x3F5D87F59BB411730235f4b65844A6937E2E651F", // (Ecosystem Growth Pool): 300,000,000
		"0xEE0e833Ac9227171E9fEbF3F665Fdec57595660f", // (UTU Protocol): 300,000,000
		"0x6510a1e08c721F379Cf8F0f7c62f6Ee640eD8a9c" // Uniswap 1,250,000
	];

	const initialBalances = [
		ethers.utils.parseEther("308545455"),
		ethers.utils.parseEther("300000000"),
		ethers.utils.parseEther("300000000"),
		ethers.utils.parseEther("1250000")
	];

	console.log(`Deploying`)
	const tokenFactory = await ethers.getContractFactory("UTUToken", wallet);
	const token = await tokenFactory.deploy(cap, initialHolders, initialBalances);
	await token.deployed();
	console.log(`UTU token deployed at ${token.address}`);
}

deploy().catch(err => { console.log(err); })

