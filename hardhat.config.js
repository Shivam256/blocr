require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.16",
  networks: {
    hardhat:{

    },
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [process.env.METAMASK_PRIVATE_KEY],
    },
    sepolia:{
      url:process.env.SEPOLIA_URL,
      accounts:[process.env.METAMASK_PRIVATE_KEY]
    },
    mumbai:{
      url:process.env.MUMBAI_URL,
      accounts:[process.env.METAMASK_PRIVATE_KEY]
    }
  },
};
