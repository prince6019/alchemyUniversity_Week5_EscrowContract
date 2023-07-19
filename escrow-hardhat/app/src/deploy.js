import { ethers } from "ethers";
import Escrow from "./artifacts/contracts/Escrow.sol/Escrow";

export default async function deploy(signer, arbiter, beneficiary, value) {
  // const provider = new ethers.providers.JsonRpcProvider(
  //   "JMNm-wz06jVXXLqOxf4tNkk9afrZFzCF"
  // );
  // const wallet = new ethers.Wallet(signer, provider);

  const factory = new ethers.ContractFactory(
    Escrow.abi,
    Escrow.bytecode,
    signer
  );
  return factory.deploy(arbiter, beneficiary, { value });
}

//0x2E9094557FA0b53C244ff8E012e8257d3D5595D9
// 0x86511615D2bA2641d86Aa10B725b204419170BE2
