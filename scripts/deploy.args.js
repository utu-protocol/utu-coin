const { ethers } = require("hardhat");

module.exports = [
	ethers.utils.parseEther("1000000000").toString(),
	[ "0xbBd8ed971A0C47EfbA5906A03f903736D3018Fe7", "0x0aB5ddA6f096E127AF74d4b64A101ac6C43FA128", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" ],
	[ ethers.utils.parseEther("1000"), ethers.utils.parseEther("1000"), ethers.utils.parseEther("1000") ]
]
