require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: "./app/src/artifacts",
  },
  networks: {
    localhost: {
      chainId: 31337,
    },
    sepolia: {
      url: process.env.SEPOLIA_API_KEY,
      chainId: 11155111,
      blockConfirmations: 6,
      gasPrice: 35000000000,
      accounts: [PRIVATE_KEY],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
    player: {
      default: 1,
    },
  },
};
