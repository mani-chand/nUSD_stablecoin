// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract nUSD is ERC20 {
    address internal owner;

    constructor() ERC20("Nusd", "Nusd") {
        ethUsdPriceFeed = AggregatorV3Interface(
            0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
        );
    }

    AggregatorV3Interface internal ethUsdPriceFeed;

    mapping(address => uint256) public balances;

    function redeem(uint256 nUsdAmount) external {
        uint usrBalance = balanceOf(msg.sender);
        require(nUsdAmount < usrBalance, "nUSD amount must be greater than zero.");
        uint256 ethAmount = usrBalance/getEthPrice();
        console.log("paying", ethAmount);
        _burn(msg.sender, nUsdAmount);
        (bool success, ) = msg.sender.call{value: ethAmount}("");
        require(success, "ETH transfer failed.");

        // Emit event
        emit Redeem(msg.sender, nUsdAmount, ethAmount);
    }

    function getEthPrice() public view returns (uint256) {
        (, int256 price, , , ) = ethUsdPriceFeed.latestRoundData();
        require(price > 0, "Invalid ETH price.");
        return uint256(price)/10**8;
    }

    // Events
    event Deposit(address indexed user, uint256 ethAmount, uint256 nUsdAmount);
    event Redeem(address indexed user, uint256 nUsdAmount, uint256 ethAmount);
    function deposit() external payable {
        require(msg.value > 0, "ETH amount must be greater than zero.");
        console.log(getEthPrice());
        // Calculate nUSD amount
        uint256 nUsdAmount = getEthPrice()*(msg.value);
        console.log("deposited", nUsdAmount/10**18);
        _mint(msg.sender,nUsdAmount/10**18);
        // Emit event
        emit Deposit(msg.sender, msg.value, nUsdAmount);
    }
}
