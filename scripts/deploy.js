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
		"0x792d584c18fF3bf2e5C790A09336E73ed008e722", // (Growth Round): 308,545,455
		"0xDCF12A4479EB7502ac4256C31F94531Be875F54a", // (Ecosystem Growth Pool): 300,000,000
		"0xc9e408B9A4327F92927906312D12f5018c2F379A", // (UTU Protocol): 300,000,000
		"0x1cc2A96E6d8E25B60DDE8DDb4C7e28Af9021A905" // Uniswap 1,250,000
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

