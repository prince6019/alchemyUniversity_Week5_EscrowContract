const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();

    return { game };
  }
  it("should be a winner", async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    const threshold = "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf";
    // good luck
    let signer,
      i = 0;
    while (true) {
      signer = ethers.provider.getSigner(i);
      if (signer < threshold) {
        break;
      }
      i++;
    }

    await game.connect(await signer.getAddress()).win();

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
