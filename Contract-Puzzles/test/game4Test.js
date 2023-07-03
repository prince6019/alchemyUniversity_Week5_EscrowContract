const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("Game4", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game4");
    const game = await Game.deploy();

    const signer = ethers.provider.getSigner(0);
    const signer1 = ethers.provider.getSigner(1);

    return { game, signer, signer1 };
  }
  it("should be a winner", async function () {
    const { game, signer, signer1 } = await loadFixture(
      deployContractAndSetVariables
    );

    // nested mappings are rough :}
    const addr = await signer.getAddress();
    const addr1 = await signer1.getAddress();
    await game.connect(signer).write(addr1);
    await game.connect(signer1).write(addr);

    await game.connect(signer).win(addr1);

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
