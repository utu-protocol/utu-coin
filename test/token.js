const { expect } = require("chai")
const { ethers, config } = require("@nomiclabs/buidler")

describe("Token", function() {
	beforeEach(async function() {
		const accounts = (await ethers.getSigners()).reverse()
		this.owner = accounts.pop()
		this.accounts = accounts

		const cap = (ethers.BigNumber.from('1')).mul((ethers.BigNumber.from('10')).pow(ethers.BigNumber.from('9'))) // 1 * 10^6
		this.contract = await (await ethers.getContractFactory("UTUToken")).deploy(cap, [], [])
		await this.contract.deployed()
	})

	context("Initialize", function() {
		it("should deploy", async function() {
			const contract = await ethers.getContractFactory("UTUToken");
			const cap = (ethers.BigNumber.from('1')).mul((ethers.BigNumber.from('10')).pow(ethers.BigNumber.from('9'))) // 1 * 10^6
			const instance = await contract.deploy(cap, [], [])
			await instance.deployed()
			expect(await instance.cap()).to.equal(cap)
		})

		it("should fail to deploy with 0 cap", async function() {
			const contract = await ethers.getContractFactory("UTUToken");
			await expect(contract.deploy(0, [], [])).to.be.reverted
		})

		it("should fail to deploy with mismatching initial arrays", async function() {
			const contract = await ethers.getContractFactory("UTUToken");
			const cap = (ethers.BigNumber.from('1')).mul((ethers.BigNumber.from('10')).pow(ethers.BigNumber.from('9'))) // 1 * 10^6
			await expect(contract.deploy(cap, [addr1.address], [])).to.be.reverted
		})

	})
});
