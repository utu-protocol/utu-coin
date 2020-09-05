const { expect } = require("chai")
const { ethers, config } = require("@nomiclabs/buidler")

describe("Token", function() {
	beforeEach(async function() {
		const accounts = (await ethers.getSigners()).reverse()
		this.owner = accounts.pop()
		this.accounts = accounts

		this.cap = (ethers.BigNumber.from('1')).mul((ethers.BigNumber.from('10')).pow(ethers.BigNumber.from('9'))) // 1 * 10^6
		this.factory = await ethers.getContractFactory("UTUToken")
		this.contract = await this.factory.deploy(this.cap, [], [])
		await this.contract.deployed()
	})

	context("Initialize", function() {
		it("should deploy", async function() {
			const instance = await this.factory.deploy(this.cap, [], [])
			await instance.deployed()
			expect(await instance.cap()).to.equal(this.cap)
		})

		it("should deploy and mint tokens", async function() {
			const holders = this.accounts.map(async a => { return await a.getAddress()})
			const balances = holders.map(h => { return 1 })
			const supply = balances.reduce((a, c) => a + c)
			const instance = await this.factory.deploy(this.cap, holders, balances)
			await instance.deployed()
			expect(await instance.totalSupply()).to.equal(supply)
		})

		it("should fail to deploy with 0 cap", async function() {
			await expect(this.factory.deploy(0, [], [])).to.be.reverted
		})

		it("should fail to deploy with mismatching initial arrays", async function() {
			const aOne = await this.accounts[0].getAddress()
			await expect(this.factory.deploy(this.cap, [aOne], [])).to.be.revertedWith('UTU: mismatching array lengths')
		})
	})

	context("Access", function() {
		it("should have no default admins", async function() {
			expect(await this.contract.getRoleMemberCount(await this.contract.DEFAULT_ADMIN_ROLE())).not.to.be.gt(0)
		})

		it("should not allow to use grantRole by owner", async function() {
			const notOwner = await this.accounts[0].getAddress()
			const admin = await this.contract.DEFAULT_ADMIN_ROLE()
			await expect(this.contract.grantRole(admin, notOwner)).to.be.revertedWith('AccessControl: sender must be an admin to grant')
		})

		it("should not allow to use grantRole by non owner", async function() {
			const notOwner = this.accounts[0]
			const admin = await this.contract.DEFAULT_ADMIN_ROLE()
			await expect(this.contract.connect(notOwner).grantRole(admin, await notOwner.getAddress())).to.be.revertedWith('AccessControl: sender must be an admin to grant')
		})

		it("should allow only owner to set burner", async function() {
			const notOwner = this.accounts[0]
			await expect(this.contract.connect(notOwner).setupBurner(await this.accounts[1].getAddress())).to.be.revertedWith('Ownable: caller is not the owner')
		})

		it("should allow only owner to set minter", async function() {
			const notOwner = this.accounts[0]
			await expect(this.contract.connect(notOwner).setupMinter(await this.accounts[1].getAddress())).to.be.revertedWith('Ownable: caller is not the owner')
		})

	})

});
