const { ethers } = require("@nomiclabs/buidler");

module.exports = [
	ethers.utils.parseEther("1000000000").toString(),
	[
		"0xf4760E54f5B5A9FC472B752fDeAcD86951f330bf", // (Growth Round): 308,545,455
		"0x3F5D87F59BB411730235f4b65844A6937E2E651F", // (Ecosystem Growth Pool): 300,000,000
		"0xEE0e833Ac9227171E9fEbF3F665Fdec57595660f", // (UTU Protocol): 300,000,000
		"0x6510a1e08c721F379Cf8F0f7c62f6Ee640eD8a9c" // Uniswap 1,250,000
	],
	[
		ethers.utils.parseEther("308545455").toString(),
		ethers.utils.parseEther("300000000").toString(),
		ethers.utils.parseEther("300000000").toString(),
		ethers.utils.parseEther("1250000").toString()
	]
]
