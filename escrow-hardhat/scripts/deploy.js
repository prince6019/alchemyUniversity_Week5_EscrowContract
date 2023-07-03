const { ethers } = require("hardhat");

async function main() {
  const EscrowFactory = await ethers.getContractFactory("Escrow");
  const arguments = [];
  const escrow = await EscrowFactory.deploy(arguments);

  console.log("escrow contract deployed at :", escrow.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
