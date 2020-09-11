const { expect } = require("chai")
const { ethers, config, waffle } = require("@nomiclabs/buidler")
const { increaseTime } = require('./utils.js')
const { deployMockContract } = waffle
const IERC20 = require('@openzeppelin/contracts/build/contracts/IERC20.json')

describe("Token", function() {
	beforeEach(async function() {
		const accounts = (await ethers.getSigners()).reverse()
		this.owner = accounts.pop()
		this.accounts = accounts

		this.cap = (ethers.BigNumber.from('1')).mul((ethers.BigNumber.from('10')).pow(ethers.BigNumber.from('9'))) // 1 * 10^6
		this.factory = await ethers.getContractFactory("UTUToken")
		this.contract = await this.factory.deploy(this.cap, [], [])
		this.tokenMock = await deployMockContract(this.owner, IERC20.abi)
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

	context("Migration", function() {
		it("should let owner start migration", async function() {
			await this.contract.startMigration()
			expect(await this.contract.isMigrating()).to.be.true
		})

		it("should not let non-owner start migration", async function() {
			const notOwner = this.accounts[0]
			await expect(this.contract.connect(notOwner).startMigration()).to.be.revertedWith('Ownable: caller is not the owner')
		})

		it("should not allow minting while migrating", async function() {
			const minter = this.accounts[0]
			const minterAddr = await minter.getAddress()
			await this.contract.startMigration()
			await this.contract.setupMinter(minterAddr)
			await expect(this.contract.connect(minter).mint(minterAddr, 1)).to.be.revertedWith('cannot mint while migrating')
		})
	})

	context("Recovery", async function() {
		let recovery, recoveryAddr
		beforeEach(async function() {
			recovery = this.accounts[0]
			recoveryAddr = await recovery.getAddress()
			await this.contract.setupRecovery(recoveryAddr)
			await increaseTime(2 * 24 * 60 * 60 + 1)
		})

		it("should not allow recovery to zero address", async function() {
			await expect(this.contract.connect(recovery).recoverTokens(ethers.constants.AddressZero, ethers.constants.AddressZero, 1)).to.be.revertedWith('cannot recover to zero address')
		})

		it("should allow recovery of ERC20", async function() {
			//console.log(IERC20.abi)
			await this.tokenMock.mock.balanceOf.withArgs(this.contract.address).returns(100)
			await this.tokenMock.mock.transfer.returns(true)
			await expect(this.contract.connect(recovery).recoverTokens(this.tokenMock.address, recoveryAddr, 100)).to.not.be.reverted
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

		it("should not allow burning before activation period", async function() {
			const burner = this.accounts[0]
			const burnerAddr = await burner.getAddress()
			await this.contract.setupBurner(burnerAddr)
			await expect(this.contract.connect(burner).burn(1)).to.be.revertedWith('time lock active')
		})

		it("should not allow minting before activation period", async function() {
			const minter = this.accounts[0]
			const minterAddr = await minter.getAddress()
			await this.contract.setupMinter(minterAddr)
			await expect(this.contract.connect(minter).mint(minterAddr, 1)).to.be.revertedWith('time lock active')
		})

		it("should not allow recovery before activation period", async function() {
			const recovery = this.accounts[0]
			const recoveryAddr = await recovery.getAddress()
			await this.contract.setupRecovery(recoveryAddr)
			await expect(this.contract.connect(recovery).recoverTokens(ethers.constants.AddressZero, recoveryAddr, 1)).to.be.revertedWith('time lock active')
		})

		it("should allow minting after activation period", async function() {
			const minter = this.accounts[0]
			const minterAddr = await minter.getAddress()
			await this.contract.setupMinter(minterAddr)
			await increaseTime(2 * 24 * 60 * 60 + 1)
			await expect(this.contract.connect(minter).mint(minterAddr, 1)).to.emit(this.contract, 'Transfer')
		})

		it("should allow burning after activation period", async function() {
			const minter = this.accounts[0]
			const minterAddr = await minter.getAddress()
			await this.contract.setupMinter(minterAddr)

			const burner = this.accounts[0]
			const burnerAddr = await burner.getAddress()
			await this.contract.setupBurner(burnerAddr)

			await increaseTime(2 * 24 * 60 * 60 + 1)
			this.contract.connect(minter).mint(burnerAddr, 1)
			await expect(this.contract.connect(burner).burn(1))
				.to.emit(this.contract, 'Transfer')
				.withArgs(burnerAddr, ethers.constants.AddressZero, 1)
		})

		it("should not allow minting after role was renounced", async function() {
			const minter = this.accounts[0]
			const minterAddr = await minter.getAddress()
			const minterRole = await this.contract.MINTER_ROLE()
			await this.contract.setupMinter(minterAddr)
			await increaseTime(2 * 24 * 60 * 60 + 1)
			await expect(this.contract.connect(minter).mint(minterAddr, 1)).to.emit(this.contract, 'Transfer')
			await expect(this.contract.connect(minter).renounceRole(minterRole, minterAddr)).to.emit(this.contract, 'RoleRevoked')
			await expect(this.contract.connect(minter).mint(minterAddr, 1)).to.be.revertedWith('Caller not a minter')
		})

		it("should not allow owner to revoke role", async function() {
			const minter = this.accounts[0]
			const minterAddr = await minter.getAddress()
			const minterRole = await this.contract.MINTER_ROLE()
			await this.contract.setupMinter(minterAddr)
			await expect(this.contract.revokeRole(minterRole, minterAddr)).to.be.revertedWith('sender must be an admin to revoke')
		})

	})

});
