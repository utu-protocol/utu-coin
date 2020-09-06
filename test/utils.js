const { ethers, config } = require("@nomiclabs/buidler")

async function increaseTime(duration) {
  await ethers.provider.send("evm_increaseTime", [duration])
  await ethers.provider.send("evm_mine")
}

module.exports = {
	increaseTime: increaseTime
}
