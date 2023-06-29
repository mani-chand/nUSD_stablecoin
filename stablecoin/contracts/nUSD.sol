// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract nUSD is ERC20 {
    address internal owner;

    constructor() ERC20("Nusd", "Nusd") {
        ethUsdPriceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
    }

    AggregatorV3Interface internal ethUsdPriceFeed;

    mapping(address => uint256) public balances;

    function redeem(uint256 nUsdAmount) external {
        require(nUsdAmount > 0, "nUSD amount must be greater than zero.");
        // Calculate ETH amount (double the nUSD value)
        uint256 ethAmount = getEthPrice() * nUsdAmount * 2;
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
        return uint256(price);
    }

    // Events
    event Deposit(address indexed user, uint256 ethAmount, uint256 nUsdAmount);
    event Redeem(address indexed user, uint256 nUsdAmount, uint256 ethAmount);
    function deposit() external payable {
        require(msg.value > 0, "ETH amount must be greater than zero.");

        // Calculate nUSD amount (50% of ETH value)
        uint256 nUsdAmount = ((msg.value * 50) / 100);
        console.log("deposite", nUsdAmount);
        _mint(msg.sender, nUsdAmount);
        // Emit event
        emit Deposit(msg.sender, msg.value, nUsdAmount);
    }
}
