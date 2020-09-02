// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/math/Math.sol";

/**
 * @title The Token contract.
 *
 */
contract UTUToken is ERC20Capped, Ownable, AccessControl {
	using SafeERC20 for ERC20;
	// Events used for logging
	bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
	bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
	bytes32 public constant RECOVERY_ROLE = keccak256("RECOVERY_ROLE");

	bool public initialized = false;

	// Gets called before any token transfer
	function _beforeTokenTransfer(address _from, address _to, uint256 _amount)
		internal
		virtual
		override
	{
		super._beforeTokenTransfer(_from, _to, _amount);
	}

	/**
	 * Create a new Token contract.
	 *
	 *  @param _cap Token cap.
	 */
	constructor(
		uint256 _cap,
		address[] memory _initialHolders,
		uint256[] memory _initialBalances
	)
		public
		ERC20Capped(_cap)
		ERC20("UTU Token", "UTU")
	{
		require(_initialHolders.length == _initialBalances.length, "UTU: mismatching array lengths");
		for (uint8 i = 0 ; i < _initialHolders.length; i++) {
			_mint(_initialHolders[i], _initialBalances[i]);
		}
	}

	/**
	 * @dev Assign a new minter.
	 * @param _who address of the new minter.
	 */
	function setupMinter(address _who) public onlyOwner {
		_setupRole(MINTER_ROLE, _who);
	}

	/**
	 * @dev Assign a new burner.
	 * @param _who address of the new burner.
	 */
	function setupBurner(address _who) public onlyOwner {
		_setupRole(BURNER_ROLE, _who);
	}

	/**
	 * @dev Assign someone who can recover ETH and Tokens sent to this contract.
	 * @param _who address of the recoverer.
	 */
	function setupRecovery(address _who) public onlyOwner {
		_setupRole(RECOVERY_ROLE, _who);
	}

	// TODO: Maybe add a boolean to disable minting after migration has started?
	/**
	 * @dev Mint new tokens and transfer them.
	 * @param to address Recipient of newly minted tokens.
	 * @param amount uint256 amount of tokens to mint.
	 */
	function mint(address to, uint256 amount) public {
		require(hasRole(MINTER_ROLE, msg.sender), "Caller not a minter");
		_mint(to, amount);
	}

	/**
	 * @dev Burn tokens belonging to the caller.
	 * @param from address Address which is going to have its tokens burnt.
	 * @param amount uint256 amount of tokens to burn.
	 */
	function burn(uint256 amount) public {
		require(hasRole(BURNER_ROLE, msg.sender), "Caller not a burner");
		_burn(msg.sender, amount);
	}

	/**
	 * Recover tokens accidentally sent to the token contract.
	 *  @param _token Address of the token to be recovered
	 *  @param _to Recipient of the recovered tokens
	 *  @param _balance Amount of tokens to be recovered
	 */
	function recoverTokens(address _token, address payable _to, uint256 _balance)
		external
	{
		require(hasRole(RECOVERY_ROLE, msg.sender), "Caller cannot recover");
		require(_to != address(0), "cannot recove to zero address");

		if (_token == address(0)) { // Recover Eth
			uint256 total = address(this).balance;
			uint256 balance = _balance == 0 ? total : Math.min(total, _balance);
			_to.transfer(balance);
		} else {
			uint256 total = ERC20(_token).balanceOf(address(this));
			uint256 balance = _balance == 0 ? total : Math.min(total, _balance);
			ERC20(_token).safeTransfer(_to, balance);
		}
	}
}
