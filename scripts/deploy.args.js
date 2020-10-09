const { ethers } = require("@nomiclabs/buidler");

module.exports = [
	ethers.utils.parseEther("1000000000").toString(),
	[
		"0x792d584c18fF3bf2e5C790A09336E73ed008e722", // (Growth Round): 308,545,455
		"0xDCF12A4479EB7502ac4256C31F94531Be875F54a", // (Ecosystem Growth Pool): 300,000,000
		"0xc9e408B9A4327F92927906312D12f5018c2F379A", // (UTU Protocol): 300,000,000
		"0x1cc2A96E6d8E25B60DDE8DDb4C7e28Af9021A905" // Uniswap 1,250,000
	],
	[
		ethers.utils.parseEther("308545455").toString(),
		ethers.utils.parseEther("300000000").toString(),
		ethers.utils.parseEther("300000000").toString(),
		ethers.utils.parseEther("1250000").toString()
	]
]
